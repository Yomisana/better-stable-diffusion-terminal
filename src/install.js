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
            if(url == d_value.sdw.url){
                await downloadData(`${url}`, path.join(`${d_value.temp}`));
                // // 解壓縮
                extract(`${filename}`, `${d_value.temp}`, `${d_value.bin}`, "sd");    
            }else {
                console.log(filename); // remote.bat
                await downloadData(`${url}`, path.join(`${d_value.temp}`));
                console.log(color("red"), "不會自行解壓縮")  
            }
            
            // $.sd_extract(`${installer.download.sd_name}`);
        }
    }
}

module.exports = $;