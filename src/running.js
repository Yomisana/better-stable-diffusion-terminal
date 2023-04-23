// 測試的參數在 Windows 11 pro 剛裝下去

// @echo off

// set PYTHON=C:\Users\Yomisana\Desktop\bin\stable-diffusion-webui\venv\Scripts\python.exe
// set GIT=C:\Users\Yomisana\Desktop\bin\git\cmd\
// set VENV_DIR=venv
// set COMMANDLINE_ARGS= --skip-torch-cuda-test

// call webui.bat

const $ = {
    main_last: async function(){
        $.vcr();
        $.sd();
        // 如果找不到 $.basic_settings_sd(); 所輸出的 config/command_args.txt 就跳轉到 $.basic_settings_sd();
        pressAnyKey(`${i.__('pressAnyKey')}`, {
            ctrlC: "reject"
        }).then(async () => {
            cmd.clear(); await ascii_art("red", app_name);        menu.status();
        }).catch(() => {
            console.log('You pressed CTRL+C');        menu.status();
        })
    },
    main: async function(){
        $.vcr();
        $.sd();
        $.basic_settings_sd();
        pressAnyKey(`${i.__('pressAnyKey')}`, {
            ctrlC: "reject"
        }).then(async () => {
            cmd.clear(); await ascii_art("red", app_name);        menu.status();
        }).catch(() => {
            console.log('You pressed CTRL+C');        menu.status();
        })
    },
    basic_settings_sd: function(){

    },
    sd: function(){
        lastrunstatus = true;
        config.set("lastrunstatus", lastrunstatus);
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
                if(result){
                    console.log(color("green"), `${version} VC Redist - Installed`)
                }else{
                    console.log(color("red"), `${version} VC Redist - Not Install`);
                }
            }
        });
        console.log("Finished VC Redist check & install")
    }
}

module.exports = $;