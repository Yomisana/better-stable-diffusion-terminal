require('./src/global');
require('./src/server');
// env settings
cmd.clear();cmd.title(app_title, "");
app_version.current = app.version
// app settings
config.load()
    .then(debug())
    // .then(updater.checkForUpdates())
    // .then(console.log(targetPath))
    // .then(console.log(targetBinPath))
    // .then(init());

async function debug(){
    process.argv.forEach(function (val, index, array) {
        // console.log("參數" ,index + ': ' + val);
        if (val.includes('--dev')) {
            app_title = "Better Stable Diffusion - In dev"
            cmd.title(app_title, "");
            app_dev = true;
            console.log("In dev")
        }
    });
    targetPath = app_dev ? d_value.dev_temp : d_value.temp;
    targetBinPath = app_dev ? d_value.dev_bin : d_value.bin;
    updater.checkForUpdates();

    // await install.git();
    // let url = await menu.input(`${i.__('Past url here')} (Github/AUTOMATIC1111/stable-diffusion-webui)`, d_value.sdw.url);
    // await downloadData(`${url}`, path.join(`${d_value.temp}`));
    // console.log("I am First");
    // const { exec } = require('child_process');
    // exec('start https://www.example.com');
    // console.log(`DEBUG one function`)
    // getModelDetails(`https://civitai.com/api/download/models/77276`);
}


// async function init(){
//     await ascii_art("yellow",app_name);
//     // active
//     first run = config.get("first run");
//     if(first run === undefined){
//         config.default();
//         first run = config.get("first run");
//     }
//     if(first run){
//         menu.welcome();
//         config.set("first run", false);
//     }else{
//         displaylang = config.get("display lang")
//         if(displaylang === undefined){
//             displaylang = "en";
//             config.set("display lang", displaylang);
//         }
//         i.setLocale(config.get("display lang"));
//         menu.main();
//     }
// }


const $ = {
    init: async function(){
        cmd.title(app_title, `waiting...`);
        await ascii_art("yellow",app_name);
        // active
        firstrun = config.get("first run");
        if(firstrun === undefined){
            config.default();
            firstrun = config.get("first run");
        }
        if(firstrun){
            menu.welcome();
            config.set("first run", false);
            // first run settings
            config.set("hide console window", true);
        }else{
            displaylang = config.get("display lang")
            if(displaylang === undefined){
                displaylang = "en";
                config.set("display lang", displaylang);
            }
            i.setLocale(config.get("display lang"));
            menu.status();
        }
    }
}

module.exports = $;