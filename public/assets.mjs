import Images from './images.mjs';

const skins = {
  frog: {
    right: [
      loadImage(Images["Frog_right_1"]),
      loadImage(Images["Frog_right_2"]),
      loadImage(Images["Frog_right_3"])
    ],
    left: [
      loadImage(Images["Frog_left_1"]),
      loadImage(Images["Frog_left_2"]),
      loadImage(Images["Frog_left_3"])
    ]
  },
  mask: {
    right: [
      loadImage(Images["Mask_right_1"]),
      loadImage(Images["Mask_right_2"]),
      loadImage(Images["Mask_right_3"])
    ],
    left: [
      loadImage(Images["Mask_left_1"]),
      loadImage(Images["Mask_left_2"]),
      loadImage(Images["Mask_left_3"])
    ]
  }
};
const background = loadImage(Images["Background"]);

export function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

export function drawPlayer(context, playerData, isSelf) {
  let character;
    
  if (isSelf) {
    character = skins.frog;
  } else {
    character = skins.mask;
  }
  context.drawImage(character[playerData.facing][playerData.frame], playerData.x - 8, playerData.y - 9);
}

export function drawBackground(context) {
  context.drawImage(background, 0, 0);
}