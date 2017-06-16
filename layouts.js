var LayoutType = {
  FULLSCREEN: 0,
  VERTICAL_SPLIT: 1,
  FOUR_CORNERS : 2
};

/** Left edge, top edge, width of frame, and height of frame. [0-1] in percentages. */
function frame(x, y, width, height) {
  return {
    top: y + '%',
    right: (100 - width - x) + '%',
    bottom: (100 - height - y) + '%',
    left: x + '%',
  }
}

var VideoLayouts = {};

VideoLayouts[LayoutType.FULLSCREEN] = [
  frame(0, 0, 100, 100)
];

VideoLayouts[LayoutType.VERTICAL_SPLIT] = [
  frame(0, 0, 50, 100),
  frame(50, 0, 50, 100)
];

VideoLayouts[LayoutType.FOUR_CORNERS] = [
  frame(0, 0, 50, 50),
  frame(50, 0, 50, 50),
  frame(0, 50, 50, 50),
  frame(50, 50, 50, 50)
];
