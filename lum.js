var GrovePi = require('node-grovepi').GrovePi
var Board = GrovePi.board
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var lightSensor = new LightAnalogSensor(0)



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
            console.log('Light Analog Sensor (start watch)')
            lightSensor.stream(1000, function(data) {
              console.log(data);
              
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

start();

process.on('SIGINT', onExit)
