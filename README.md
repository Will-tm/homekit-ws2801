# homekit-ws2801

A [Node.js](https://github.com/nodejs/node) application that creates a HomeKit light accessory from a Raspberry Pi with WS2801 based LED Strip.


Hardware
============

This software has been tested on every versions of Raspberry Pi (Zero, A, A+, B, B+, 2, 3) but it could work on any Linux board featuring an SPI controller and capable of running Node.js

![](https://cloud.githubusercontent.com/assets/1313292/23364532/bb95372e-fcff-11e6-93f9-bed7bbf7a5f7.png)


Installation
============

Execute the following commands as root :

    # Install Avahi for mDNS discovery
    apt-get update
    apt-get install git-core libnss-mdns libavahi-compat-libdnssd-dev -y

    # Install Node.js
    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    dpkg -i node_latest_armhf.deb
    node -v
    npm -v
    npm install -g node-gyp 

    # Install homekit-ws2801
    git clone https://github.com/Will-tm/homekit-ws2801.git
    cd homekit-ws2801
    npm install
    
    # Run homekit-ws2801
    node index.js


Recommended
===========

Use [PM2](https://github.com/Unitech/pm2) to auto start your accessory :

    # Install PM2
    npm install -g pm2
    
    # Initiate PM2 service autostart
    pm2 startup
    
    # Start homekit-ws2801 with PM2
    pm2 start index.js --name homekit-ws2801
    
    # Save current state
    pm2 save


Configuration
=============

Everything that might need to be changed can be set using Node.js environment variables :

| Variable | Description | Default value |
| --- | --- | --- |
| PORT | Default homekit port. Needs to be unique for every accessory running on the same device | 51826 |
| LEDS_COUNT | LED strip pixels count | 100 |
| ACCESSORY_NAME | Accessory default name | WS2801 Accessory |
| ACCESSORY_PINCODE | Accessory PIN code | 000-00-000 |
| ACCESSORY_USERNAME | Accessory mac address | eth0 mac address |
