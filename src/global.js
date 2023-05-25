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
global.execSync = require('child_process').execSync;
global.execSpawn = require('child_process').spawn;
global.request = require('request');
global.crypto = require('crypto');
global.process = require('process');
global.extract_zip = require('extract-zip');
global.ProgressBar = require('progress');
global.validator = require('validator');
global.semver = require('semver');
global.setTitle = require('console-title');
global.consolewindow = require('node-hide-console-window');
// Main Module
global.i = require('./lang/i18n');
global.config = require('./config');
global.menu = require('./menu');
global.check = require('./checkpc');
global.install = require('./install');
global.updater = require('./updater');
global.app = require('../package.json');
global.running = require('./running');
// Main
global.repoUrl = "https://api.github.com/repos/yomisana/better-stable-diffusion/releases/latest";
global.repoUrl_file = "https://github.com/Yomisana/better-stable-diffusion/releases/latest/download/Better-Stable-Diffusion.exe";
global.repoUrl_update_file = "https://github.com/Yomisana/better-stable-diffusion/releases/download/0.0.0/update.bat";
global.displaylang = null;
global.app_title = "Better Stable Diffusion"
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
        command_args: `${process.cwd()}\\config\\command_args.txt`,
    },
}
global.app_dev = false;
global.app_server = {
    port: 7858,
};

global.app_gpu = 0;

global.d_value = {
    // Stable Diffusion Webui
    temp: `${process.cwd()}\\temp`,
    bin: `${process.cwd()}\\bin`,
    sdwurl: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip",
    default_pyurl: `https://www.python.org/ftp/python/version/python-version-embed-amd64.zip`,
    default_pyver: `3.10.6`,
    // giturl: `https://github.com/git-for-windows/git/releases/download/v2.40.1.windows.1/PortableGit-2.40.1-64-bit.7z.exe`,
    // giturl: `https://github.com/git-for-windows/git/releases/latest/download/Better-Stable-Diffusion.exe`,
    zipurl: `https://www.7-zip.org/a/7zr.exe`,
    vc_redisturl: `https://aka.ms/vs/16/release/vc_redist.x64.exe`,
    dev_temp: `${process.cwd()}\\better-stable-diffusion\\temp`,
    dev_bin: `${process.cwd()}\\better-stable-diffusion\\bin`,
}
global.targetPath = null;
global.targetBinPath = null;
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


// debug
global.debug = {
    str: {
        nvidia_smi : `
        Tue Apr 25 11:20:53 2023
        +---------------------------------------------------------------------------------------+
        | NVIDIA-SMI 531.68                 Driver Version: 531.68       CUDA Version: 12.1     |
        |-----------------------------------------+----------------------+----------------------+
        | GPU  Name                      TCC/WDDM | Bus-Id        Disp.A | Volatile Uncorr. ECC |
        | Fan  Temp  Perf            Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
        |                                         |                      |               MIG M. |
        |=========================================+======================+======================|
        |   0  NVIDIA GeForce GTX 1660 Ti    WDDM | 00000000:09:00.0  On |                  N/A |
        | 28%   35C    P8                9W / 120W|   2134MiB /  6144MiB |     22%      Default |
        |                                         |                      |                  N/A |
        +-----------------------------------------+----------------------+----------------------+
        |   1  Tesla M40 24GB                WDDM | 00000000:01:00.0 Off |                  Off |
        | N/A   36C    P8              20W / 250W |    195MiB / 24576MiB |      1%      Default |
        |                                         |                      |                  N/A |
        +-----------------------------------------+----------------------+----------------------+
        
        +---------------------------------------------------------------------------------------+
        | Processes:                                                                            |
        |  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
        |        ID   ID                                                             Usage      |
        |=======================================================================================|
        |  Not running processes found                                                          |
        +---------------------------------------------------------------------------------------+`
    }
}



// Function
global.cmd = {
    title: function(text, add){
        return new Promise((resolve, reject)=>{     
            try {
                if(add.length == 0){
                    // console.log(`目前Title 為: ${app_name}`)
                    setTitle(`${app_title}`);
                }else{
                    // console.log(`目前Title 為: ${text}`)
                    setTitle(`${app_title} - ${add}`);
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
    },
    show: function(){
        return new Promise((resolve, reject)=>{
            consolewindow.showConsole();
            resolve();
        });
    },
    hide: function(){
        return new Promise((resolve, reject)=>{
            consolewindow.hideConsole();
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

// Download v1
global.downloadinfo = {
    targetSize: 0, // 目標檔案大小 (KB)
    downloadedSize: 0 // 目標已下載檔案大小 (KB)
}

// downloadData v3(Check Hash , --dev folder)
global.downloadData = function(url, folderpath) {
    return new Promise(async (resolve, reject) => {
        let name = path.basename(url);
        const filepath = path.join(folderpath, name);

        try {
        await fs.promises.mkdir(folderpath, { recursive: true });
        console.log(`${i.__('Created directory')}: ${folderpath}`);

        if (fs.existsSync(filepath)) {
            // if file exists, check if hash matches
            const urlHash = await getHashFromUrl(url);
            const fileHash = getHashFromFile(filepath);
            // console.log(`url hash: ${urlHash}`);
            // console.log(`file hash: ${fileHash}`);

            if (urlHash === fileHash) {
                console.log(`${name} ${i.__('already exists and hash matches.')}`);
                resolve('ok');
                return;
            }

            console.log(`${name} ${i.__('already exists but hash does not match, redownloading...')}`);
        }

        console.log(`${i.__('Start Download')} ${name} | url: ${url}`);
        const req = request(url);
        const stream = req.pipe(fs.createWriteStream(filepath));

        // progressBar v1
        let bar = new ProgressBar(`${i.__('Prepare to download')} [:bar]:percent ${convertSize(downloadinfo.downloadedSize)}/${convertSize(downloadinfo.targetSize)} ETA(sec): :eta`, { 
            total: 10
        }); 
    
        req.on('response',function(data){
            downloadinfo.targetSize = parseInt(data.headers['content-length']);
        });
    
        req.on('data', function (chunk) {
            downloadinfo.downloadedSize += chunk.length; 
            bar.update(downloadinfo.downloadedSize/downloadinfo.targetSize, {});
            bar.fmt = `${i.__('downloading')} [:bar]:percent ${convertSize(downloadinfo.downloadedSize)}/${convertSize(downloadinfo.targetSize)} ETA(sec): :eta`;
            if (bar.complete) {
                console.log(`${i.__('complete!')} ${filepath}`);
            }
        });
    
        stream.on('finish',function(){
            resolve('ok');
        });
    
        stream.on('error',function(err){
            reject(`stream error: ${err} in url ${url} at file ${filepath}`);
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

        async function getHashFromUrl(url) {
            const hash = crypto.createHash('sha256');

            return new Promise((resolve, reject) => {
            request.get(url)
                .on('error', err => reject(err))
                .on('data', chunk => hash.update(chunk))
                .on('end', () => resolve(hash.digest('hex')));
            });
        }

        function getHashFromFile(filepath) {
            // calculate actual hash from file
            const data = fs.readFileSync(filepath);
            const hash = crypto.createHash('sha256');
            hash.update(data);
            return hash.digest('hex');
        }

        } catch (err) {
            console.error(err);
            reject();
        }
    });
}

// 解壓縮
global.extract = async function(filename, target_path, output_path, value){
    try {
        console.log(color("yellow"), `${i.__('Start Extract')} ${filename}...`);
        console.log(color("red"), `${i.__('Target')}: ${target_path}\\${filename}`)
        console.log(color("red"), `${i.__('Outpput')}: ${output_path}`)
        await extract_zip(`${target_path}\\${filename}`, { dir: `${output_path}` })
        if(value == "sd"){
            // console.log("Re-name - 修正資料夾名稱");
            fs.copySync(`${output_path}\\stable-diffusion-webui-master`, `${output_path}\\stable-diffusion-webui`, { overwrite: true});
            fs.rm(`${output_path}\\stable-diffusion-webui-master`, {recursive:true});
            console.log(color("blue"), `${i.__('Done Extract')}! ${filename}...`);
            // pressAnyKey(`${i.__('pressAnyKey')}`, {
            //     ctrlC: "reject"
            // }).then(async () => {
            //     cmd.clear(); await ascii_art("red", app_name);
            // }).catch(() => {
            //     console.log('You pressed CTRL+C');
            // })
        }else if(value == "py"){
            console.log(color("blue"), `${i.__('Done Extract')}! ${filename}...`);
        }else{
            console.log("None - extract command");
            menu.status();
        }
    } catch (err) {
        // handle any errors
        console.log("error" + err)
    }
}

global.VCRedistversions = [
    '8.0', '9.0', '10.0', '11.0', '12.0', '14.0', '15.0', '16.0'
];

global.VCRedistInstalled = function(version) {
    // VC Redist registry Path - 註冊表路徑
    let registryPath = 'HKLM\\SOFTWARE\\Microsoft\\VisualStudio\\';

    let path = `${registryPath}${version}`;

    try {
        execSync(`reg query "${path}"`, { 
            timeout: 5000,
            // stdio: 'inherit'
            stdio: 'ignore'
        });
        // console.log(color("green"),`VC Redist ${version} is installed`);
        return true;
    } catch (err) {
        // console.log(color("red"),`VC Redist ${version} is not installed`);
        // if(version == `14.0`){
        //     console.log(color("yellow"), "Install 14.0 VC Redist...");
        // }
        return false;
    }
}

// 模型下載部分
// 後端流程
//  => 前端JSON回傳給我的有:
//      選擇當前的
//      (1)模型下載網址
//      (2)圖片網址
//      (3)模型的模型驗證碼
//      (4)模型的類型是啥
//      (5)模型的細節說明，此欄為: `${模型名稱}_${版本}_${作者名稱}_${作者}`
//          => 然後在後端下載，下載的部分就是把要丟到哪一個資料夾底下先說好就直接下載在那邊。
//              => 下載完後，在express的 /history
//                                              /model(checkpoint)
//                                              /lora
//                                              /hypernetwork
//                                              /Textual Inversion
//                                              /LyCoris
//                                              /Controlnet
//                                              /VAE
//              上丟上每個類別的 json 然後，把每個下載狀況儲存在本地
//              如果再按下 BSD 時候就會判斷是否要在安排下載。
// Example: checkpoint.json
//      {
//          {
//              下方為 模型與圖片 資訊
//              "type": "CHECKPOINT MERGE",
//              "category": "CHECKPOINT",
//              "name": "Perfect World 完美世界",
//              "repo_url": "https://civitai.com/models/8281",
//              "version": "v4 (Baked)",
//              "version_repo_url": "https://civitai.com/models/8281?modelVersionId=77276",
//              "current_download_url": "https://civitai.com/api/download/models/77276",
//              "hash": "24A393500F15C3243A4212C2CEAB764E43F343D8442B0F4CEC430DAC6EA00ECB",
//              "current_preview_url": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fa8421b4-7feb-4c9d-a226-06d3b67358aa/preview.jpeg",
//              下方為 模型細節
//              "need_vae_model": false,
//              "download_vae_model": false,
//              "finished_download": true,
//              "finished_download_date": "2023/05/26 00:27:30",
//              "check_hash": true,
//          }
//      }
global.ModelDownloadData = function(url){

}