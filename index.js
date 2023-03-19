require('./src/global');
process.stdout.write(
    String.fromCharCode(27) + "]0;" + "Stable Diffusion Installer" + String.fromCharCode(7)
);
core.welcome();

// let firstrun = config.get('FirstRun');
// if(firstrun){
//     core.welcome();
// }else{
//     core.menu();
// }
