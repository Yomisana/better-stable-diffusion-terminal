const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const $ = {
    close: function(){
        console.log(`[\u2613 ] See you next time...Bye ;_;`);
        process.exit(0);
    },
    welcome: function(){  
        figlet('SD Installer', function(err, data) {
            if (err) {
                console.log('Show ASCII Art Fail!...');
                console.dir(err);
                return;
            }
            console.log(data);
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: 'Please choose your laungue:',
                choices: [
                    'English',
                    'Chinese',
                    'Exit'
                ]
                }
            ]).then(function(answers) {
                switch (answers.choice) {
                    case 'English':
                        // console.log(`[*] English...`);
                        config.set("displaylang", "en");displaylang = "en";i.setLocale(displaylang);
                        break;
                    case 'Chinese':
                        // console.log(`[*] Chinese...`);
                        config.set("displaylang", "zh");displaylang = "zh";i.setLocale(displaylang);
                        break;
                    case 'Exit':
                        $.close();
                        break;
                    default:
                        break;
                }
                process.stdout.write('\x1B[2J\x1B[0f');
                $.menu();
            });
        });
    },
    menu: function () {
        figlet('Stable Diffusion', function(err, data) {
            if (err) {
                console.log('Show ASCII Art Fail!...');
                console.dir(err);
                return;
            }
            if(firstmenu){
                console.log(data);
            }
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Please choose what you wanna do?')}:`,
                choices: [
                    `${i.__('Install Model URL')}`,
                    `${i.__('Auto Install Stable Diffusion')}`,
                    `${i.__('Check System what settings recommended of My PC')}`,
                    `${i.__('Settings')}`,
                    `${i.__('Exit')}`
                ]
                }
            ]).then(function(answers) {
                firstmenu = false;
                switch (answers.choice) {
                    case `${i.__('Auto Install Stable Diffusion')}`:
                        $.autoinstall();
                        break;
                    case `${i.__('Install Model URL')}`:
                        $.models_menu();
                        break;
                    case `${i.__('Check System what settings recommended of My PC')}`:
                        onlycheck = true;
                        $.check();
                        break;
                    case `${i.__('Settings')}`:
                        $.settings_menu();
                        break;
                    case `${i.__('Exit')}`:
                        $.close();
                        break;
                    default:
                        break;
                }
            });
        });
    },
    settings_menu: function(){
        process.stdout.write('\x1B[2J\x1B[0f');
        figlet('SD Settings', function(err, data) {
            if (err) {
                console.log('Show ASCII Art Fail!...');
                console.dir(err);
                return;
            }
            console.log(data);
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Please choose what you wanna do?')}:`,
                choices: [
                    `${i.__('Display Language')}`,
                    `${i.__('Back')}`
                ]
                }
            ]).then(function(answers) {
                switch (answers.choice) {
                    case `${i.__('Display Language')}`:
                        $.settings_lang_menu();
                        break;
                    case `${i.__('Back')}`:
                        $.menu();
                        break;
                    default:
                        break;
                }
            });
        });
    },
    settings_lang_menu: function(){
        process.stdout.write('\x1B[2J\x1B[0f');
        figlet('SD Settings', function(err, data) {
            if (err) {
                console.log('Show ASCII Art Fail!...');
                console.dir(err);
                return;
            }
            console.log(data);
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Please choose your laungue')}:`,
                choices: [
                    'English',
                    'Chinese',
                    `${i.__('Back')}`
                ]
                }
            ]).then(function(answers) {
                switch (answers.choice) {
                    case 'English':
                        config.set("displaylang", "en");displaylang = "en";i.setLocale(displaylang);
                        $.settings_menu();
                        break;
                    case 'Chinese':
                        config.set("displaylang", "zh");displaylang = "zh";i.setLocale(displaylang);
                        $.settings_menu();
                        break;
                    case `${i.__('Back')}`:
                        $.settings_menu();
                        break;
                    default:
                        break;
                }
            });
        });
    },
    autoinstall: function(){
        process.stdout.write('\x1B[2J\x1B[0f');
        figlet('Stable Diffusion', async function(err, data) {
            if (err) {
                console.log('Show ASCII Art Fail!...');
                console.dir(err);
                return;
            }
            console.log(data);
            await $.check()
            install.prepare();
        });
    },
    check: function(){
        return new Promise(async(resolve) => {
            let system = platform.check_hardware();
            if (system === 'windows') {
                console.log(`${i.__('Checking your PC hardware now...Please wait...')}`);
                await platform.windows();
                if(onlycheck){
                    onlycheck = false;
                    $.menu();
                }
                resolve();
            } else {
                console.log(`${i.__('unsupport this system please change other system open this app')}`);
                $.menu();
                resolve();
            }
        })
    },
    models_menu: function(){
        // Lora
        // CHECKPOINT
            // CHECKPOINT MERGE
            // CHECKPOINT TRAINED
        // TEXTUAL INVERSION
        // HYPERNETWORK
        // console.log("only support default stable diffusion models and only support civitai website")
        // console.log("models_menu 目前沒有想法說這個目錄可以幹嘛...但能確定的是如果之後要在新增其他網站可以下載");
        // inquirer menu: 說明: 給連結下載安裝，自動偵測到說Type 是哪一類的自動丟到那個目錄底下，如果沒有遇過就告知使用者，未知的就會被存放到Installer資料夾
        inquirer.prompt([
            {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `${i.__('Download Model')}`,
                `${i.__('Back')}`
            ]
            }
        ])
        .then(function(answers) {
            switch (answers.choice) {
                case `${i.__('Download Model')}`:
                        inquirer.prompt([
                            {
                            name: 'url',
                            message: `${i.__('Past url here')}:`
                            },
                        ])
                        .then(async answers => {
                            console.info(`${i.__('url')}: ${answers.url}`);
                            let data = await getModelDetails(answers.url);
                            if(data.id === undefined)console.log("Please retry again Tips: only support civitai");
                            else{
                                if (!fs.existsSync(`${installer.download.file_location}`)) {
                                    fs.mkdirSync(`${installer.download.file_location}`,{recursive:true});
                                }
                                // 選擇版本:
                                console.log(commit)
                                console.log(`id: ${data.id}`)
                                console.log(`name: ${data.name}`)
                                console.log(`type: ${data.type}`)
                                console.log(`author: ${data.author}`)
                                console.log(commit);
                                var versionList = [];
                                for(let o in data.version){
                                    versionList.push(o);
                                }
                                inquirer.prompt([
                                    {
                                    type: 'list',
                                    name: 'choice',
                                    message: `${i.__('Please choose your version')}:`,
                                    choices: versionList
                                    }
                                ]).then(async function(answers) {
                                    console.log(answers.choice);

                                    if(data.version[answers.choice].download.length === 1){
                                        await downloadData(data.version[answers.choice].download.at(0).downloadUrl, `${process.cwd()}\\installer`,`${data.version[answers.choice].download.at(0).name}`);
                                        $.models_menu();
                                    }
                                    else{
                                        versionList = [];
                                        data.version[answers.choice].download.forEach(d => {
                                            versionList.push(d.name);
                                        });

                                        inquirer.prompt([
                                            {
                                            type: 'list',
                                            name: 'choice',
                                            message: `${i.__('Please choose your version')}:`,
                                            choices: versionList
                                            }
                                        ]).then(async function(versionType) {
                                            for(let d of data.version[answers.choice].download){
                                                if(d.name === versionType.choice){
                                                    console.log(d.downloadUrl);
                                                    await downloadData(d.downloadUrl, `${process.cwd()}\\installer`,`${d.name}`);
                                                    $.models_menu();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    break;
                case `${i.__('Back')}`:
                    $.menu();
                    break;
                default:
                    break;
            }
        });
    }
}

const platform = {
    check_hardware: function(){
        let platform = os.platform();
        if (platform === 'win32') {
            return "windows"
        } else if (platform === 'darwin') {
            return "macos"
        } else if (platform === 'linux') {
            return "linux"
        } else {
            return "unknown";
        }
    },
    windows: async function(){
        return new Promise(async(resolve) => {
            // 獲取CPU資訊
            hardware.cpu = os.cpus()[0].model;
            // 獲取RAM資訊
            const totalMemory = os.totalmem();
            hardware.ram.total = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
            hardware.ram.fixed = Math.round(hardware.ram.total)
            // 獲取GPU資訊
            // await platform.win_wimc();
            await platform.getNvidiaDrivers();
            console.log(commit)
            console.log(`CPU: ${hardware.cpu}`);
            console.log(`RAM: ${hardware.ram.total} GB / ${hardware.ram.fixed} GB`);
            console.log(`GPU: ${hardware.gpu.name} | ${hardware.gpu.ram.fixed} GB`);
            console.log(commit)
            resolve();
        })
    },
    getNvidiaDrivers: function(){
        return new Promise((resolve)=>{
          exec('nvidia-smi --query-gpu=gpu_name,memory.total,driver_version --format=csv,noheader,nounits',function (error, stdout, stderr) {
              if(error){
                console.error("[GPU-INFO ERROR] " + error);
                console.log(`GPU: I guess is AMD or Intel GPU...`);
                resolve(false);
                return; 
              }
  
              let nvddv = stdout.split(',');
              hardware.gpu.name = nvddv[0];
              hardware.gpu.ram.total = nvddv[1];
              hardware.gpu.ram.fixed = nvddv[1]/1024;
              resolve(true);
          });
        });
      }
}

const install = {
    prepare: function(){
        // 設定命令參數
        console.log(`${i.__('Set Stable Diffusion Command Args...')}`)
        install.auto_set_command();
    },
    auto_set_command:  async function(){
        let arr = [];
        // RAM 記憶體 低於 8G
        if(hardware.ram.fixed < 8){
            console.log("[\u2613 ] RAM: Not good! is less 8G | " + hardware.ram.fixed + "GB");
            console.log(`${i.__('RAM below recommended value')}`);
            arr.push("--lowram"); 
        }else{
            console.log("[✔] RAM: Good! is more 8G | " + hardware.ram.fixed + "GB");
        }

        // 顯卡記憶體 低於 4G
        if(hardware.gpu.ram.fixed < 4){
            // 請注意! 這邊是已經記憶體低到一個極致了。
            console.log("[\u2613 ] VRAM: Not good! is less 8G | " + hardware.gpu.ram.fixed + "GB");
            console.log(`${i.__('VRAM below recommended value')}`);
            arr.push("--lowvram");
        }else if(hardware.gpu.ram.fixed < 8){ // 顯卡記憶體 低於 8G(4.1~ 7.9G)
            // 這部分可以參考看看是否需要增加 vram_low 或是 vram_med
            console.log("[\u2613 ] VRAM: Not good! is less 8G | " + hardware.gpu.ram.fixed + "GB");
            console.log(`${i.__('VRAM below recommended value')}`);
            let ans = await inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Choose whether you add parameters')}:`,
                choices: [
                    `${i.__('Add lowvram')}`,
                    `${i.__('Add medvram')}`,
                    `${i.__('None Skip this time')}`,
                    `${i.__('Back')}`
                ]
                }
            ]);
            
            switch (ans.choice) {
                case `${i.__('Add lowvram')}`:
                    arr.push("--lowvram");
                    installer.cmd = arr.join(" ");
                    install.sd_download();
                    break;
                case `${i.__('Add medvram')}`:
                    arr.push("--medvram");
                    installer.cmd = arr.join(" ");
                    install.sd_download();
                    break;
                case `${i.__('None Skip this time')}`:
                    console.log(`${i.__('None Skip this time')}`);
                    installer.cmd = arr.join(" ");
                    install.sd_download();
                    break;
                case `${i.__('Back')}`:
                    $.menu();
                    break;
                default:
                    break;
            }
        }else{
            console.log("[✔] VRAM: Good! is more 8G | " + hardware.gpu.ram.fixed + "GB");
            install.sd_download();
        }
    },
    sd_download: async function(){
        // https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip
        console.log(`${i.__('Start Download Stable Diffusion...')}`);
        console.log(process.cwd());
        if (!fs.existsSync(`${installer.download.file_location}`)) {
            fs.mkdirSync(`${installer.download.file_location}`,{recursive:true});
        }
        await downloadData(`${installer.download.url}`, path.join(`${installer.download.file_location}`),`${installer.download.sd_name}`);
        install.sd_extract(`${installer.download.sd_name}`);
    },
    sd_extract: async function(zipname){
        try {
            console.log(`${i.__('where is the zip file location')}: ${installer.download.file_location}\\${zipname}` )
            console.log(`${i.__('where is the extract location')}: ${installer.download.output}`)
            await extract_zip(`${installer.download.file_location}\\${zipname}`, { dir: `${installer.download.output}` })
            console.log(`${i.__('Extraction complete')}!`);
            $.menu()
            fs.copySync(installer.download.sd_output_folder, `${installer.download.output}\\stable-diffusion-webui`, { overwrite: true});
            fs.rm(installer.download.sd_output_folder, {recursive:true});


          } catch (err) {
            // handle any errors
            console.log("error" + err)
          }
        // await extract_zip(zipname);
    }
}

module.exports = $;
