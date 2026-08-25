#!/usr/bin/env python3
"""Relevo de voz Aria para el curso de ingles.

Por que existe: la voz que Dosa eligio (en-US-AriaNeural, la misma de los clips
pregrabados del curso) viene del servicio de Edge, y Microsoft NO sirve audio a
las IPs de datacenter de Cloudflare — el worker completa el handshake pero no
recibe un solo byte. Desde esta VM de GCP si funciona, asi que el worker le
pide el audio a este servicio.

Escucha SOLO en localhost: lo publico es el tunel de Cloudflare, que ya corre
en esta maquina para el panel del bot. Pide una cabecera X-Clave que comparte
con el worker.

    python3 voz-aria.py            # puerto 8078
"""

import asyncio
import hashlib
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import edge_tts

PUERTO = int(os.environ.get("VOZ_PUERTO", "8078"))
CLAVE = os.environ.get("VOZ_CLAVE", "")
VOZ = "en-US-AriaNeural"
RITMO = "-10%"          # el mismo de los clips pregrabados, para que suene igual
MAX_TEXTO = 800
CACHE_DIR = "/home/iris/voz-cache"
MAX_CACHE = 400          # ficheros; la e2-micro tiene poco disco


def genera(texto: str) -> bytes:
    async def _run():
        tts = edge_tts.Communicate(texto, VOZ, rate=RITMO)
        trozos = bytearray()
        async for chunk in tts.stream():
            if chunk["type"] == "audio":
                trozos.extend(chunk["data"])
        return bytes(trozos)

    return asyncio.run(_run())


def del_cache(texto: str):
    os.makedirs(CACHE_DIR, exist_ok=True)
    nombre = os.path.join(CACHE_DIR, hashlib.sha1(texto.encode("utf-8")).hexdigest()[:16] + ".mp3")
    if os.path.exists(nombre) and os.path.getsize(nombre) > 500:
        with open(nombre, "rb") as f:
            return f.read()
    audio = genera(texto)
    if audio:
        with open(nombre, "wb") as f:
            f.write(audio)
        limpia_cache()
    return audio


def limpia_cache():
    """Deja los MAX_CACHE mas recientes: la VM tiene poco disco."""
    try:
        ficheros = [os.path.join(CACHE_DIR, f) for f in os.listdir(CACHE_DIR) if f.endswith(".mp3")]
        if len(ficheros) <= MAX_CACHE:
            return
        ficheros.sort(key=os.path.getmtime)
        for f in ficheros[: len(ficheros) - MAX_CACHE]:
            os.unlink(f)
    except OSError:
        pass


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # sin ruido en el journal

    def responde(self, codigo, cuerpo, tipo="application/json; charset=utf-8"):
        self.send_response(codigo)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def do_GET(self):
        if self.path == "/salud":
            self.responde(200, b'{"ok":true}')
        else:
            self.responde(404, b'{"error":"no existe"}')

    def do_POST(self):
        if self.path != "/voz":
            return self.responde(404, b'{"error":"no existe"}')
        if CLAVE and self.headers.get("X-Clave", "") != CLAVE:
            return self.responde(401, b'{"error":"clave"}')
        try:
            largo = int(self.headers.get("Content-Length", "0"))
            datos = json.loads(self.rfile.read(largo) or b"{}")
            texto = str(datos.get("texto", "")).strip()[:MAX_TEXTO]
            if not texto:
                return self.responde(400, b'{"error":"sin texto"}')
            audio = del_cache(texto)
            if not audio:
                return self.responde(502, b'{"error":"sin audio"}')
            self.responde(200, audio, "audio/mpeg")
        except Exception as e:  # noqa: BLE001 - el servicio no debe morir por una peticion
            self.responde(500, json.dumps({"error": str(e)[:200]}).encode("utf-8"))


if __name__ == "__main__":
    if not CLAVE:
        print("OJO: sin VOZ_CLAVE, el servicio acepta cualquier peticion local", file=sys.stderr)
    ThreadingHTTPServer(("127.0.0.1", PUERTO), Handler).serve_forever()
