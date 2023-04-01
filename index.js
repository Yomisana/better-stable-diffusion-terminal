require('./src/global');
// env settings
cmd.clear();cmd.title("Better Stable Diffusion");

// app settings
config.load()
    .then(debug())
    .then(init());

function debug(){
    // console.log("I am First");
}

async function init(){
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