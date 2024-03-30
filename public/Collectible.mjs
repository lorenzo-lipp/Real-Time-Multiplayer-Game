import Images from './images.mjs'
import { loadImage } from './assets.mjs';

const cherry = loadImage(Images["Cherry"]);
const apple = loadImage(Images["Apple"]);
const strawberry = loadImage(Images["Strawberry"]);

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.width = 8;
    this.height = 8;
  }

  draw(context) {
    switch(this.value) {
      case 1:
        context.drawImage(apple, this.x - 3, this.y - 3);
        break;
      case 2:
        context.drawImage(strawberry, this.x - 3, this.y - 3);
        break;
      case 3:
        context.drawImage(cherry, this.x - 3, this.y - 3);
        break;
    }
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
