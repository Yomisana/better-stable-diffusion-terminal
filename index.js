require('./src/global');
// env settings
cmd.clear();cmd.title("Better Stable Diffusion");
app_version.current = app.version
// app settings
config.load()
    .then(debug())
    .then(updater.checkForUpdates())
    // .then(init());

async function debug(){
    process.argv.forEach(function (val, index, array) {
        // console.log("參數" ,index + ': ' + val);
        if (val.includes('--dev')) {
            app_dev = true;
            console.log("In dev")
        }
    });
    // let url = await menu.input(`${i.__('Past url here')} (Github/AUTOMATIC1111/stable-diffusion-webui)`, d_value.sdw.url);
    // await downloadData(`${url}`, path.join(`${d_value.temp}`));
    // console.log("I am First");
    // const { exec } = require('child_process');
    // exec('start https://www.example.com');
}


// async function init(){
//     await ascii_art("yellow",app_name);
//     // active
//     firstrun = config.get("firstrun");
//     if(firstrun === undefined){
//         config.default();
//         firstrun = config.get("firstrun");
//     }
//     if(firstrun){
//         menu.welcome();
//         config.set("firstrun", false);
//     }else{
//         displaylang = config.get("displaylang")
//         if(displaylang === undefined){
//             displaylang = "en";
//             config.set("displaylang", displaylang);
//         }
//         i.setLocale(config.get("displaylang"));
//         menu.main();
//     }
// }


const $ = {
    init: async function(){
        await ascii_art("yellow",app_name);
        // active
        firstrun = config.get("firstrun");
        if(firstrun === undefined){
            config.default();
            firstrun = config.get("firstrun");
        }
        if(firstrun){
            menu.welcome();
            config.set("firstrun", false);
        }else{
            displaylang = config.get("displaylang")
            if(displaylang === undefined){
                displaylang = "en";
                config.set("displaylang", displaylang);
            }
            i.setLocale(config.get("displaylang"));
            menu.main();
        }
    }
}

module.exports = $;