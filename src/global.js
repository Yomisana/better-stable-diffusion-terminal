
const ProgressBar = require('progress');
// Black Magic
global.inquirer = require('inquirer');
global.figlet = require('figlet');
global.extract_zip = require('extract-zip')
global.displaylang = null;
global.i = require('../lang/i18n.js');
// not cool things
global.core = require('./core');

global.hardware = {
    cpu: null,
    ram: {
        total: null,
        fixed: null,
    },
    gpu: {
        name: null,
        ram: {
            total: null,
            fixed: null,
        }
    }
}

global.commit = "****************************************************************";
global.onlycheck = false;
global.installer = {
    vram_low: false, 
    vram_med: false, 
    cmd: null,
    download: {
        file_location: `${__dirname}\\installer`,
        url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip",
        save: `${__dirname}\\installer\\stable-diffusion.zip`,
        sd_name: "stable-diffusion.zip",
        output: `${__dirname}\\bin`,
        sd_output_folder: `${__dirname}\\bin\\stable-diffusion-webui-master`
    }
}

const request = require('request');
const fs = require('fs-extra');
global.downloadProgress = {
    total: 0,
    now: 0
};

global.downloadData = function(url,path){
    return new Promise(( resolve, reject ) => {
        total = 0;
        now = 0;
        const bar = new ProgressBar(`${i.__('downloading...')}[:bar] :percent`, { total: 100 });
        const req = request(url);
        const stream = req.pipe(fs.createWriteStream(path));

        req.on('response',function(data){
            //console.log(data.headers['content-length']);
            downloadProgress.total = parseInt(data.headers['content-length']);
        });

        req.on('data', function (chunk) {
            //console.log(chunk.length);
            downloadProgress.now += chunk.length;
            bar.update(downloadProgress.now/downloadProgress.total);
            if (bar.complete) {
                console.log(`${i.__('complete!')}`);
            }
        });


        stream.on('finish',function(){
            resolve('ok');
        });

        stream.on('error',function(err){
            reject(`stream error: ${err} in url ${url} at file ${path}`);
        });
    });
};