// 測試的參數在 Windows 11 pro 剛裝下去
// @echo off

// set PYTHON=C:\Users\Yomisana\Desktop\bin\stable-diffusion-webui\venv\Scripts\python.exe
// set GIT=C:\Users\Yomisana\Desktop\bin\git\cmd\
// set VENV_DIR=venv
// set COMMANDLINE_ARGS= --skip-torch-cuda-test

// call webui.bat

const $ = {
    read_sd_config:function(){
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
    vcr: function(){
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
    main: async function(){
        let re = $.read_sd_config();
        if(re === `nofile` || re === false){
            console.log("no cmdline_args file/ cmdline_args file not have content")
            console.log("create new one of cmdline_args.");
            $.basic_settings_sd();
        }else{
            console.log("設定檔裡面已經有先前所記錄的設定參數，你是否要繼續設定新參數或是使用上一次狀態執行Stable Diffusion，如果繼續將會覆蓋舊有的參數數據!")
            console.log(`config file inside command_args: ${re}`)
            inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: `${i.__('Please choose what you wanna do?')}:`,
                choices: [
                    `${i.__('Run as last status')}`,
                    `${i.__('keep create new one')}`,
                    `${i.__('Cancel back menu')}`,
                ]
                }
            ]).then(function(answers) {
                switch (answers.choice) {
                    case `${i.__('Run as last status')}`:
                        $.main_last(); // 尚未完成正在製作 basic_settings_sd();
                        break;
                    case `${i.__('keep create new one')}`:
                        $.basic_settings_sd(); // 正在製作中...
                        break;
                    case `${i.__('Cancel back menu')}`:
                        menu.status(); // 完成
                        break;
                    default:
                        break;
                }
            });
        }
        // console.log("開始準備 Stable Diffusion....");
        // $.prepare();
        // $.exit();
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
    basic_settings_sd: async function(){
        // gpu part settings > prepare > run bat execsync > if better stable diffusion dead will close too.
        // $.gpu_detect();
        gpulist = await $.getCUDAlist();
        console.log(color("yellow"),`Find ${gpulist.length} GPU`);
        console.log(gpulist);
        // await $.chooseGPU(); // 請選擇 你要使用哪一張英偉達顯示卡
        // 再來做判斷選擇是否要開啟一些主流功能?
        // 再來儲存設定檔，運行Stable Diffusion
    },
    getCUDAlist: async function(){
        return new Promise(async (resolve, reject) => {
            exec('nvidia-smi', function (error, stdout, stderr) {
                if(error){
                  console.error("[GPU-INFO ERROR] " + error);
                  console.log(`GPU: I guess is AMD or Intel GPU...`);
                  resolve(false);
                  return; 
                }
                // v2
                temp = [];
                result = [];
                for (let x of stdout.trim().split('\n')){
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
    gpu_detect: async function(){
        console.log("正在尋找此電腦硬體持有的CUDA顯卡中...");
        // await check.gpu().then((value) => {
        //     console.log(color("yellow"), `[WARN]以下是簡單測試你的顯示卡是否持有相關浮點數運算功能，顯卡是否支援詳細還是需要您至techpowerup.com 查看您當前的型號是否確認持有，二次確認!`);
        //     console.log(color("yellow"),`[GPU  X] Find ${value.length} GPU(s)`);

        //     let data = value.map((x, index) => {
        //         // gpulist.push(`${x.model} ${x.vram} GB`)
        //         // 判別此型號或是系列是否支援 FP16 FP32 FP64 是否持有
        //         console.log(`[${index}] ${x.model} - ${x.vram} GB`);
        //         if(x.model.includes('GeForce GTX 9') || x.model.includes('Tesla M') ) {
        //             console.log(color("yellow"), `此系列顯卡缺少 FP16 會出現問題，如果無法輸出圖片 可以嘗試讓Stable Diffusion強制 FP16 轉換成 FP32 做運算，或是更新顯卡至GeForce GTX 10系列或更高級別系列的顯卡`);
        //         }else if (x.model.includes('GeForce GTX 16')) {
        //             console.log(color("yellow"), `此系列顯卡可能 FP16 會出現問題，如果無法輸出圖片 可以嘗試讓Stable Diffusion強制 FP16 轉換成 FP32 做運算，或是更新顯卡至GeForce GTX 10系列或更高級別系列的顯卡`);
        //         }else if (x.model.includes('GeForce GTX 10') || x.model.includes('GeForce RTX 20') || x.model.includes('GeForce RTX 30') || x.model.includes('GeForce RTX 40')) {
        //             console.log(color("green"), `支援所有 FP16 FP32 FP64 浮點數運算，是否開啟 xformers 加速繪圖製作?`);
        //         }else if (x.model.includes('Tesla K40') || x.model.includes('Tesla K80') || x.model.includes('Tesla P100') || x.model.includes('Tesla V100')) {
        //             console.log(color("green"), `支援所有 FP16 FP32 FP64 浮點數運算，是否開啟 xformers 加速繪圖製作?`);
        //         }else {
        //             // console.log(color("red"), `Cannot determine floating point capabilities for this GPU.`);
        //             console.log(color("red"), `無法確定此 GPU 的浮點功能。 尚無判別: GeForce GTX 9 以前的版本、quadro系列、AMD、內顯、Intel Arc系列`);
        //             console.log(color("red"), `軟體無法辨識的顯卡是否支援浮點運算功能，詳細需要您至techpowerup.com 查看您當前的型號是否確認持有!`);
        //         }
        //     });
        // });
    },
    prepare: function(){
        $.vcr();
        $.sd();
    },
    sd: function(){
        lastrunstatus = true;
        config.set("lastrunstatus", lastrunstatus);
    },
    main_last: async function(){
        // Read sd config > prepare > run bat execsync > if better stable diffusion dead will close too.
        console.log("讀取最後一次的設定檔中....");
        // try to read last config/command_args.txt is have commandline or file is exists?
        let re = $.read_sd_config();
        console.log(re);
        if(re === false){
            await $.basic_settings_sd();
        }
        $.prepare();
        // 如果找不到 $.basic_settings_sd(); 所輸出的 config/command_args.txt 就跳轉到 $.basic_settings_sd();
        $.exit();
    },
}

module.exports = $;

// 測試的參數在 Windows 11 pro 剛裝下去
// @echo off

// set PYTHON=C:\Users\Yomisana\Desktop\bin\stable-diffusion-webui\venv\Scripts\python.exe
// set GIT=C:\Users\Yomisana\Desktop\bin\git\cmd\
// set VENV_DIR=venv
// set COMMANDLINE_ARGS= --skip-torch-cuda-test

// call webui.bat