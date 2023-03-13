const { exec } = require('child_process');
const { Console } = require('console');
const os = require('os');

const $ = {
    close: function(){
        console.log(`[X] See you next time...Bye ;_;`);
        process.exit(0);
    },
    welcome: function(){  
        figlet('Stable Diffusion Installer', function(err, data) {
            if (err) {
            console.log('Show ASCII Art Fail!...');
            console.dir(err);
            return;
            }
            console.log(data);
            inquirer
            .prompt([
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
            ])
            .then(function(answers) {
                switch (answers.choice) {
                    case 'English':
                        // console.log(`[*] English...`);
                        displaylang = "en";i.setLocale(displaylang);
                        break;
                    case 'Chinese':
                        // console.log(`[*] Chinese...`);
                        displaylang = "zh";i.setLocale(displaylang);
                        break;
                    case 'Exit':
                        $.close();
                        break;
                    default:
                        break;
                }
                $.menu();
            });
        });
    },
    menu: function () {
        inquirer
        .prompt([
            {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `${i.__('Auto Install Stable Diffusion')}`,
                `${i.__('Check System what settings recommended of My PC')}`,
                `${i.__('Exit')}`
            ]
            }
        ])
        .then(function(answers) {
            console.log(answers.choice)
            switch (answers.choice) {
                case `${i.__('Auto Install Stable Diffusion')}`:
                    $.autoinstall();
                    break;
                case `${i.__('Check System what settings recommended of My PC')}`:
                    onlycheck = true;
                    $.check();
                    break;
                case `${i.__('Exit')}`:
                    $.close();
                    break;
                default:
                    break;
            }
        });
    },
    autoinstall: async function(){
        await $.check()
        install.prepare();
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
    }
}

const install = {
    prepare: function(){
        // 設定命令參數
        console.log(`${i.__('Set Stable Diffusion Command Args...')}`)
        install.auto_set_command();
        // 
        // console.log(`${i.__('Start Download Stable Diffusion...')}`)
        // install.download();
    },
    auto_set_command:  async function(){
        let arr = [];
        // RAM 記憶體 低於 8G
        if(hardware.ram.fixed < 8){
            console.log("[X] RAM: Not good! is less 8G | " + hardware.ram.fixed + "GB");
            console.log(`${i.__('RAM below recommended value')}`);
            arr.push("--lowram"); 
        }else{
            console.log("[✔] RAM: Good! is more 8G | " + hardware.ram.fixed + "GB");
        }

        // 顯卡記憶體 低於 4G
        if(hardware.gpu.ram.fixed < 4){
            // 請注意! 這邊是已經記憶體低到一個極致了。
            console.log("[X] VRAM: Not good! is less 8G | " + hardware.gpu.ram.fixed + "GB");
            console.log(`${i.__('VRAM below recommended value')}`);
            arr.push("--lowvram");
        }else if(hardware.gpu.ram.fixed < 8){ // 顯卡記憶體 低於 8G(4.1~ 7.9G)
            // 這部分可以參考看看是否需要增加 vram_low 或是 vram_med
            console.log("[X] VRAM: Not good! is less 8G | " + hardware.gpu.ram.fixed + "GB");
            console.log(`${i.__('VRAM below recommended value')}`);
            let ans = await inquirer
            .prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Choose whether you add parameters')}:`,
                choices: [
                    `${i.__('Add lowvram')}`,
                    `${i.__('Add medvram')}`,
                    `${i.__('None Skip this time')}`
                ]
                }
            ]);
            switch (ans.choice) {
                case `${i.__('Add lowvram')}`:
                    arr.push("--lowvram");
                    break;
                case `${i.__('Add medvram')}`:
                    arr.push("--medvram");
                    break;
                case `${i.__('None Skip this time')}`:
                    console.log("Skip add vram args");
                    break;
                default:
                    break;
            }

            installer.cmd = arr.join(" ");
            // console.log(installer.cmd)
        }else{
            console.log("[✔] VRAM: Good! is more 8G | " + hardware.gpu.ram.fixed + "GB");
        }
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
    win_wimc: function(){
        return new Promise(async(resolve) => {
            exec('wmic path win32_VideoController get name', (err, stdout, stderr) => {
                try {
                    let output = stdout.replace(/^Name\s*/, '').replace(/\s*$/, '');
                    hardware.gpu.name = output;
                    resolve();
                } catch (error) {
                    console.error(`[ERROR - GPU] ${error}`);
                    resolve();
                }
            });
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

module.exports = $;