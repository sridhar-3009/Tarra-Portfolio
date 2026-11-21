// A line doodle of Sai taking a mirror selfie: messy wavy hair, moustache and
// chin beard, a collared shirt with two flap pockets, phone raised. Drawn by
// the scroll line in the hero. Coordinates are in a FIGURE_W × FIGURE_H box;
// each array is one pen stroke, drawn in order.

export const FIGURE_W = 400
export const FIGURE_H = 540

const ellipse = (cx, cy, rx, ry, start = -Math.PI / 2, turns = 1.06, n = 14) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = start + (i / n) * turns * Math.PI * 2
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })

export const figureStrokes = [
  // Face: left temple, down the jaw, round the chin, up to the right temple
  [[132, 146], [128, 192], [136, 234], [154, 266], [180, 286], [204, 292], [228, 284], [252, 262], [266, 228], [272, 190], [270, 148]],
  // Hair: a big messy wave over the top
  [[126, 166], [110, 128], [114, 92], [136, 66], [164, 48], [196, 38], [228, 40], [258, 52], [282, 76], [294, 108], [290, 142], [276, 164]],
  // Fringe and the lock falling over the forehead
  [[138, 128], [160, 108], [186, 118], [206, 98], [230, 112], [252, 100], [272, 122]],
  [[188, 108], [176, 128], [182, 146], [194, 150]],
  // Left ear
  [[130, 176], [116, 172], [112, 196], [120, 214], [134, 216]],
  // Brows
  [[146, 168], [164, 160], [184, 166]],
  [[218, 166], [236, 160], [254, 168]],
  // Half-lidded eyes
  [[150, 184], [166, 178], [182, 184]],
  [[166, 186], [167, 192]],
  [[220, 184], [236, 178], [252, 184]],
  [[236, 186], [237, 192]],
  // Nose
  [[202, 192], [196, 224], [208, 228]],
  // Moustache, mouth, chin beard
  [[176, 242], [190, 235], [202, 239], [214, 235], [228, 242]],
  [[188, 254], [216, 254]],
  [[190, 272], [202, 284], [214, 272]],
  // Neck
  [[184, 290], [182, 322]],
  [[222, 290], [224, 322]],
  // Collar and placket
  [[176, 318], [150, 352], [196, 358], [203, 332]],
  [[230, 318], [256, 352], [210, 358], [203, 332]],
  [[203, 358], [203, 540]],
  [[198, 410], [208, 410]],
  [[198, 470], [208, 470]],
  // Left shoulder and arm
  [[24, 540], [34, 430], [76, 372], [172, 320]],
  // Phone held up by the face, with its cameras
  [[300, 150], [342, 150], [346, 156], [346, 250], [340, 256], [300, 256], [294, 250], [294, 156], [300, 150]],
  ellipse(312, 168, 6, 6),
  ellipse(328, 168, 6, 6),
  // Hand wrapped round the phone, forearm down to the shoulder
  [[294, 214], [282, 222], [284, 236], [294, 240]],
  [[294, 240], [282, 250], [286, 264], [302, 268], [318, 262]],
  [[302, 268], [314, 320], [330, 362]],
  [[232, 320], [300, 342], [352, 384], [370, 440], [380, 540]],
  // Chest pockets with flaps
  [[78, 414], [150, 410], [152, 430], [80, 432], [78, 414]],
  [[84, 432], [86, 490], [148, 488], [148, 430]],
  [[256, 410], [328, 414], [326, 432], [254, 430], [256, 410]],
  [[258, 430], [258, 488], [320, 490], [322, 432]],
]
