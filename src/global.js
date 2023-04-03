// 3rd Module
global.figlet = require('figlet');
global.fs = require('fs-extra');
global.path = require('path');
global.nconf = require('nconf');
global.inquirer = require('inquirer');
global.os = require('os');
global.osinfo = require('systeminformation');
global.pressAnyKey = require('press-any-key');
global.exec = require('child_process').exec;

// Main Module
global.i = require('./lang/i18n.js');global.displaylang = null;
global.config = require('./config');
global.menu = require('./menu');
global.check = require('./checkpc');
// Main
global.app_name = "Better Stable Diffusion"
global.app_location = {
    folder: {
        settings: `${process.cwd()}\\config`,
    },
    file: {
        config: `${process.cwd()}\\config\\config.json`,
    },
}
global.hardware = {
    cpu: null,
    ram: {
        total: null,
        fixed: null,
    },
    gpu: null,
    disk: null,
    fullreport: {
        cpu: false,
        ram: false,
        gpu: false,
        disk: false,
    },
}


// Function
global.cmd = {
    title: function(text){
        return new Promise((resolve, reject)=>{
            try {
                if(text.length == 0){
                    // console.log(`目前Title 為: ${app_name}`)
                    String.fromCharCode(27) + "]0;" + `${app_name}` + String.fromCharCode(7);
                }else{
                    // console.log(`目前Title 為: ${text}`)
                    String.fromCharCode(27) + "]0;" + `${text}` + String.fromCharCode(7);
                }
            } catch (error) {
                // console.log(`目前Title 為: ${app_name}`)
                String.fromCharCode(27) + "]0;" + `${app_name}` + String.fromCharCode(7);
            }
            resolve();
        });
    },
    clear: function(){
        return new Promise((resolve, reject)=>{
            process.stdout.write('\x1B[2J\x1B[0f');
            resolve();
        });
    }
}

global.color = function(pick){
    if(pick == "red"){
        return "\x1b[31m%s\x1b[0m"
    }else if(pick == "green"){
        return "\x1b[32m%s\x1b[0m"
    }else if(pick == "yellow"){
        return "\x1b[33m%s\x1b[0m"
    }else if(pick == "blue"){
        return "\x1b[34m%s\x1b[0m"
    }else if(pick == "cyan"){
        return "\x1b[36m%s\x1b[0m"
    }else{
        return ""
    }
}

global.ascii_art = function(x,y){
    return new Promise((resolve, reject)=>{
        figlet(`${y}`, async function(err, data) {
            if (err) {
                console.error('Show ASCII Art Fail!...');
                console.dir(err);
                return;
            }
            // let ascii_color = await color(x);
            // console.log(ascii_color, data);
            console.log(await color(x),data);
            resolve();
        });
    });
}

global.close = function(){
    console.log(`[\u2613 ] See you next time...Bye ;_;`);
    process.exit(0);
}