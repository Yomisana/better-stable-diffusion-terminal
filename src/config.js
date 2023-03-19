const nconf = require('nconf');
const path = require('path');
const fs = require('fs-extra');

const $ = {
    default: function(){
        // 設定預設值
        nconf.defaults({
            firstrun: true
        });
    },
    load: function(){
        // 設定檔路徑
        return new Promise(async(resolve) => {
            if (!fs.existsSync(`${settings.save_location}`)) {
                fs.mkdirSync(`${settings.save_location}`,{recursive:true});
            }
            const configFile = path.join(`${process.cwd()}\\config\\config.json`);
            // 載入設定檔
            nconf.file(configFile);
            resolve();
        })
    },
    get: function(name){
        // 取得設定值
        let data = nconf.get(name);
        return data;
    },
    set: async function(name,data){
        // 設定新值
        nconf.set(name, data);
        await $.save();
    },
    save: function(){
        // 儲存設定檔
        return new Promise(async(resolve) => {
            nconf.save((err) => {
                if (err) {
                    console.error(err);
                    resolve();
                } else {
                    // console.log('設定已儲存。');
                    resolve();
                }
            });
        })

    }
}

module.exports = $;
