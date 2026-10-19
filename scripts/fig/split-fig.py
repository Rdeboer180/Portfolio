"""Split an unzipped .fig's canvas.fig into chunk0.bin (kiwi schema) and chunk1.bin (message).
Usage: python3 scripts/fig/split-fig.py <dir-with-canvas.fig>   (needs the zstd CLI)"""
import struct, subprocess, sys, zlib, os
d = sys.argv[1]; b = open(os.path.join(d, 'canvas.fig'), 'rb').read()
assert b[:8] == b'fig-kiwi', 'not a fig-kiwi canvas'
off, i = 12, 0
while off < len(b):
    ln = struct.unpack('<I', b[off:off+4])[0]; off += 4
    chunk = b[off:off+ln]; off += ln
    out = os.path.join(d, f'chunk{i}.bin')
    try:
        open(out, 'wb').write(zlib.decompress(chunk, -15)); kind = 'deflate'
    except Exception:
        open(out + '.zst', 'wb').write(chunk)
        subprocess.run(['zstd', '-d', '-q', '-f', out + '.zst', '-o', out], check=True); os.remove(out + '.zst'); kind = 'zstd'
    print(i, kind, os.path.getsize(out)); i += 1
