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
global.request = require('request');
global.process = require('process');
global.extract_zip = require('extract-zip');
global.ProgressBar = require('progress');
global.validator = require('validator');
// Main Module
global.i = require('./lang/i18n.js');global.displaylang = null;
global.config = require('./config');
global.menu = require('./menu');
global.check = require('./checkpc');
global.install = require('./install');
global.updater = require('./updater');
global.app = require('../package.json');
// Main
global.repoUrl = "https://api.github.com/repos/yomisana/better-stable-diffusion/releases/latest";
global.repoUrl_file = "https://github.com/Yomisana/better-stable-diffusion/releases/latest/download/Better-Stable-Diffusion.exe";
global.repoUrl_update_file = "https://github.com/Yomisana/better-stable-diffusion/releases/download/0.0.0/update.bat";
global.app_name = "Better Stable Diffusion"
global.app_version = {
    current: null,
    latest: null,
}
global.app_location = {
    folder: {
        settings: `${process.cwd()}\\config`,
    },
    file: {
        config: `${process.cwd()}\\config\\config.json`,
    },
}


global.d_value = {
    // Stable Diffusion Webui
    temp: `${process.cwd()}\\temp`,
    bin: `${process.cwd()}\\bin`,
    sdw: {
        url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip",
    }
}
// global.download = {
//     default_folder: `${process.cwd()}\\temp`,
//     url: {
//         sd_core: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip",
//         sd_core_file_name: "stable-diffusion.zip",
//     }
// }

// global.install = {
//     default_folder: `${process.cwd()}\\bin`,

// }

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

// Download
global.downloadinfo = {
    targetSize: 0, // 目標檔案大小 (KB)
    downloadedSize: 0 // 目標已下載檔案大小 (KB)
}

global.downloadData = function(url, folerpath) {
    return new Promise(( resolve, reject ) => {
        let name = path.basename(url);
        if (!fs.existsSync(folerpath)) {
            fs.mkdirSync(folerpath);
            console.log(`Folder ${folerpath} has been created.`);
        }
        console.log(`Start Download ${name} | url: ${url}`);
        // request | 請求
        const req = request(url);
        const stream = req.pipe(fs.createWriteStream(folerpath+"\\"+name));
        downloadinfo.targetSize = 0
        downloadinfo.downloadedSize = 0
        // progressBar | 進度條
        let bar = new ProgressBar(`${i.__('Prepare to download')} [:bar]:percent ${convertSize(downloadinfo.downloadedSize)}/${convertSize(downloadinfo.targetSize)} ETA(sec): :eta`, { 
            total: 10
        }); 
  
        // request 初次回傳後，提取目標檔案實際大小
        req.on('response',function(data){
            downloadinfo.targetSize = parseInt(data.headers['content-length']);
        });
  
        // request 下載期間顯示
        req.on('data', function (chunk) {
            downloadinfo.downloadedSize += chunk.length; 
            bar.update(downloadinfo.downloadedSize/downloadinfo.targetSize, {});
            bar.fmt = `${i.__('downloading')} [:bar]:percent ${convertSize(downloadinfo.downloadedSize)}/${convertSize(downloadinfo.targetSize)} ETA(sec): :eta`;
            if (bar.complete) {
                console.log(`${i.__('complete!')} ${folerpath+"\\"+name}`);
            }
        });
  
        stream.on('finish',function(){
            resolve('ok');
        });
  
        stream.on('error',function(err){
            reject(`stream error: ${err} in url ${url} at file ${folerpath}`);
        });
  
        function convertSize(size) {
            const units = ['B', 'KB', 'MB', 'GB'];
            let unitIndex = 0;
            while(size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }
            return `${size.toFixed(2)} ${units[unitIndex]}`;
        }
    })
}

// 解壓縮
global.extract = async function(filename, target_path, output_path, value){
    try {
        console.log(color("yellow"), `開始解壓縮 ${filename}...`);
        console.log(color("red"), `Target: ${target_path}\\${filename}`)
        console.log(color("red"), `Output: ${output_path}`)
        await extract_zip(`${target_path}\\${filename}`, { dir: `${output_path}` })
        if(value == "sd"){
            // console.log("Re-name - 修正資料夾名稱");
            fs.copySync(`${output_path}\\stable-diffusion-webui-master`, `${output_path}\\stable-diffusion-webui`, { overwrite: true});
            fs.rm(`${output_path}\\stable-diffusion-webui-master`, {recursive:true});
            console.log(color("blue"), `解壓縮完畢! ${filename}...`);
            pressAnyKey(`${i.__('pressAnyKey')}`, {
                ctrlC: "reject"
            }).then(async () => {
                cmd.clear(); await ascii_art("red", app_name);menu.main();
            }).catch(() => {
                console.log('You pressed CTRL+C');  menu.main();
            })
        }else{
            console.log("None - extract command");
            menu.main();
        }
    } catch (err) {
        // handle any errors
        console.log("error" + err)
    }
}