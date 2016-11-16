/**
* KAD setup a ptop network
*
* deals peer to peer network, tcp, udp, kbuckets etc.
* @class KAD
* @package    Dsensor opensource project
* @copyright  Copyright (c) 2016 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var util = require('util');
var events = require("events");
var kad = require('kad');
var traverse = require('kad-traverse');
var KadLocalStorage = require('kad-localstorage');
var crypto = require('crypto');
var getIP = require('external-ip')();


var KAD = function() {
console.log('KAD setup network');
  this.dht = {};
	events.EventEmitter.call(this);

};

/**
* inherits core emitter class within this class
* @method
*/
util.inherits(KAD, events.EventEmitter);

/**
*  get the Public IP address
* @method getpublicIP
*
*/
KAD.prototype.getpublicIP = function() {

  var ip = '';
  var setIP = new getIP();
  setIP(function (err, ip) {
    if (err) {
        // every service in the list has failed
        throw err;
    }
console.log('extippp' + ip);
  });

};

/**
*  Start up the DHT  (distributed hash table module)
* @method startDHT
*
*/
KAD.prototype.startDHT = function(addressIn, portIn) {
console.log('startDHT FUNCTION ClassS')

  var ipaddress =  addressIn;
  // Decorate your transport
//console.log('exterip pickedup == ' + ip + 'and port== ' + portnumber);
  // Create your contact
  var contact = kad.contacts.AddressPortContact({
    address: ipaddress,
    port: 8816//portnumber
  });
  // Decorate your transport
  var NatTransport = traverse.TransportDecorator(kad.transports.UDP);

  // Create your transport with options
  var transportlive = new NatTransport(contact, {
  traverse: {
    upnp: { forward: 1901,
                ttl: 0 },
    stun: { address: 'stun.services.mozilla.com',
                 port: 3478 },
    turn: { address: 'turn.counterpointhackers.org',
                 port: 3478 }
  }
  });

  this.dht = new kad.Node({
    transport: transportlive,
    storage: kad.storage.FS('datadir'),
    validator: 'somethingtocheck'
    //storage: new KadLocalStorage('label')
  });

};

/**
*  Seed a SINGLE connection on DHT
* @method seedSingle
*
*/
KAD.prototype.seedSingle = function(seedIn) {
console.log('seed single');
console.log(seedIn);
  var hashkey = crypto.createHash('md5').update(seedIn[2]).digest('hex');

  var seed = {
    address: seedIn[0],
    port: 8816
  };
console.log(seed);
  var localthis = this;
  this.dht.connect(seed, function(err) {
console.log('begine seed connection');
  var key = hashkey;
  var value = seedIn[2];//seedIn[2];
  var info = '';


    localthis.dht.put(key, value, function() {
      localthis.dht.get(key, function(err, info) {
console.log('SEED successfully put and get an item in the dht');
console.log(info);
      });
    });

  });

};

/**
*  Read a SINGLE message sent by ID
* @method readMessage
*
*/
KAD.prototype.readMessage = function(addressIn, portIn) {
console.log('read message');

      var key = '0222';
      dht.get(key, function(err, info) {
console.log('successfully read message');
console.log(info);
      });

};

module.exports = KAD;
