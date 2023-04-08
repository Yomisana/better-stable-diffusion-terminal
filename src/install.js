const $ = {
    sd_core: async function(){
        // 下載 AUTOMATIC1111 / stable-diffusion-webui
        // 核心程式
        // https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip
        
        // 選擇下載位置(預設: AUTOMATIC1111/stable-diffusion-webui):
        let sdurl = await menu.input(`${i.__('Past url here')} (Github/AUTOMATIC1111/stable-diffusion-webui)`, d_value.sdw.url);
        console.log(sdurl);

        // 下載
        if (!validator.isURL(sdurl)) {
            console.log(color("red"),`${i.__('Invalid URL. Please enter a valid URL.')}`);
            $.sd_core();
        }else{
            const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
            const targetBinPath = app_dev ? d_value.dev_bin : d_value.bin;
            console.log(color("yellow"),`${i.__('Start Download Stable Diffusion...')}`);
            console.log(color("blue"),`${i.__('Default Download Folder')}: ${targetPath}`);
            let filename = path.basename(sdurl);
            await downloadData(sdurl, path.join(targetPath));
            if(sdurl === d_value.sdw.url) await extract(filename, targetPath, targetBinPath, "sd");
            else console.log(color("red"), `${filename} ${i.__('decompressed or custom link will not decompress by itself')}`);
        }
        $.python();
    },
    python: async function(){
        console.log(color("yellow"),`${i.__('Please paste like this url')}: ${d_value.python[3_10_10]}`)
        let pyurl = await menu.input(`${i.__('Past py url here')} (3.10.10)`, d_value.python[3_10_10]);
        console.log(pyurl);

        // 下載
        if (!validator.isURL(pyurl)) {
            console.log(color("red"),`${i.__('Invalid URL. Please enter a valid URL.')}`);
            $.python();
        }else{
            const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
            const targetBinPath = app_dev ? d_value.dev_bin : d_value.bin;
            console.log(color("yellow"),`${i.__('Start Download Python...')}`);
            console.log(color("blue"),`${i.__('Default Download Folder')}: ${targetPath}`);
            let filename = path.basename(pyurl);
            await downloadData(pyurl, path.join(targetPath));
            if(pyurl === d_value.python[3_10_10]) extract(filename, targetPath, `${targetBinPath}\\python3.10.10`, "py");
            else console.log(color("red"), `${filename} ${i.__('decompressed or custom link will not decompress by itself')}`);
        }
    }
}

module.exports = $;