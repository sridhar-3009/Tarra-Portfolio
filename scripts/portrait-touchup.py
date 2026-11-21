"""Touch up the line portrait so it reads well inverted in dark mode.

- Optional (SHAVE=1): clean-shaven: remove the moustache and the stubble
  under the lip, and redraw the lips and a soft chin crease.
- Dark mode shows the drawing cream-on-navy, so large solid-black areas turn
  into bright blobs. Shrink the pupils to a small dot with a catchlight.

usage: [SHAVE=1] python3 scripts/portrait-touchup.py drawing.png out.png
"""
import os
import sys

import cv2
import numpy as np

src, out = sys.argv[1:3]
im = cv2.imread(src, cv2.IMREAD_GRAYSCALE)
yy, xx = np.mgrid[0:im.shape[0], 0:im.shape[1]]

LID = 533  # don't touch anything above the upper eyelid
for cx, cy in ((501, 544), (707, 542)):  # iris centres in the 1086 x 1448 drawing
    inner = ((xx - cx) ** 2 + (yy - cy) ** 2 <= 12 ** 2) & (yy > LID)
    im[inner] = 255
    dot = np.full_like(im, 255)
    cv2.circle(dot, (cx, cy + 1), 6, 0, -1, cv2.LINE_AA)
    cv2.circle(dot, (cx + 3, cy - 2), 2, 255, -1, cv2.LINE_AA)  # catchlight
    im = np.minimum(im, dot)



def wipe(img, poly):
    m = np.zeros_like(img)
    cv2.fillPoly(m, [np.array(poly, np.int32)], 255)
    img[m > 0] = 255


def curve(img, pts, width=3):
    c = np.array(pts, np.float32)
    t = np.linspace(0, len(c) - 1, 120)
    p = np.stack([np.interp(t, np.arange(len(c)), c[:, k]) for k in (0, 1)], 1)
    for _ in range(10):
        p[1:-1] = 0.25 * p[:-2] + 0.5 * p[1:-1] + 0.25 * p[2:]
    cv2.polylines(img, [p.astype(np.int32)], False, 0, width, cv2.LINE_AA)


if os.environ.get('SHAVE'):
    # Moustache and mouth: clear everything between the nose and the chin, then
    # redraw the lips cleanly with a gentle smile (the originals sat inside the
    # moustache and came out broken once it was removed).
    wipe(im, [(482, 701), (735, 701), (740, 792), (478, 792)])
    curve(im, [(524, 752), (532, 757), (560, 759), (594, 757), (610, 759), (626, 757), (660, 759), (688, 757), (696, 752)], 4)
    curve(im, [(546, 752), (570, 743), (596, 741), (610, 747), (624, 741), (650, 743), (674, 752)], 3)
    curve(im, [(562, 768), (586, 778), (610, 781), (634, 778), (658, 768)], 3)

    # Stubble under the lower lip: replace with a soft chin crease.
    wipe(im, [(560, 786), (665, 786), (665, 820), (560, 820)])
    curve(im, [(598, 801), (612, 803), (626, 801)], 2)


cv2.imwrite(out, im)
