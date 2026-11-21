"""Touch up the line portrait: remove the beard, draw a clean jaw, and redraw
the irises so they read naturally when the drawing is inverted in dark mode.

usage: python3 scripts/portrait-touchup.py drawing.png out.png
"""
import sys
import cv2
import numpy as np

src, out = sys.argv[1:3]
im = cv2.imread(src, cv2.IMREAD_GRAYSCALE)

# Region to erase: the lower face (jaw, chin, under the lip), as a polygon.
erase = np.zeros_like(im)
lower = np.array([[372, 630], [470, 630], [470, 690], [740, 690], [748, 640], [800, 640],
                  [800, 760], [790, 820], [760, 880], [700, 930], [600, 945], [500, 930],
                  [430, 890], [395, 830], [372, 740]], np.int32)
cv2.fillPoly(erase, [lower], 255)
# Keep the nose, moustache and lips.
keep = np.zeros_like(im)
cv2.fillPoly(keep, [np.array([[470, 600], [740, 600], [745, 700], [735, 780], [665, 790],
                              [560, 790], [478, 775], [468, 700]], np.int32)], 255)
erase[keep > 0] = 0
im[erase > 0] = 255

# A clean jawline in place of the beard edge.
jaw = np.array([[380, 640], [386, 700], [398, 760], [420, 815], [458, 862], [510, 896],
                [572, 910], [630, 906], [688, 884], [738, 842], [770, 786], [786, 720], [791, 650], [791, 600]], np.float32)
t = np.linspace(0, len(jaw) - 1, 400)
xs = np.interp(t, np.arange(len(jaw)), jaw[:, 0])
ys = np.interp(t, np.arange(len(jaw)), jaw[:, 1])
pts = np.stack([xs, ys], 1)
# smooth the polyline
for _ in range(30):
    pts[1:-1] = 0.25 * pts[:-2] + 0.5 * pts[1:-1] + 0.25 * pts[2:]
cv2.polylines(im, [pts.astype(np.int32)], False, 0, 5, cv2.LINE_AA)
# A soft chin crease under the lip.
cv2.ellipse(im, (612, 822), (26, 8), 0, 20, 160, 0, 3, cv2.LINE_AA)
# Close the join between the new jaw and the right cheek.
cv2.line(im, (791, 560), (791, 665), 0, 5, cv2.LINE_AA)
cv2.imwrite(out, im)

# Eyes: solid black irises turn into glowing discs when the drawing is shown
# cream-on-navy in dark mode. Redraw them as an outlined iris with a pupil.
im = cv2.imread(out, cv2.IMREAD_GRAYSCALE)
yy, xx = np.mgrid[0:im.shape[0], 0:im.shape[1]]
for cx, cy in ((500, 545), (710, 545)):
    lid = 531  # keep the upper eyelid line above this
    disc = ((xx - cx) ** 2 + (yy - cy) ** 2 <= 21 ** 2) & (yy > lid)
    im[disc] = 255
    layer = np.full_like(im, 255)
    # Iris sits a little high so the upper lid hides its top, like a real eye.
    iy = cy - 3
    cv2.circle(layer, (cx, iy), 19, 0, 2, cv2.LINE_AA)
    cv2.circle(layer, (cx, iy + 2), 9, 0, -1, cv2.LINE_AA)
    cv2.circle(layer, (cx + 4, iy - 2), 3, 255, -1, cv2.LINE_AA)  # catchlight
    layer[yy <= lid] = 255
    im = np.minimum(im, layer)
cv2.imwrite(out, im)
