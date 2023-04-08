const $ = {
    sd_core: async function(){
        // 下載 AUTOMATIC1111 / stable-diffusion-webui
        // 核心程式
        // https://github.com/AUTOMATIC1111/stable-diffusion-webui/archive/refs/heads/master.zip
        
        // 選擇下載位置(預設: AUTOMATIC1111/stable-diffusion-webui):
        let url = await menu.input(`${i.__('Past url here')} (Github/AUTOMATIC1111/stable-diffusion-webui)`, d_value.sdw.url);
        console.log(url);

        // 下載
        if (!validator.isURL(url)) {
            console.log(color("red"),`${i.__('Invalid URL. Please enter a valid URL.')}`);
            $.sd_core();
        }else{
            console.log(color("yellow"),`${i.__('Start Download Stable Diffusion...')}`);
            console.log(color("blue"),`${i.__('Default Download Folder')}: ${d_value.temp}`);
            let filename = path.basename(url);
            if(url == d_value.sdw.url){
                const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
                const targetBinPath = app_dev ? d_value.dev_bin : d_value.bin;
                
                await downloadData(`${url}`, path.join(targetPath));
                extract(`${filename}`, targetPath, targetBinPath, "sd");
            }else {
                const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
                await downloadData(`${url}`, path.join(targetPath));
                console.log(filename); // remote.bat
                console.log(color("red"), "不會自行解壓縮");
            }
            
            // $.sd_extract(`${installer.download.sd_name}`);
        }
    }
}

module.exports = $;