import Images from './images.mjs';

class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.width = 16;
    this.height = 16;
    this.facing = "right";
    this.frame = 0;
  }

  movePlayer(dir, speed) {
    switch(dir) {
      case "right":
        this.x += speed;
        this.facing = "right";
        this.frame = (this.frame + 1) % 3;
        break;
      case "left":
        this.x -= speed;
        this.facing = "left";
        this.frame = (this.frame + 1) % 3;
        break;
      case "up":
        this.y -= speed;
        this.frame = (this.frame + 1) % 3;
        break;
      case "down":
        this.y += speed;
        this.frame = (this.frame + 1) % 3;
        break;
    }
  }

  collision(item) {
    if (this.x + this.width >= item.x && this.x <= item.x + item.width) {
      if (this.y + this.height >= item.y && this.y <= item.y + item.height) {
        return true;
      }
    }
    return false;
  }

  calculateRank(arr) {
    let newArr = [...arr].sort((a, b) => a.score > b.score ? -1 : 1);
    let position = newArr.findIndex(v => v.score === this.score) + 1;
    return "Rank: " + position + "/" + newArr.length;
  }
  
}

export default Player;
