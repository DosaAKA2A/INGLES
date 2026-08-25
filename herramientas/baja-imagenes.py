# Baja las ilustraciones generadas en Magnific, las deja a 480 px (que es el
# doble del hueco mas grande donde se ven, el de los ejercicios) y actualiza
# docs/img/manifest.js.
#
# La clave del manifiesto se normaliza IGUAL que claveImagen() en app.js
# (minusculas, solo a-z, apostrofo y espacio), o "t-shirt" no encontraria su
# fichero.
#
# Uso: python herramientas/baja-imagenes.py urls.json
#      urls.json = {"apple": "https://...", "book": "https://..."}

import hashlib
import io
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "docs" / "img"
MANIFIESTO = IMG / "manifest.js"
FFMPEG = Path.home() / "AppData/Roaming/Naviris/bin/ffmpeg.exe"
LADO = 480


def clave(texto):
    return re.sub(r"[^a-z' ]", "", str(texto).lower()).strip()


def lee_manifiesto():
    if not MANIFIESTO.exists():
        return {}
    t = io.open(MANIFIESTO, encoding="utf-8").read()
    i, f = t.find("{"), t.rfind("}")
    if i < 0 or f < 0:
        return {}
    try:
        return json.loads(t[i:f + 1])
    except ValueError:
        return {}


def escribe_manifiesto(mapa):
    js = "/* Generado por herramientas/baja-imagenes.py — no editar a mano. */\n"
    js += "const IMG_MAPA = " + json.dumps(mapa, ensure_ascii=False, indent=0, sort_keys=True) + ";\n"
    io.open(MANIFIESTO, "w", encoding="utf-8").write(js)


def main():
    urls = json.loads(io.open(sys.argv[1], encoding="utf-8").read())
    IMG.mkdir(parents=True, exist_ok=True)
    mapa = lee_manifiesto()
    nuevos = 0
    for palabra, url in urls.items():
        k = clave(palabra)
        if not k:
            continue
        nombre = hashlib.sha1(k.encode("utf-8")).hexdigest()[:12] + ".jpg"
        destino = IMG / nombre
        crudo = IMG / ("_tmp_" + nombre)
        try:
            urllib.request.urlretrieve(url, crudo)
            # cuadrado exacto y 480 px: las fuentes vienen a 1024+ y pesan de mas
            subprocess.run(
                [str(FFMPEG), "-hide_banner", "-loglevel", "error", "-y", "-i", str(crudo),
                 "-vf", f"crop='min(iw,ih)':'min(iw,ih)',scale={LADO}:{LADO}",
                 "-q:v", "4", str(destino)],
                check=True)
            crudo.unlink(missing_ok=True)
            mapa[k] = nombre
            nuevos += 1
        except Exception as e:  # noqa: BLE001
            crudo.unlink(missing_ok=True)
            print("FALLO", palabra, e)
    escribe_manifiesto(mapa)
    peso = sum(f.stat().st_size for f in IMG.glob("*.jpg")) / 1048576
    print(f"nuevas: {nuevos} | total en el manifiesto: {len(mapa)} | {peso:.1f} MB")


if __name__ == "__main__":
    main()
