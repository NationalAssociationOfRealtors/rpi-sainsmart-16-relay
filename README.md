
rpi-sainsmart-16-relay
=======

Controls a SainSmart 12V 16 relay board using the GPIO pins of a Raspberry Pi.

### Operation

The server can be run from the command line and accessed through a browser.  Multiple users can operate the relay board through simultaneous browser operation.  

The **Setup** section provides a step-by-step guide getting the server installed.  Please use information outlined in the **Configuration** section to create the configuration file.

### Setup

The following procedure should be followed to setup the server:

+ Install server using NPM:

 ```shell
  npm install rpi-sainsmart-16-relay 
 ```
 
+ Modify the configuration file name reach relay and set opening positions 

The configuration file is called "branding.js".  More information about configuration can be found in the section below.

+ Run the server:

In order to run the server on "localhost", enter:

 ```shell
  node index.js
 ```
You can pass an optional argument to denote the address such as:

 ```shell
  node index.js 10.4.2.3
 ```

### Configuration

A configuration file named "branding.js" is located in the root directory of your project.

+ Parameters 

 exports.displayTitle: The title displayed on the HTML page that is used to control the relay board..

 exports.relays: An array used to assign a "display named" to each relay and to set the initial position.  For the initial position, 0 is open and 1 is closed.  These values match the values chosen by the manufacturer of the relay board.`

### Notes 

The scripts directory includes a start_relay.sh that can be called from /etc/rc.local to start the package automatically when the computer boots.

### License

>The MIT License (MIT)
>
>Copyright (c) 2014 National Association of REALTORS
>
>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
:
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

