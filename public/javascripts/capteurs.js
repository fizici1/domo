document.getElementById('capteurs').className= 'active';

var temp = [];

var i = 0;

var socket = io.connect('http://127.0.0.1:8080');

socket.on('lum', function(message) {
	document.getElementById('lum').innerHTML = "Luminosité : " + message;
})

socket.on('temp', function(message) {
	document.getElementById('temp').innerHTML = "Température : " + message[0];
	temp.push({x: i++, y: message[0]});
	document.getElementById('hum').innerHTML = "Humidité : " + message[1];
})


var temperature = [
        {
			values: temp,
			key: "Température",
			color: "#ff7f0e"
		}
    ];

nv.addGraph(function() {
		var chart = nv.models.lineChart()
			.useInteractiveGuideline(true)
			;

		chart.xAxis
			.axisLabel('Time (ms)')
			.tickFormat(d3.format(',r'))
			;

		chart.yAxis
			.axisLabel('Température (°C)')
			.tickFormat(d3.format('.02f'))
			;

		d3.select('#test1')
			.datum(temperature)
			.transition().duration(500)
			.call(chart)
			;

		setInterval(function () {
               chart.update();
            }, 1000);
            
		nv.utils.windowResize(chart.update);

		return chart;
});

