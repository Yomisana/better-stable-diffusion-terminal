const $ = {
    welcome: async function(){  
        cmd.clear(); await ascii_art("yellow","Welcome");
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
                    close();
                    break;
                default:
                    break;
            }
            cmd.clear();
            $.main();
        });
    },
    main: async function(){
        cmd.clear(); await ascii_art("yellow", app_name);
        // console.log("At menu");
        inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `X${i.__('Install Model URL')}`,
                `X${i.__('Auto Install Stable Diffusion')}`,
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
                    check.pc();
                    break;
                case `${i.__('Settings')}`:
                    settings.menu();
                    break;
                case `${i.__('Exit')}`:
                    close();
                    break;
                default:
                    break;
            }
        });
    }
}

const settings = {
    menu: async function(){
        cmd.clear(); await ascii_art("yellow", "Settings");
        inquirer.prompt([
            {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `${i.__('Back')}`,
                `${i.__('Display Language')}`,
            ]
            }
        ]).then(function(answers) {
            switch (answers.choice) {
                case `${i.__('Display Language')}`:
                    settings.lang_menu();
                    break;
                case `${i.__('Back')}`:
                    $.main();
                    break;
                default:
                    break;
            }
        });
    },
    lang_menu: async function(){
        cmd.clear(); await ascii_art("yellow", "Laungue");
        inquirer.prompt([
            {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose your laungue')}:`,
            choices: [
                `${i.__('Back')}`,
                'English',
                'Chinese',
                
            ]
            }
        ]).then(function(answers) {
            switch (answers.choice) {
                case 'English':
                    config.set("displaylang", "en");displaylang = "en";i.setLocale(displaylang);
                    settings.menu();
                    break;
                case 'Chinese':
                    config.set("displaylang", "zh");displaylang = "zh";i.setLocale(displaylang);
                    settings.menu();
                    break;
                case `${i.__('Back')}`:
                    settings.menu();
                    break;
                default:
                    break;
            }
        });
    },
}

const check = {
    pc: function(){
        return new Promise(async(resolve) => {
            console.log(color("red"), "[Tips] 此功能僅掃描硬體設備，並且在掃描完畢後可以點開此連結查看你的硬體設備是否可以支撐? https://github.com/Yomisana/stable-diffusion-installer/blob/master/equipment.md")
            pressAnyKey(`${i.__('pressAnyKey')} ${i.__('scan hardware info...')} | ${i.__('pressAnyKey cancel')} ${i.__('Back Menu')}`, {
                ctrlC: "reject"
            }).then(async () => {
                cmd.clear(); await ascii_art("red", app_name);
                console.log(`${i.__('Start Scan...')}`);
                // 完整掃描後再產生完整報告
                console.log(color("blue"),`[CPU   ] ${check.cpu()}`)
                console.log(color("blue"),`[RAM   ] ${check.ram()}`)
                await check.gpu().then((value) => {
                    console.log(color("yellow"),`[GPU  X] Find ${value.length} GPU(s)`);
                    let data = value.map((x, index) => {
                        // console.log(x,index)
                        // const type = x.type.replace('HD', 'HDD');
                        // const interfaceType = x.interfaceType.replace('USB', 'USB ');
    
                        console.log(color("blue"), `[GPU  ${index}] ${x.model} ${x.vram} GB (${x.driverVersion})`)
                    });
                    // console.log(data.Disk);
                    // console.log(color("blue"),`${}`);
                    // console.log(color("blue"),`[DISK] ${JSON.stringify(value)}`);
                });
                await check.disk().then((value) => {
                    console.log(color("yellow"),`[DISK X] Find ${value.length} Disk(s)`);
                    let data = value.map((x, index) => {
                        const type = x.type.replace('HD', 'HDD');
                        const interfaceType = x.interfaceType.replace('USB', 'USB ');
                        // return `[DISK ${index}] ${x.interfaceType} ${type} ${x.size2Auto}`;
                        // return {
                        //     Disk: `[DISK ${index}]`,
                        //     InterfaceType: x.interfaceType,
                        //     Type: type,
                        //     Size: x.size2Auto
                        // };
                        console.log(color("blue"), `[DISK ${index}] ${type} ${interfaceType} ${x.size2Auto}`)
                    });
                    // console.log(data.Disk);
                    // console.log(color("blue"),`${}`);
                    // console.log(color("blue"),`[DISK] ${JSON.stringify(value)}`);
                });
                console.log(`${i.__('Done!')} https://github.com/Yomisana/stable-diffusion-installer/blob/master/equipment.md`);
                pressAnyKey(`${i.__('pressAnyKey')}`, {
                    ctrlC: "reject"
                }).then(async () => {
                    cmd.clear(); await ascii_art("red", app_name);$.main();
                }).catch(() => {
                    console.log('You pressed CTRL+C');  $.main();
                })
            }).catch(() => {
                console.log('You pressed CTRL+C')
                $.main();
            })
            resolve()
        })
    },
    cpu: function(){
        hardware.cpu = os.cpus()[0].model;
        return `${hardware.cpu}`
    },
    ram: function(){
        // 獲取RAM資訊
        const totalMemory = os.totalmem();
        hardware.ram.total = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
        hardware.ram.fixed = Math.round(hardware.ram.total)
        // console.log(`RAM: ${hardware.ram.total} GB / ${hardware.ram.fixed} GB`);
        return `Total:${hardware.ram.total} GB / Fixed: ${hardware.ram.fixed} GB`;
        // 低於 16 G 叫他去參考疑難辯解看看有沒有辦法再低於 16G 的時候正常運行
    },
    gpu: async function(){
        await osinfo.graphics(function(data) {
            // console.log(data.controllers);

            hardware.gpu = data.controllers.map((info) => ({
                model: info.model,
                vram: `${(info.vram / 1024)}`,
                driverVersion: info.driverVersion,
            }))
        });
        return hardware.gpu;

        // 查看當前是否有 gpu 的存在，如果沒有就是直接給他一個大逼都，喔不是 就是察看說是否有
        // Nvidia 的顯示卡或是 AMD 的顯示卡 或是 Intel Arc 的顯示卡， 如果這三個都沒有找到
        // 就直接建議說，用CPU 繪製，並且幫他自動詢問是否加上此參數 用 CPU 繪圖
        // 如果有直接對 顯示卡的 記憶體做區分超過 6G 的話可以正常運行 不需要增加 --lowvarm 啥的
    },
    disk: async function(){
        await osinfo.diskLayout(function(data) {
            // console.log(data);
            hardware.disk = data.map((info) => ({
                type: info.type,
                interfaceType: info.interfaceType,
                // size2TB: (info.size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB',
                // size2GB: (info.size / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
                size2Auto: (info.size / (1024 * 1024 * 1024 * 1024)).toFixed(2) >= 0.9 ?  `${Math.round((info.size / (1024 * 1024 * 1024 * 1024)).toFixed(2))} TB` : `${(info.size / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            }));
            // return hardware.disk;
        });
        // console.log(hardware.disks);
        return hardware.disk;

        // 查看是傳統硬碟還是固態硬碟
        // 這部分只會影響到 在加載模組到 顯示卡上面而已，因為模型是先到記憶體再把他複製到顯示卡記憶體裡面我有不知道為啥要這樣幹 但是從 HDD 上面看到是這樣的所以才建議記憶體至少8G(請參考解決低於配置的時候該怎麼新增參數)，16G 則不需要 
        // 16 或是 32 沒差 只要超過 16 就可以了 問題不大
    }
    // 目前Stable 的因素就這幾個其他的就沒啥了
}
module.exports = $;