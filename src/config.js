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
            if (!fs.existsSync(`${app_location.folder.settings}`)) {
                fs.mkdirSync(`${app_location.folder.settings}`,{recursive:true});
            }
            const configFile = path.join(`${app_location.file.config}`);
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
