'use strict';

var version = require('../package.json').version;
var uuid = require('hap-nodejs').uuid;
var Accessory = require('hap-nodejs').Accessory;
var Service = require('hap-nodejs').Service;
var Characteristic = require('hap-nodejs').Characteristic;

var leds = require("rpi-ws2801");
var color = require('onecolor');

var ifaces = require('macaddress').networkInterfaces();
var macaddress = ifaces[Object.keys(ifaces)[0]].mac.toUpperCase();

const stepsToGo = 70.0;

var gamma = [];
for (var i = 0; i < 256; i++) {
    gamma[i] = Math.pow(parseFloat(i) / 255.0, 2.5) * 255.0;
}

leds.connect(process.env.LEDS_COUNT || 100);
writeColor(color('black'));

var timerIdH = null;
var timerIdS = null;
var timerIdV = null;

var ledsColor = color('red');
var lastValue = ledsColor.value();
ledsColor = ledsColor.value(100);

writeColor(color('black'));

function setNextColorValue(value, callback) {
    terminateTimerEvent(timerIdV);

    var steps = stepsToGo;
    var step = (value - ledsColor.value()) / steps;

    timerIdV = setInterval(function () {
        writeColor(ledsColor);
        if (--steps <= 0) {
            ledsColor = ledsColor.value(value);
            writeColor(ledsColor);
            terminateTimerEvent(timerIdV);
            if (callback != null)
            callback();
        }
        ledsColor = ledsColor.value(ledsColor.value() + step);
    }, 1);
}

function setNextColorHue(hue, callback) {
    terminateTimerEvent(timerIdH);

    var steps = stepsToGo;
    var step = 0;
    var reversed = Math.abs(hue - ledsColor.hue()) > 0.5;
    if (reversed == false)
    step = (hue - ledsColor.hue()) / steps;
    else if (hue < ledsColor.hue())
    step = (1.0 - ledsColor.hue() + hue) / steps;
    else
    step = (1.0 - hue + ledsColor.hue()) / steps * -1.0;

    timerIdH = setInterval(function () {
        writeColor(ledsColor);
        if (--steps <= 0) {
            ledsColor = ledsColor.hue(hue);
            writeColor(ledsColor);
            terminateTimerEvent(timerIdH);
            if (callback != null)
            callback();
        }
        var nextHue = ledsColor.hue() + step;
        ledsColor = ledsColor.hue(nextHue);
    }, 1);
}

function setNextColorSaturation(saturation, callback) {
    terminateTimerEvent(timerIdS);

    var steps = stepsToGo;
    var step = (saturation - ledsColor.saturation()) / steps;

    timerIdS = setInterval(function () {
        writeColor(ledsColor);
        if (--steps <= 0) {
            ledsColor = ledsColor.saturation(saturation);
            writeColor(ledsColor);
            terminateTimerEvent(timerIdS);
            if (callback != null)
            callback();
        }
        ledsColor = ledsColor.saturation(ledsColor.saturation() + step);
    }, 1);
}

function terminateTimerEvent(id) {
    if (id != null) clearInterval(id);
    id = null;
}

function writeColor(newColor) {
    var r = gamma[Math.trunc(newColor.red()   * 255)];
    var g = gamma[Math.trunc(newColor.green() * 255)];
    var b = gamma[Math.trunc(newColor.blue()  * 255)];

    leds.fill(b, g, r);
}

var WS2801Accessory = {
    name: process.env.ACCESSORY_NAME || "WS2801 Accessory",
    pincode: process.env.ACCESSORY_PINCODE || "000-00-000",
    username: process.env.ACCESSORY_USERNAME || macaddress,
    manufacturer: "homekit-ws2801",
    model: version,
    serialNumber: (process.env.ACCESSORY_USERNAME || macaddress).replace(/:/g, ''),


    power: false,
    outputLogs: process.env.ACCESSORY_NAME || true,

    setPower: function(status) {
        if(this.outputLogs) console.log("Turning the '%s' %s", this.name, status ? "on" : "off");
        this.power = status;

        if (status == false) {
            lastValue = ledsColor.value();
            setNextColorValue(0);
        } else {
            setNextColorValue(lastValue);
        }
    },

    getPower: function() {
        if(this.outputLogs) console.log("'%s' is %s.", this.name, this.power ? "on" : "off");
        return this.power ? true : false;
    },

    setBrightness: function(brightness) {
        if(this.outputLogs) console.log("Setting '%s' brightness to %s", this.name, brightness);
        setNextColorValue(brightness/100.0);
    },

    getBrightness: function() {
        var brightness = ledsColor.value() * 100;
        if(this.outputLogs) console.log("'%s' brightness is %s", this.name, brightness);
        return brightness;
    },

    setSaturation: function(saturation) {
        if(this.outputLogs) console.log("Setting '%s' saturation to %s", this.name, saturation);
        setNextColorSaturation(saturation/100.0);
    },

    getSaturation: function() {
        var saturation = ledsColor.saturation() * 100;
        if(this.outputLogs) console.log("'%s' saturation is %s", this.name, saturation);
        return saturation;
    },

    setHue: function(hue) {
        if(this.outputLogs) console.log("Setting '%s' hue to %s", this.name, hue);
        setNextColorHue(hue/360.0);
    },

    getHue: function() {
        var hue = ledsColor.hue() * 360;
        if(this.outputLogs) console.log("'%s' hue is %s", this.name, hue);
        return hue;
    },

    identify: function() {
        if(this.outputLogs) console.log("Identify the '%s'", this.name);
    }
}

module.exports = {
    LightAccessory: WS2801Accessory
};
