require('./src/global');
process.stdout.write(
    String.fromCharCode(27) + "]0;" + "Stable Diffusion Installer" + String.fromCharCode(7)
);
process.stdout.write('\x1B[2J\x1B[0f');
config.load();
firstrun = config.get("firstrun");
// console.log(firstrun)
if(firstrun === undefined){
    config.default();
    firstrun = config.get("firstrun");
}
if(firstrun){
    core.welcome();
    // console.log("welcome - the first run")
    config.set("firstrun", false);
}else{
    displaylang = config.get("displaylang")
    if(displaylang === undefined){
        displaylang = "en";
        config.set("displaylang", displaylang);
    }
    i.setLocale(config.get("displaylang"));
    core.menu();
    // console.log("menu - not the first run")
}