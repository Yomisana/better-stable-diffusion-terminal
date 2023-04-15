const $ = {
    sd_core: async function(){
        // 下載 AUTOMATIC1111 / stable-diffusion-webui
        // 核心程式
        // https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip
        
        // 選擇下載位置(預設: AUTOMATIC1111/stable-diffusion-webui):
        cmd.title(app_title, `Ready Install Stable Diffusion`);
        let sdurl = await menu.input(`${i.__('Past url here')} (Github/AUTOMATIC1111/stable-diffusion-webui)`, d_value.sdw.url);
        console.log(sdurl);

        // 下載
        if (!validator.isURL(sdurl)) {
            console.log(color("red"),`${i.__('Invalid URL. Please enter a valid URL.')}`);
            $.sd_core();
        }else{
            cmd.title(app_title, `Download & Install Stable Diffusion`);
            const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
            const targetBinPath = app_dev ? d_value.dev_bin : d_value.bin;
            console.log(color("yellow"),`${i.__('Start Download Stable Diffusion...')}`);
            console.log(color("blue"),`${i.__('Default Download Folder')}: ${targetPath}`);
            let filename = path.basename(sdurl);
            await downloadData(sdurl, path.join(targetPath));
            if(sdurl === d_value.sdw.url) await extract(filename, targetPath, targetBinPath, "sd");
            else console.log(color("red"), `${filename} ${i.__('decompressed or custom link will not decompress by itself')}`);
            $.python();
        }
    },
    python: async function(){
        cmd.title(app_title, `Ready Install Python`);
        let default_pyurl = "https://www.python.org/ftp/python/version/python-version-embed-amd64.zip"
        let default_pyver = "3.10.6"
        console.log(color("yellow"),`Only can install 3.10.6 ~ 3.10.11 version of pyhton`);
        let pyurl = await menu.input(`${i.__('Past py version here')} (${default_pyver})`, default_pyver);
        if (!semver.valid(pyurl)) {
            console.log('輸入的 Python 版本號不符合格式');
            $.python()
        } else if (!semver.satisfies(pyurl, '>=3.10.6 <=3.10.11')) {
            console.log('輸入的 Python 版本號不在支援範圍內');
            $.python()
        } else {
            console.log('輸入的 Python 版本號符合要求');
            pyurl = default_pyver === pyurl ? default_pyurl.replace(/version/g, `3.10.6`) : default_pyurl.replace(/version/g, `${pyurl}`);
            console.log(pyurl);
            // 下載
            if (!validator.isURL(pyurl)) {
                console.log(color("red"),`${i.__('Invalid URL. Please enter a valid URL.')}`);
                $.python();
            }else{
                cmd.title(app_title, `Download & Install Python`);
                const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
                const targetBinPath = app_dev ? d_value.dev_bin : d_value.bin;
                console.log(color("yellow"),`${i.__('Start Download Python...')}`);
                console.log(color("blue"),`${i.__('Default Download Folder')}: ${targetPath}`);
                let filename = path.basename(pyurl);
                await downloadData(pyurl, path.join(targetPath));
                await extract(filename, targetPath, `${targetBinPath}\\python`, "py");
                await $.pip(targetBinPath);
                pressAnyKey(`${i.__('pressAnyKey')}`, {
                    ctrlC: "reject"
                }).then(async () => {
                    cmd.clear(); await ascii_art("red", app_name);        menu.main();
                }).catch(() => {
                    console.log('You pressed CTRL+C');        menu.main();
                })
            }
        }
    },
    pip: async function(targetBinPath){
        try {
            cmd.title(app_title, `Python => pip Downloading...`);
            console.log(`Install pip`)
            await fs.promises.mkdir(`${targetBinPath}\\python\\DLLs`, { recursive: true });
            const data = fs.readFileSync(`${targetBinPath}\\python\\python310._pth`, 'utf8');
            const newData = data.replace(/#import site/g, 'import site');
            fs.writeFileSync(`${targetBinPath}\\python\\python310._pth`, newData);
            console.log('The python310._pth has been updated!');
           
            // start download pip
            let pip_url = `https://bootstrap.pypa.io/get-pip.py`
            await downloadData(pip_url,`${targetBinPath}\\python`);
            // python get-pip.py
            // python -m pip install --upgrade pip
            cmd.title(app_title, `Python => pip Installing...`);
            const { execSync } = require('child_process');
            // 執行 get-pip.py
            console.log(color("blue"),`python pip install...`)
            execSync(`${targetBinPath}\\python\\python.exe ${targetBinPath}\\python\\get-pip.py`);
            // 執行 pip 升級指令
            console.log(color("blue"),`python pip upgrade...`)
            execSync(`${targetBinPath}\\python\\python.exe -m pip install --upgrade pip`);
            console.log(`Install pip done!`)

            // 安裝&執行 venv
            console.log(color("blue"),`python pip install venv`)
            execSync(`${targetBinPath}\\python\\python.exe -m pip install virtualenv`);

            execSync(`${targetBinPath}\\python\\python.exe -m virtualenv ${targetBinPath}\\stable-diffusion-webui\\venv`);
            
            // Copy DLLs
            console.log(color("blue"),`copy python important files`)
            fs.copySync(`${targetBinPath}\\python\\python310.zip`, `${targetBinPath}\\stable-diffusion-webui\\venv\\Scripts\\python310.zip`, { recursive: true });
            execSync(`${targetBinPath}\\stable-diffusion-webui\\venv\\Scripts\\activate.bat`);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = $;