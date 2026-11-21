"""Trace a portrait photo into pen strokes for the home page doodle.

Writes JSON strokes (polylines in a 400 x 540 box, ordered top to bottom) and a
preview PNG. Paste the strokes into src/components/home/figure.js.

usage:
  SEEDS=scripts/trace-portrait.seeds.json python3 scripts/trace-portrait.py \
      photo.jpg strokes.json preview.png  X0 Y0 X1 Y1  CANNY_LO CANNY_HI

  X0..Y1   crop box in photo pixels (keep it about 400:540)
  SEEDS    optional boxes marking person ("fg"/"pfg") and background
           ("bg"/"pbg") in photo pixels, to guide the cut-out
  EPS      simplification tolerance (default 2.2); MINLEN drops short strokes
  SMOOTH   bilateral passes before edge finding (more = fewer, cleaner lines)
  MERGE    dilation size that merges double edges into one line
  MINSPAN  drops specks smaller than this many output pixels

For clean black-on-white line art (what the site uses now), set LINEART=1:
it follows the centre of each drawn line instead of finding photo edges.
The current pencil path: LINEART=1 MINLEN=8 MINSPAN=6 EPS=1.4, whole image.
The drawing itself ships as src/assets/portrait/lines-light.png and
lines-dark.png (white ink on black, 800 x 1080), one per theme (the dark
copy has smaller pupils); the pencil's path is traced from the drawing.
"""
import json
import sys

import cv2
import numpy as np

OUT_W, OUT_H = 400, 540
WORK = 2  # trace at 2x the output size
import os
SEEDS = os.environ.get('SEEDS')


def chaikin(pts, rounds=2):
    """Corner-cutting so traced polylines read as smooth pen strokes."""
    pts = np.asarray(pts, np.float32)
    for _ in range(rounds):
        if len(pts) < 3:
            break
        q = 0.75 * pts[:-1] + 0.25 * pts[1:]
        r = 0.25 * pts[:-1] + 0.75 * pts[1:]
        mid = np.empty((2 * len(q), 2), np.float32)
        mid[0::2], mid[1::2] = q, r
        pts = np.vstack([pts[:1], mid, pts[-1:]])
    # keep the point count modest
    step = max(1, len(pts) // 40)
    return np.vstack([pts[::step], pts[-1:]]) if len(pts) > 2 else pts


def thin(img):
    """Zhang-Suen thinning of a 0/1 image."""
    img = img.copy().astype(np.uint8)
    changed = True
    while changed:
        changed = False
        for step in (0, 1):
            p = np.pad(img, 1)
            P2, P3, P4 = p[:-2, 1:-1], p[:-2, 2:], p[1:-1, 2:]
            P5, P6, P7 = p[2:, 2:], p[2:, 1:-1], p[2:, :-2]
            P8, P9 = p[1:-1, :-2], p[:-2, :-2]
            nb = [P2, P3, P4, P5, P6, P7, P8, P9]
            B = sum(n.astype(int) for n in nb)
            seq = nb + [P2]
            A = sum(((seq[i] == 0) & (seq[i + 1] == 1)).astype(int) for i in range(8))
            if step == 0:
                c = (P2 * P4 * P6 == 0) & (P4 * P6 * P8 == 0)
            else:
                c = (P2 * P4 * P8 == 0) & (P2 * P6 * P8 == 0)
            rm = (img == 1) & (B >= 2) & (B <= 6) & (A == 1) & c
            if rm.any():
                img[rm] = 0
                changed = True
    return img


NB = [(-1, 0), (0, 1), (1, 0), (0, -1), (-1, 1), (1, 1), (1, -1), (-1, -1)]


def chains(sk):
    """Walk a skeleton into polylines (lists of (x, y))."""
    sk = sk.copy()
    h, w = sk.shape
    deg = lambda y, x: sum(1 for dy, dx in NB if 0 <= y + dy < h and 0 <= x + dx < w and sk[y + dy, x + dx])
    out = []
    ys, xs = np.nonzero(sk)
    # start from endpoints first so lines are walked end to end
    pts = sorted(zip(ys, xs), key=lambda p: deg(*p) != 1)
    for y0, x0 in pts:
        if not sk[y0, x0]:
            continue
        line = [(x0, y0)]
        sk[y0, x0] = 0
        y, x = y0, x0
        while True:
            nxt = None
            for dy, dx in NB:
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and sk[ny, nx]:
                    nxt = (ny, nx)
                    break
            if not nxt:
                break
            y, x = nxt
            sk[y, x] = 0
            line.append((x, y))
        out.append(line)
    return out


def main():
    src, out_json, out_png = sys.argv[1:4]
    img = cv2.imread(src)
    H0, W0 = img.shape[:2]
    if len(sys.argv) >= 8:
        x0, y0, x1, y1 = map(int, sys.argv[4:8])
    else:
        x0, y0, x1, y1 = 0, 0, W0, H0
    img = img[y0:y1, x0:x1]
    W, H = OUT_W * WORK, OUT_H * WORK
    img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA)

    if os.environ.get('LINEART'):
        # Clean black-on-white line art: follow the centre of each drawn line.
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ink = (gray < int(os.environ.get('INK', 140))).astype(np.uint8)
        ink = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
        emit(thin(ink), out_json, out_png)
        return

    # 1. Separate the person from the background with GrabCut.
    bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
    seeds = json.load(open(SEEDS)) if SEEDS else None
    if seeds:
        # Seed boxes are in original-photo pixels: [label, x0, y0, x1, y1].
        sx, sy = W / (x1 - x0), H / (y1 - y0)
        mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
        codes = {'fg': cv2.GC_FGD, 'bg': cv2.GC_BGD, 'pfg': cv2.GC_PR_FGD, 'pbg': cv2.GC_PR_BGD}
        for label, a0, b0, a1, b1 in seeds:
            mask[max(0, int((b0 - y0) * sy)):max(0, int((b1 - y0) * sy)), max(0, int((a0 - x0) * sx)):max(0, int((a1 - x0) * sx))] = codes[label]
        cv2.grabCut(img, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    else:
        mask = np.zeros((H, W), np.uint8)
        rect = (int(W * 0.06), 1, int(W * 0.88), H - 2)
        cv2.grabCut(img, mask, rect, bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
    person = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    person = cv2.morphologyEx(person, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    person = cv2.morphologyEx(person, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(person)
    if n > 1:
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        person = np.where(lab == big, 255, 0).astype(np.uint8)
    # Smooth the silhouette so the outline reads as a pen line, not pixels.
    person = cv2.GaussianBlur(person, (0, 0), 7)
    person = np.where(person > 127, 255, 0).astype(np.uint8)
    cv2.imwrite(out_png.replace('.png', '-mask.png'), person)

    # 2. Inner feature lines: soft-edged Canny inside the person.
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Flatten skin texture and stubble so only the strong features survive.
    for _ in range(int(os.environ.get('SMOOTH', 2))):
        gray = cv2.bilateralFilter(gray, 11, 60, 11)
    gray = cv2.GaussianBlur(gray, (7, 7), 0)
    edges = cv2.Canny(gray, float(sys.argv[8]) if len(sys.argv) > 8 else 30, float(sys.argv[9]) if len(sys.argv) > 9 else 80)
    inner = cv2.erode(person, np.ones((15, 15), np.uint8))
    edges = cv2.bitwise_and(edges, inner)

    # 3. Outer silhouette, minus the frame edges.
    outline = cv2.morphologyEx(person, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    outline[:4, :] = 0
    outline[-4:, :] = 0
    allm = cv2.bitwise_or(edges, outline)
    # Fatten before thinning so double edges (brows, lids) merge into one line.
    k = int(os.environ.get('MERGE', 5))
    allm = cv2.dilate(allm, np.ones((k, k), np.uint8))
    sk = thin((allm > 0).astype(np.uint8))

    emit(sk, out_json, out_png)


def emit(sk, out_json, out_png):
    strokes = []
    for line in chains(sk):
        if len(line) < 14:
            continue
        arr = np.array(line, np.float32).reshape(-1, 1, 2)
        simp = cv2.approxPolyDP(arr, float(os.environ.get('EPS', 2.2)), False).reshape(-1, 2) / WORK
        if len(simp) < 2:
            continue
        length = float(np.sum(np.hypot(*np.diff(simp, axis=0).T)))
        if length < float(os.environ.get('MINLEN', 14)):
            continue
        xs, ys = simp[:, 0], simp[:, 1]
        if max(xs.max() - xs.min(), ys.max() - ys.min()) < float(os.environ.get('MINSPAN', 12)):
            continue  # little blobs and specks
        strokes.append([[round(float(x), 1), round(float(y), 1)] for x, y in chaikin(simp)])

    # Draw roughly top to bottom, each stroke starting at its upper end.
    for s in strokes:
        if s[0][1] > s[-1][1]:
            s.reverse()
    strokes.sort(key=lambda s: min(p[1] for p in s))

    json.dump(strokes, open(out_json, 'w'))
    prev = np.full((OUT_H * 2, OUT_W * 2, 3), (234, 246, 255), np.uint8)
    for s in strokes:
        pts = (np.array(s) * 2).astype(np.int32)
        cv2.polylines(prev, [pts], False, (230, 51, 0), 3, cv2.LINE_AA)
    cv2.imwrite(out_png, prev)
    print(len(strokes), 'strokes', sum(len(s) for s in strokes), 'points')


main()
