#!/bin/bash
NODE_CMD=/usr/local/bin/node
NODE_VER="$($NODE_CMD -v)"
echo "Using node version ${NODE_VER}"
cd /home/pi/rpi-sainsmart-16-relay
sudo $NODE_CMD index.js 192.168.1.250
