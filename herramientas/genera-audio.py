# Pregraba con voz neuronal (edge-tts, gratis) todas las frases de frases.json.
# La voz del navegador (speechSynthesis) sonaba robotica y en la maquina de Dosa
# ademas elegia una voz en ESPANOL, que leia "Hi" como "i". Con MP3 pregrabados
# el curso suena humano en cualquier navegador.
#
# Salida: docs/audio/<hash>.mp3 + docs/audio/manifest.js (texto -> fichero).
# Es incremental: los hashes que ya existen no se vuelven a pedir.
# Uso: python herramientas/genera-audio.py

import asyncio
import hashlib
import json
import sys
from pathlib import Path

import edge_tts

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "docs" / "audio"
VOCES = {"a": "en-US-AriaNeural", "b": "en-US-AndrewNeural"}
PARALELO = 8

def nombre(voz, texto):
    return hashlib.sha1((voz + "|" + texto).encode("utf-8")).hexdigest()[:12] + ".mp3"

async def graba(sem, voz, texto, destino, fallos):
    async with sem:
        for intento in range(3):
            try:
                tts = edge_tts.Communicate(texto, VOCES[voz], rate="-10%")
                await tts.save(str(destino))
                if destino.stat().st_size > 500:
                    return
                destino.unlink(missing_ok=True)
            except Exception:
                await asyncio.sleep(1.5 * (intento + 1))
        fallos.append((voz, texto))

async def principal():
    frases = json.loads((RAIZ / "frases.json").read_text(encoding="utf-8"))
    SALIDA.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(PARALELO)
    fallos = []
    tareas = []
    mapa = {}
    nuevos = 0
    for voz in ("a", "b"):
        for texto in frases[voz]:
            f = nombre(voz, texto)
            mapa[voz + "|" + texto] = f
            destino = SALIDA / f
            if destino.exists() and destino.stat().st_size > 500:
                continue
            nuevos += 1
            tareas.append(graba(sem, voz, texto, destino, fallos))
    print(f"frases: {len(mapa)} | por grabar: {nuevos}")
    await asyncio.gather(*tareas)
    if fallos:
        print("FALLARON", len(fallos), ":", [t[:40] for _, t in fallos[:10]])
        sys.exit(1)
    js = "/* Generado por herramientas/genera-audio.py — no editar a mano. */\n"
    js += "const AUDIO_MAPA = " + json.dumps(mapa, ensure_ascii=False, indent=0) + ";\n"
    (SALIDA / "manifest.js").write_text(js, encoding="utf-8")
    total = sum(f.stat().st_size for f in SALIDA.glob("*.mp3"))
    print(f"listo: {len(mapa)} clips, {total/1048576:.1f} MB")

asyncio.run(principal())
