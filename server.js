require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/public/img', express.static(process.cwd() + '/public/img'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "PHP 7.4.3");
  next();
});

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = require('socket.io')(server);
const randomSpawn = require('./controllers/spawn.js');
let lastPlayerID = 0;
let lastCollectibleID = 0;
let allPlayers = [];
let collectible = {
  x: randomSpawn().x,
  y: randomSpawn().y,
  value: 1,
  id: lastCollectibleID++
};

io.on('connection', client => {
  let id = lastPlayerID++;
  
  client.emit('create-self', { 
    id: id,
    score: 0,
    x: randomSpawn().x,
    y: randomSpawn().y
  });
  
  client.on('self-created', data => {
    allPlayers.push(data);
    client.emit('update-collectible', collectible);
    io.emit('update-players', { players: allPlayers });
  });

  client.on('collect', data => {
    let index = allPlayers.findIndex(v => v.id === data.id);
    allPlayers[index] = data;
    collectible = {
      x: randomSpawn().x,
      y: randomSpawn().y,
      value: Math.floor(Math.random() * 3) + 1,
      id: lastCollectibleID++
    };
    io.emit('update-collectible', collectible);
  });
  
  client.on('player-move', data => {
    let index = allPlayers.findIndex(v => v.id === data.id);
    allPlayers[index] = data;
    io.emit('update-players', { players: allPlayers });
  });
  
  client.on('disconnect', () => {
    allPlayers = allPlayers.filter(v => v.id != id); 
    io.emit('update-players', { players: allPlayers });
  })
});

module.exports = app; // For testing
