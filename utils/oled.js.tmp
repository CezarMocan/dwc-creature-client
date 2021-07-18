var i2c = require('i2c-bus');
var font = require('oled-font-5x7');
var i2cBus = i2c.openSync(1);
var Oled = require('oled-i2c-bus');

var opts = {
	width:128,
	height:32,
	address:0x3C	// check with $ i2cdetect -y 1 (sudo apt install i2c-tools required)
};

const oled = new Oled(i2cBus, opts);

var ooled = {};
ooled.print = function(st){
	oled.clearDisplay();
	oled.turnOnDisplay();
	oled.setCursor(1,1);
	oled.writeString(font, 1, st, 1, true);
};

module.exports = ooled;
