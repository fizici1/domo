var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);


var GrovePi = require('node-grovepi').GrovePi
var Board = GrovePi.board
var Commands = GrovePi.commands
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var DHTDigitalSensor = GrovePi.sensors.DHTDigital

var lightSensor = new LightAnalogSensor(0)
var dhtSensor = new DHTDigitalSensor(3, DHTDigitalSensor.VERSION.DHT22, DHTDigitalSensor.CELSIUS)

app.set('view engine', 'pug')
app.use(express.static('public'));

function start() {
  console.log('starting')

  board = new GrovePi.board({
    debug: true,
    onError: function(err) {
      console.log('TEST ERROR')
    },
      
    onInit: function(res) {
        console.log("OnInit");
        if (res) {
            board.writeBytes(Commands.chainableRgbLedInit.concat([7, 6, Commands.unused]));
            console.log('Light Analog Sensor (start stream)')
            lightSensor.stream(1000, function(data) {
              console.log(data);
              io.emit('lum', data);
            });
            console.log('DHT Sensor (start stream)')
            dhtSensor.stream(1000, function(data) {
              console.log(data);
              io.emit('temp', data);
            });
        }
    }
  })

  board.init();
} 

function onExit(err) {
  console.log('ending')
  board.close()
  process.removeAllListeners()
  process.exit()
  if (typeof err != 'undefined')
    console.log(err)
}

app.get('/', function(req, res) {
  res.render('accueil');
});

app.get('/capteur', function(req, res) {
  res.render('capteur');
});

app.get('/controle', function(req, res) {
  res.render('controle');
});

io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
    console.log('connection');
    socket.on('LED', function(command) {
      if(command == 'on') {
        console.log('Allumer');
        board.writeBytes(Commands.storeColor.concat([255, 255, 0]));
        board.wait(100)
        board.writeBytes(Commands.chainableRgbLedSetModulo.concat([7, 0, 1]));
        board.wait(100)
      }
      if(command == 'off') {
        console.log('Eteindre');
        board.writeBytes(Commands.storeColor.concat([0, 0, 0]));
        board.wait(100)
        board.writeBytes(Commands.chainableRgbLedSetModulo.concat([7, 0, 1]));
        board.wait(100)
      }
    });
});

start();
server.listen(8080);
process.on('SIGINT', onExit)

