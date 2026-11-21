"""Touch up the line portrait so it reads well inverted in dark mode.

The drawing ships cream-on-navy in dark mode, so any large solid-black area
turns into a bright blob. The pupils are the main one: shrink each to a small
dot with a catchlight, leaving the iris ring and eyelids as drawn.

usage: python3 scripts/portrait-touchup.py drawing.png out.png
"""
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

cv2.imwrite(out, im)
