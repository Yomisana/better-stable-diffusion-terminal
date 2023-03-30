
const ProgressBar = require('progress');
const request = require('request');
const fs = require('fs-extra');

// Black Magic
global.process = require('process')
global.inquirer = require('inquirer');
global.figlet = require('figlet');
global.extract_zip = require('extract-zip')
global.displaylang = null;
global.i = require('./lang/i18n.js');
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
        sd_name: "stable-diffusion.zip",
        output: `${process.cwd()}\\bin`,
        sd_output_folder: `${process.cwd()}\\bin\\stable-diffusion-webui-master`
    }
}

global.downloadinfo = {
    targetSize: 0, // 目標檔案大小 (KB)
    downloadedSize: 0 // 目標已下載檔案大小 (KB)
}
  
global.downloadData = function(url, path, name) {
  return new Promise(( resolve, reject ) => {
    // request | 請求
    const req = request(url);
    const stream = req.pipe(fs.createWriteStream(path+"\\"+name));
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
          console.log(`${i.__('complete!')} ${path+"\\"+name}`);
        }
    });

    stream.on('finish',function(){
      resolve('ok');
    });

    stream.on('error',function(err){
      reject(`stream error: ${err} in url ${url} at file ${path}`);
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