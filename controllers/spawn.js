function randomSpawn() {
  return { x: Math.floor(Math.random() * 590) + 25, y: Math.floor(Math.random() * 366) + 25 + 64 }
}

module.exports = randomSpawn;