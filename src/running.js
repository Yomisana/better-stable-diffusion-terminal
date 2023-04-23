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
        // // 檢查是否有 VC Redist 的註冊表項目存在
        // 檢查 VC Redist 2005、2008、2010、2012、2013、2015、2017、2019 版本
        console.log(color("yellow"), "Check install VC Redist...")
        VCRedistversions.forEach(async version => {
            let result = VCRedistInstalled(version)
            // console.log(`${version}:${result}`)
            if(version === `14.0` && result === false){
                await install.vc_redist();
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
                // if(result){
                //     console.log(color("green"), `${version} VC Redist - Installed`)
                // }else{
                //     console.log(color("red"), `${version} VC Redist - Not Install`);
                // }
            }
        });
        console.log("Finished VC Redist check & install")
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
    main: async function(){
        let re = $.read_sd_config();
        if(re === `nofile` || re === false){
            console.log("no cmdline_args file/ cmdline_args file not have content")
            console.log("create new one of cmdline_args.");
            $.basic_settings_sd();
        }else{
            console.log("設定檔裡面已經有先前所記錄的設定參數，你是否要繼續設定新參數或是使用上一次狀態執行Stable Diffusion，如果繼續將會覆蓋舊有的參數數據!")
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
                        $.main_last();
                        break;
                    case `${i.__('keep create new one')}`:
                        $.basic_settings_sd();
                        break;
                    case `${i.__('Cancel back menu')}`:
                        menu.status();
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
    basic_settings_sd: async function(){
        gpulist = [];
        console.log("硬體掃描顯示卡中...");
        await check.gpu().then((value) => {
            console.log(color("yellow"),`[GPU  X] Find ${value.length} GPU(s)`);
            let data = value.map((x, index) => {
                gpulist.push(`${x.model} ${x.vram} GB`)
            });
        });
        console.log(gpulist);
        console.log(`僅供參考: 你的記憶體小於 8G 記憶體`)
        console.log(`如果你小於 6G 必定確定新增低顯存指令(6G版本的顯卡可能需要或是不需要)`)
        console.log(`你的顯卡好像僅支援[半精度(FP16),單精度(FP32),雙精度(FP64)]`);
        console.log(`可能引發 某些模型使用 半精度(FP16) 製作的可能會無法使用`);
        console.log(`可能引發 某些模型使用 單精度(FP32) 製作的可能會無法使用`);
        console.log(`可能引發 某些模型使用 雙精度(FP64) 製作的可能會無法使用`);
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