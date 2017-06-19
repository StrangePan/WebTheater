function LayoutType(value) {
  if (value == null) {
    return null;
  }
  switch (Number(value)) {
    case LayoutType.FULLSCREEN:
      return LayoutType.FULLSCREEN;
    case LayoutType.VERTICAL_SPLIT:
      return LayoutType.VERTICAL_SPLIT;
    case LayoutType.FOUR_CORNERS:
      return LayoutType.FOUR_CORNERS;
    default:
      return null;
  }
};
LayoutType.FULLSCREEN = 0;
LayoutType.VERTICAL_SPLIT = 1;
LayoutType.FOUR_CORNERS = 2;

/** Left edge, top edge, width of frame, and height of frame. [0-1] in percentages. */
function frame(x, y, width, height) {
  return {
    top: y + '%',
    right: (100 - width - x) + '%',
    bottom: (100 - height - y) + '%',
    left: x + '%',
  }
}

var VideoLayouts = [];

VideoLayouts[LayoutType.FULLSCREEN] = {
  name: "1 Video",
  frames: [
    frame(0, 0, 100, 100)
  ]
};

VideoLayouts[LayoutType.VERTICAL_SPLIT] = {
  name: "2 Videos",
  frames: [
    frame(0, 0, 50, 100),
    frame(50, 0, 50, 100)
  ]
};

VideoLayouts[LayoutType.FOUR_CORNERS] = {
  name: "4 Videos",
  frames: [
    frame(0, 0, 50, 50),
    frame(50, 0, 50, 50),
    frame(0, 50, 50, 50),
    frame(50, 50, 50, 50)
  ]
};
