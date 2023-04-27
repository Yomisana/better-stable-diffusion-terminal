// 測試的參數在 Windows 11 pro 剛裝下去
// @echo off

// set PYTHON=C:\Users\Yomisana\Desktop\bin\stable-diffusion-webui\venv\Scripts\python.exe
// set GIT=C:\Users\Yomisana\Desktop\bin\git\cmd\
// set VENV_DIR=venv
// set COMMANDLINE_ARGS= --skip-torch-cuda-test

// call webui.bat

const $ = {
    // config
    read_sd_config: async function(){
        let filePath = `${app_location.file.command_args}`;
        if (!fs.existsSync(filePath)) {
            // console.log('文件不存在');
            return `nofile`;
        }
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.trim().length === 0) {
            // console.log('文件內容為空');
            return false;
        } else {
            // console.log('文件內容為:', fileContent);
            return fileContent;
        }
    },
    save_sd_config: async function(args){
        // 儲存設定檔
        let filePath = `${app_location.file.command_args}`;

        fs.writeFile(filePath, args, function (err) {
            if (err) {
                console.error("Write config file fail!", err);
            } else {
                console.log("Write config file done!");
            }
        });
    },
    // VCRedist
    vcr: async function(){
        // 檢查是否有 VC Redist 的註冊表項目存在
        // 檢查 VC Redist 2005、2008、2010、2012、2013、2015、2017、2019 版本
        console.log(color("yellow"), "Check install VC Redist...")
        VCRedistversions.forEach(async version => {
            let result = VCRedistInstalled(version)
            // console.log(`${version}:${result}`)
            if(version === `14.0` && result === false){
                await install.vc_redist(); // download 14.0 vrc
                console.log(color("yellow"), `${version} VC Redist - Installing...`);
                console.log(color("yellow"), `WARNING! If you have enabled windows uac, please agree to the installation request that appears`)
                console.log(color("yellow"), `UAC:`)
                console.log(color("yellow"), `Name: Microsoft Visual C++ 2015-2019 Redistributable (x64) - 14.29.30139`)
                execSync(`${targetPath}\\vc_redist.x64.exe /quiet /norestart /log ${targetPath}\\vcr14.0_logger\\vcr14.0.txt`, (error, stdout, stderr) => {
                    if (error) {
                      console.error(`執行命令時出現錯誤： ${error}`);
                      return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                });
            }else{
                if(version === `14.0` && result === true){
                    console.log(color("green"), `${version} VC Redist - Installed`)
                }
                // checkpoint
                // if(result){
                //     console.log(color("green"), `${version} VC Redist - Installed`)
                // }else{
                //     console.log(color("red"), `${version} VC Redist - Not Install`);
                // }
            }
        });
        console.log("Finished VC Redist check & install")
    },
    // GPU Part
    getCUDAlist: async function(){
        console.log("正在尋找此電腦硬體持有的CUDA顯卡中...");
        return new Promise(async (resolve, reject) => {
            exec('nvidia-smi', function (error, stdout, stderr) {
                if(error){
                  console.error("[GPU-INFO ERROR] " + error);
                  console.log(`GPU: I guess is AMD or Intel GPU...`);
                  resolve(false);
                  return; 
                }
                // v2
                if(app_dev){
                    str = debug.str.nvidia_smi;
                    // str = stdout;
                }else{
                    str = stdout;
                }

                temp = [];
                result = [];
                for (let x of str.trim().split('\n')){
                    if(x.match(/\|( )+([0-9]+)( )+([\w \-_]+)/ig))
                        temp.push(x.match(/\|( )+([0-9]+)( )+([\w \-_]+)/ig));
                }
            
                for(let i = 0; i < temp.length; i++)
                    temp[i] = temp[i][0].substring(1).trim();
            
                temp.forEach(arr => {
                    if(!arr.match(/^0( )+N$/ig))
                       result.push(arr.split('  ').slice(0,2).at(-1))
                });
                // console.log(result);
                resolve(result);
            });
        });
    },
    choosegpu: async function(gpulist){
        return new Promise(async (resolve, reject) => {
            // let choices_list = gpulist;
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Please choose which one gpu you wanna using')}:`,
                choices: gpulist
                }
            ]).then(function(answers) {
                // console.log(answers.choice)
                // console.log(JSON.stringify(choices_list))
                console.log(`${i.__('You selected GPU')} [${answers.choice}] ${gpulist[answers.choice].name}`);
                app_gpu = answers.choice;
                resolve(answers.choice);
            });
        });
    },
    gpu_detect: async function(gpulist,id){
        return new Promise(async (resolve, reject) => {
            temp = gpulist[id].name
            if(temp.includes('GeForce GTX 9') || temp.includes('Tesla M') ) {
                console.log(color("yellow"), `此系列顯卡缺少 FP16 會出現問題，如果無法輸出圖片 可以嘗試讓Stable Diffusion強制 FP16 轉換成 FP32 做運算，或是更換顯卡至GeForce GTX 10系列或更高級別系列的顯卡`);
                
                resolve({ fp16: false, xformers: false, id:id});
            }else if (temp.includes('GeForce GTX 16')) {
                console.log(color("yellow"), `此系列顯卡可能 FP16 會出現問題，如果無法輸出圖片 可以嘗試讓Stable Diffusion強制 FP16 轉換成 FP32 做運算，或是更換顯卡至GeForce GTX 10系列或更高級別系列的顯卡`);
                resolve({ fp16: true, xformers: false, id:id});
            }else if (temp.includes('GeForce GTX 10') || temp.includes('GeForce RTX 20') || temp.includes('GeForce RTX 30') || temp.includes('GeForce RTX 40') || temp.includes('Tesla K40') || temp.includes('Tesla K80') || temp.includes('Tesla P100') || temp.includes('Tesla V100')) {
                console.log(color("green"), `支援所有 FP16 FP32 FP64 浮點數運算，是否開啟 xformers 加速繪圖製作?`);
                resolve({ fp16: true, xformers: true, id:id});
            }else {
                // console.log(color("red"), `Cannot determine floating point capabilities for this GPU.`);
                console.log(color("red"), `無法確定此 GPU 的浮點功能。 尚無判別: GeForce GTX 9 以前的版本、quadro系列、AMD、內顯、Intel Arc系列`);
                console.log(color("red"), `軟體無法辨識的顯卡是否支援浮點運算功能，詳細需要您至techpowerup.com 查看您當前的型號是否確認持有!`);
                resolve({ fp16: false, xformers: false, id:id});
            }
        });
    },
    basic_gpu_settings: async function(){
        return new Promise(async (resolve, reject) => {
            let gpulist = await $.getCUDAlist();
            console.log(color("yellow"),`Find ${gpulist.length} GPU`);
            // console.log(gpulist);
            let choices_list = gpulist.map((gpuName, index) => ({
                name: gpuName,
                value: index
            }));
            let choosecard = await $.choosegpu(choices_list);
            let result = await $.gpu_detect(choices_list,choosecard);
            resolve(result);
        });
    },
    // running main menu
    main: async function(){
        let re = await $.read_sd_config();
        if(re === `nofile` || re === false){
            console.log("no cmdline_args file/ cmdline_args file not have content")
            console.log("create new one of cmdline_args.");
            await $.basic_sd_settings();
        }else{
            console.log("設定檔裡面已經有先前所記錄的設定參數，你是否要繼續設定新參數或是使用上一次狀態執行Stable Diffusion，如果繼續將會覆蓋舊有的參數數據!")
            console.log(`config file inside command_args: ${re}`)
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Please choose what you wanna do?')}:`,
                choices: [
                    `${i.__('Keep run it')}`,
                    `${i.__('keep create new one')}`,
                    `${i.__('Cancel back menu')}`,
                ]
                }
            ]).then(function(answers) {
                switch (answers.choice) {
                    case `${i.__('Keep run it')}`:
                        $.main_last(); // 尚未完成正在製作 basic_settings_sd();
                        break;
                    case `${i.__('keep create new one')}`:
                        $.basic_sd_settings(); // 完成
                        break;
                    case `${i.__('Cancel back menu')}`:
                        menu.status(); // 完成
                        break;
                    default:
                        break;
                }
            });
        }
    },
    main_last: async function(){
        // Read sd config > prepare > run bat execsync > if better stable diffusion dead will close too.
        console.log("讀取最後一次的設定檔中....");
        // try to read last config/command_args.txt is have commandline or file is exists?
        let re = await $.read_sd_config();
        // console.log(re);
        if(re === `nofile` || re === false){
            await $.basic_sd_settings();
        }else{
            await $.prepare();
        }
    },
    // basic sd setting
    open_browser: async function(){
        return new Promise(async (resolve, reject) => {
            // let choices_list = gpulist;
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__(`open the webui URL in the default browser upon launch?`)}:`,
                choices: [
                    'yes',
                    'no'
                ]
                }
            ]).then(function(answers) {
                let result = answers.choice === 'yes' ? true : false;
                // console.log(result);
                resolve(result);
            });
        });
    },
    default_theme: async function(){
        return new Promise(async (resolve, reject) => {
            // let choices_list = gpulist;
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__(`default theme?`)}:`,
                choices: [
                    `${i.__(`dark theme`)}`,
                    `${i.__(`white theme`)}`
                ]
                }
            ]).then(function(answers) {
                let result = answers.choice === `${i.__(`dark theme`)}` ? true : false;
                // console.log(result);
                resolve(result);
            });
        });
    },
    basic_sd_settings: async function(){
        let result =  await $.basic_gpu_settings();
        // 是否自動開啟預設瀏覽器
        let open_browser = await $.open_browser();
        // 是否更換預設port
        let port = await menu.input(`${i.__('Enter you want listen port here')} [7860]`,`7860`);
        // 是否啟動暗黑主題(強制執行)
        let default_theme = await $.default_theme();
        // 完成! 開始準備
        console.log(color("red"),`如果不喜歡可以在 config/command_args.txt 上做變更`)
        console.log(color("yellow"),`建議與使用者個人化設定:`)
        // console.log(color("yellow"),`fp16 to fp32:${result.fp16}`)
        // console.log(color("yellow"),`enable xformers:${result.xformers}`)
        // console.log(color("yellow"),`enable auto launch:${open_browser}`)
        // console.log(color("yellow"),`port:${port}`)
        // console.log(color("yellow"),`Dark theme:${default_theme}`)
        let args = [];
        if (result.id) {
            args.push(`--device-id ${result.id}`);
        }
        if (result.fp16) {
            args.push(`--precision full --no-half`);
        }
        if (result.xformers) {
            args.push("--xformers");
        }
        if (open_browser) {
            args.push("--autolaunch");
        }
        args.push(`--port ${port}`);
        if (default_theme) {
            args.push(`--theme dark`);
        }else{
            args.push(`--theme light`);
        }
        console.log(args.join(" "));
        await $.save_sd_config(args.join(" "));
        await menu.status();
        // await $.prepare();

        // 以下可選製作未來有需要在製作即可
        // 是否新增帳號密碼
        // ...etc
    },
    // prepare part
    prepare: async function(){
        await $.vcr();
        await $.sd();
    },
    exit: function(){
        pressAnyKey(`${i.__('pressAnyKey')}`, {
            ctrlC: "reject"
        }).then(async () => {
            cmd.clear(); await ascii_art("red", app_name);        menu.status();
        }).catch(() => {
            console.log('You pressed CTRL+C');        menu.status();
        })
    },
    // 上方為已完成不要在動他了
    // 下方未完成
    sd: async function(){
        console.log(`Ready run Stable Diffusion...`)
        // read file to get args
        let re = await $.read_sd_config();
        // let env = Object.assign({}, process.env, {
        //   PYTHON: `${targetBinPath}\\stable-diffusion-webui\\venv\\Scripts\\python.exe`,
        //   GIT: `${targetBinPath}\\git\\cmd\\git.exe`,
        //   COMMANDLINE_ARGS: re,
        // });
        console.log(`Start run Stable Diffusion...`)
        let python = `set PYTHON = ${targetBinPath}\\stable-diffusion-webui\\venv\\Scripts\\python.exe`
        let git = `set GIT = ${targetBinPath}\\git\\cmd\\`
        let batch = `@echo off && title Stable Diffusion Console && chcp 950 && ${python} && ${git} && set COMMANDLINE_ARGS= ${re} && cd ${targetBinPath}\\stable-diffusion-webui\\ && call webui.bat`;
        // 創建一個新的命令提示字元(cmd)視窗
        const cmd = execSync(`start cmd /k "${batch}"`, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`);
            return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
        menu.status();
        
        // 監聽 'exit' 事件，當視窗關閉時，結束進程
        // cmd.on('exit', (code) => {
        //     console.log(`子進程已退出，退出碼: ${code}`);
        // });
        
        // const child = execSpawn('cmd.exe', [`/c ${targetBinPath}\\stable-diffusion-webui\\webui.bat`], {
        //   cwd: `${targetBinPath}\\stable-diffusion-webui\\`,
        //   env: env,
        // });
        
        // child.stdout.on('data', (data) => {
        //   console.log(`[INFO]: ${data}`);
        // });
        
        // child.stderr.on('data', (data) => {
        //   console.error(`[ERROR]: ${data}`);
        // });
        
        // child.on('exit', (code, signal) => {
        //   console.log(`子程序退出，錯誤碼 ${code}，訊號 ${signal}`);
        // });

        // 測試的參數在 Windows 11 pro 剛裝下去
        // @echo off
        // chcp 950
        // set PYTHON= `${targetBinPath}\\stable-diffusion-webui\\venv\\Scripts\\python.exe`
        // set GIT= `${targetBinPath}\\git\\cmd\\`
        // set VENV_DIR=venv
        // set COMMANDLINE_ARGS= `${re}`

        // call webui.bat

        // lastrunstatus = true;
        // config.set("lastrunstatus", lastrunstatus);
    }
}

module.exports = $;


// 未實際裝上，寫出來但沒用到就放這
    // port: async function(){
    //     return new Promise(async (resolve, reject) => {
    //         // let choices_list = gpulist;
    //         inquirer.prompt([
    //             {
    //             type: 'list',
    //             name: 'choice',
    //             message: `${i.__(`need change default listen port?`)}:`,
    //             choices: [
    //                 'yes',
    //                 'no'
    //             ]
    //             }
    //         ]).then(async function(answers) {
    //             let result = answers.choice === 'yes' ? true : false;
    //             // console.log(result);
    //             if(result){
    //                 let port = await menu.input(`${i.__('Enter you want listen port here')} [7860]`,`7860`);
    //                 resolve(`${port}`);
    //             }else{
    //                 resolve("7860");
    //             }
    //         });
    //     });
    // },