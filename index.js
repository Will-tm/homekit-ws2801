require('node-persist').initSync();
var uuid = require('hap-nodejs').uuid;
var Accessory = require('hap-nodejs').Accessory;
var Service = require('hap-nodejs').Service;
var Characteristic = require('hap-nodejs').Characteristic;
var LightAccessory = require('./lib/WS2801Accessory').LightAccessory;

console.log('Starting homekit-ws2801...');

var lightUUID = uuid.generate('hap-nodejs:accessories:light' + LightAccessory.name);
var lightAccessory = exports.accessory = new Accessory(LightAccessory.name, lightUUID);

lightAccessory.username = LightAccessory.username;
lightAccessory.pincode = LightAccessory.pincode;

lightAccessory.getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, LightAccessory.manufacturer)
    .setCharacteristic(Characteristic.Model, LightAccessory.model)
    .setCharacteristic(Characteristic.SerialNumber, LightAccessory.serialNumber);

lightAccessory.on('identify', function(paired, callback) {
    LightAccessory.identify();
    callback();
});

lightAccessory.addService(Service.Lightbulb, LightAccessory.name).getCharacteristic(Characteristic.On)
    .on('set', function(value, callback) {
        LightAccessory.setPower(value);
        callback();
    })
    .on('get', function(callback) {
        callback(null, LightAccessory.getPower());
    });

lightAccessory.getService(Service.Lightbulb).addCharacteristic(Characteristic.Brightness)
    .on('set', function(value, callback) {
        LightAccessory.setBrightness(value);
        callback();
    })
    .on('get', function(callback) {
        callback(null, LightAccessory.getBrightness());
    });

lightAccessory.getService(Service.Lightbulb).addCharacteristic(Characteristic.Saturation)
    .on('set', function(value, callback) {
        LightAccessory.setSaturation(value);
        callback();
    })
    .on('get', function(callback) {
        callback(null, LightAccessory.getSaturation());
    });

lightAccessory.getService(Service.Lightbulb).addCharacteristic(Characteristic.Hue)
    .on('set', function(value, callback) {
        LightAccessory.setHue(value);
        callback();
    })
    .on('get', function(callback) {
        callback(null, LightAccessory.getHue());
    });

lightAccessory.publish({
    port: 51826,
    username: lightAccessory.username,
    pincode: lightAccessory.pincode
});

console.log('Published '+LightAccessory.name);
