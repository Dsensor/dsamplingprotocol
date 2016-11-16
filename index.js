#!/usr/bin/env node
'use strict';
/**
* Command Line Prompt for Dsampling Protocol
*
* deals peer to peer network, tcp, udp, kbuckets etc.
* @class dDamplingCLI
* @package    Dsensor opensource project
* @copyright  Copyright (c) 2016 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/

var program = require('commander');
var inquirer = require('inquirer');
var mockptop = require('./mockdht.js');
var kadsetup = require('./kadsetup.js');
var dht;

var liveDHT = new kadsetup();

program
    .version('0.0.1')
    .usage('[options] <Sampling>')
    .description('Decentralized Sampling Protocol')
    .option('-a, --address [addr]', 'Node identity')
    .option('-p, --port [port]', 'Port to connect')
    .parse(process.argv);

if(!program.args.length) {
  program.help();
}
else
{

console.log('Sampling: ' + program.args);
console.log('Address: ' + program.address);
console.log('Port: ' + program.port);
//console.log(program);
    var questions = [
      {
        type: 'input',
        name: 'incommand',
        message: '>>>'
      }
    ];

    ask();
}

function ask() {
  inquirer.prompt(questions).then(function (answers) {
    if(answers.incommand == 'exit')
    {
      console.log('original exit');
      // need to exit the DHT
      process.exit(1);
    }
    else if(answers.incommand == 'dht') {
      // make commandline accessable again
console.log('start DHT');
      //mockdht();
      startdht(program.address, program.port);

    }
    else if(answers.incommand == 'seed') {
      // make commandline accessable again
console.log('start Seed process');
console.log(answers);
      seedask();

    }
    else if(answers.incommand == 'dmap') {
      // make ethereum smart contract
      console.log('smart contract Dmaps started');
      mockdht();
      ask();

    }
    else if(answers.incommand == 'calldmap') {
      // make ethereum smart contract
      console.log('smart contract Dmaps called');
      mockcallDmap();
      ask();

    }
    else if(answers.incommand == 'read') {
      // read existing messages
      console.log('read message called');
      readmessage();
      ask();

    }
    else if(answers.incommand == 'ethereum') {
      // bring ethereum to life
      console.log('bringing ethereum to life');
      var spawn = require('child_process').spawn;

      var cmd = spawn('geth', ['--networkid 12345', '--datadir ~/.ethereum_experiment', '--rpc', '--rpccorsdomain "*"', '--unlock=6f511fe12ba50e2f2d9de99a4d2bfc61332aebb0', 'console'
], {stdio: 'pipe'});
      cmd.stdout.pipe(ui.log);
      cmd.on('close', function () {
      //  ui.updateBottomBar('Installation done!\n');
      //  process.exit();
      });
      ask();

    }
    else {
      console.log('Stopped:', output.join(', '));
      process.exit(1);
    }
  });
};


// LOGIC FUNCTIONS

//start mock ptop network
function mockdht() {

  var livemock = new mockptop();
  livemock.publiclogs();
};

//start mock ptop network
function mockcallDmap() {

  var livemock = new mockptop();
  livemock.callDmap();
};

function startdht (addressIn, portIn) {
console.log(addressIn);
console.log(portIn + ' dfdfd');
console.log('before start class KAD');
  // Decorate your transport
//console.log('exterip pickedup == ' + addressIN + 'and port== ' + portIn);
  liveDHT.startDHT(addressIn, portIn);
  ask();

}

function seedask() {

  var questionseed = [
    {
      type: 'input',
      name: 'addressseed',
      message: 'Enter the IP address to send too:'
    },
    {
      type: 'input',
      name: 'portseed',
      message: 'Port number of the seed:'
    },
    {
      type: 'input',
      name: 'message',
      message: 'Message to send:'
    }

  ];
  inquirer.prompt(questionseed).then(function (answerseed) {

    var output = [];
    output.push(answerseed.addressseed);
    output.push(answerseed.portseed);
    output.push(answerseed.message);
//console.log('output muilt inquery cli');
//console.log(output);
    if(answerseed.portseed)
    {
      //  now make the seed call to DHT
      seeddht(output);

    }
  });

};

function seeddht(seedIn) {
console.log('start seed function');
//console.log(seedIn);
  liveDHT.seedSingle(seedIn);
  // call the original ask function
  console.log('original ask');
  ask();

};
