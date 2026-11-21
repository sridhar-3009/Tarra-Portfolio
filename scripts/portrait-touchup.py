"""Touch up the line portrait so it reads well inverted in dark mode.

- Clean-shaven: remove the moustache and the stubble under the lip, and
  redraw the mouth corners and a soft chin crease.
- Dark mode shows the drawing cream-on-navy, so large solid-black areas turn
  into bright blobs. Shrink the pupils to a small dot with a catchlight.

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


# Moustache: everything between the nose and the upper lip, plus the ends
# that hang down past the corners of the mouth.
wipe(im, [(482, 700), (735, 700), (735, 741), (482, 741)])
wipe(im, [(482, 741), (538, 741), (538, 752), (528, 790), (482, 790)])
wipe(im, [(680, 741), (735, 741), (735, 790), (690, 790), (682, 752)])
# Stray moustache strands still touching the lips: drop the short ink pieces
# in a band around the lips, keeping the long lip lines themselves.
y0, y1, x0, x1 = 736, 760, 520, 700
band = (im[y0:y1, x0:x1] < 128).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(band, connectivity=8)
for k in range(1, n):
    if stats[k, cv2.CC_STAT_WIDTH] < 40:
        im[y0:y1, x0:x1][lab == k] = 255
# Soft mouth corners where the moustache covered them.
curve(im, [(528, 755), (534, 757), (540, 758)], 2)
curve(im, [(678, 760), (684, 759), (690, 757)], 2)

# Stubble under the lower lip: replace with a soft chin crease.
wipe(im, [(560, 786), (665, 786), (665, 820), (560, 820)])
curve(im, [(598, 801), (612, 803), (626, 801)], 2)

cv2.imwrite(out, im)
