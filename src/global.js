
const ProgressBar = require('progress');
const request = require('request');
const fs = require('fs-extra');

// Black Magic
global.process = require('process')
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

global.config = require('./config');
global.firstrun = undefined
global.firstmenu = true
global.settings = {
    // file_location: `${process.cwd()}\\installer`,
    save_location: `${process.cwd()}\\config`
}

global.commit = "****************************************************************";
global.onlycheck = false;
global.installer = {
    vram_low: false, 
    vram_med: false, 
    cmd: null,
    download: {
        file_location: `${process.cwd()}\\installer`,
        url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip",
        save: `${process.cwd()}\\installer\\stable-diffusion.zip`,
        sd_name: "stable-diffusion.zip",
        output: `${process.cwd()}\\bin`,
        sd_output_folder: `${process.cwd()}\\bin\\stable-diffusion-webui-master`
    }
}

// global.downloadProgress = {
//     total: 0,
//     now: 0
// };

// global.downloadData = function(url,path){
//     return new Promise((resolve, reject) => {
//         total = 0;
//         now = 0;
//         let startTime = Date.now();
//         const bar = new ProgressBar(`${i.__('downloading...')}[:bar] :percent :speed`, { total: 100 });
      
//         const req = request(url);
//         const stream = req.pipe(fs.createWriteStream(path));
      
//         req.on('response', function(data) {
//             downloadProgress.total = parseInt(data.headers['content-length']);
//         });
      
//         req.on('data', function(chunk) {
//             downloadProgress.now += chunk.length;
//             now += chunk.length;
//             const speed = ((now / 1024) / ((Date.now() - startTime) / 1000)).toFixed(2); // 計算下載速度，單位為 KB/s
//             bar.update(downloadProgress.now / downloadProgress.total, { speed: `${speed}KB/s` }); // 顯示下載速度
//             if (bar.complete) {
//                 console.log(`${i.__('complete!')}`);
//             }
//         });
      
//         stream.on('finish', function() {
//             resolve('ok');
//         });
      
//         stream.on('error', function(err) {
//             reject(`stream error: ${err} in url ${url} at file ${path}`);
//         });
//     });
// };
global.downloadProgress = {
    etaTime: 0,
};
global.downloadData = function(url, path) {
    return new Promise(( resolve, reject ) => {
        let targetSize = 0;
        let downloadedSize = 0;
        let prevDownloadedSize = 0;
        let prevTime = Date.now();
        const bar = new ProgressBar(`${i.__('downloading...')}[:bar] :percent ${convertSize(downloadedSize)}/${convertSize(targetSize)} --:--:--`, { total: 100 });
        const req = request(url);
        const stream = req.pipe(fs.createWriteStream(path));
        
        req.on('response',function(data){
            targetSize = parseInt(data.headers['content-length']);
            bar.fmt = `${i.__('downloading...')}[:bar] :percent ${convertSize(downloadedSize)}/${convertSize(targetSize)} --:--:--`;
        });
      
        req.on('data', function (chunk) {
            downloadedSize += chunk.length;
            const currentTime = Date.now();
            const deltaSize = downloadedSize - prevDownloadedSize;
            const deltaTime = currentTime - prevTime;
            const speed = deltaSize / deltaTime; // in bytes/ms
            const remainingSize = targetSize - downloadedSize;
            const remainingTime = Math.floor(remainingSize / speed); // in ms
            prevDownloadedSize = downloadedSize;
            prevTime = currentTime;
            bar.update(downloadedSize/targetSize, {
                eta: formatTime(remainingTime)
            });
            bar.fmt = `${i.__('downloading...')}[:bar] :percent ${convertSize(downloadedSize)}/${convertSize(targetSize)} ${formatTime(remainingTime)}`;
            if (bar.complete) {
                console.log(`${i.__('complete!')} ${path}`);
            }
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
      
        function formatTime(ms) {
            const sec = Math.floor(ms / 1000) % 60;
            const min = Math.floor(ms / (1000 * 60)) % 60;
            const hour = Math.floor(ms / (1000 * 60 * 60));
            let time = `${pad(hour)}:${pad(min)}:${pad(sec)}`
            if(time === "00:00:00"){
                return downloadProgress.etaTime;
            }else{
                downloadProgress.etaTime = time;
                return downloadProgress.etaTime;
            }
        }
      
        function pad(num) {
            return num.toString().padStart(2, '0');
        }
      
        stream.on('finish',function(){
            resolve('ok');
        });
      
        stream.on('error',function(err){
            reject(`stream error: ${err} in url ${url} at file ${path}`);
        });
    });
};



global.getRequestJSON = function(url){
	return new Promise((resolve, reject)=>{
        request.get(
          {
            url: url
          },
          function (err, httpResponse, body) {
            if(err)
                reject(err);
            else{
                var obj = JSON.parse(body.trim());
                resolve(obj);
            }
          }
        );
	});
}

global.getModelDetails = function(url){
	return new Promise(async (resolve)=>{
		const id = url.match(/^https?:\/\/civitai\.com\/models\/([0-9]+)/ig)?.at(0).split('/').at(-1);
		if(id === undefined){resolve({});return;}
		
		const data = await getRequestJSON("https://civitai.com/api/v1/models/" + id);
		
		var obj = {
			id: id,
			name: data.name,
			type: data.type,
			author: data.creator.username,
			version: {}
		};
		
		data.modelVersions.forEach(m => {
            obj.version[m.name] = {
                createdAt: m.createdAt,
				updatedAt: m.updatedAt,
				baseModel: m.baseModel,
				download: m.files,
				images: m.images.at(0).url
            };
		});
		
		resolve(obj);
	});
}