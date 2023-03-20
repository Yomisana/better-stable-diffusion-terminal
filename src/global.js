
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
		const id = url.match(/^https?:\/\/(.*?)\/models\/([0-9]+)/ig).at(0).split('/').at(-1);
		const data = await getRequestJSON("https://civitai.com/api/v1/models/" + id);
		
		var obj = {
			id: id,
			name: data.name,
			type: data.type,
			author: data.creator.username,
			version: []
		};
		
		data.modelVersions.forEach(m => {
			obj.version.push({
				name: m.name,
				createdAt: m.createdAt,
				updatedAt: m.updatedAt,
				baseModel: m.baseModel,
				downloadUrl: m.downloadUrl,
				images: m.images.at(0).url
			});
		});
		
		resolve(obj);
	});
}
