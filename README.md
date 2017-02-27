# homekit-ws2801

A Node.js application that creates a HomeKit light accessory from a Raspberry Pi with WS2801 based LED Strip.


Hardware
============

![](https://cloud.githubusercontent.com/assets/1313292/23364532/bb95372e-fcff-11e6-93f9-bed7bbf7a5f7.png)


Installation
============

Execute the following commands as root :

    apt-get update
    apt-get install git-core libnss-mdns libavahi-compat-libdnssd-dev -y

    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    dpkg -i node_latest_armhf.deb
    node -v
    npm -v
    npm install -g node-gyp 

    git clone https://github.com/Will-tm/homekit-ws2801.git
    cd homekit-ws2801
    npm install
    node index.js

Recommended
===========

Use [PM2](https://github.com/Unitech/pm2) to auto start your accessory :

    npm install -g pm2
    pm2 startup
    pm2 start index.js --name homekit-ws2801
    pm2 save
