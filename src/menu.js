const $ = {
    welcome: async function(){  
        cmd.clear(); await ascii_art("yellow","Welcome");
        cmd.title(app_title, `Welcome`);
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
                    config.set("displaylang", "tw");displaylang = "tw";i.setLocale(displaylang);
                    break;
                case 'Exit':
                    close();
                    break;
                default:
                    break;
            }
            cmd.clear();
            $.status();
        });
    },
    status: async function(){
        let result = await running.read_sd_config();
        let check_install = await install.check();
        if(check_install){
            if(result === `nofile` || result === false){
                menu.main();
            }else{
                menu.main_last();
            }
        }else{
            menu.main_notinstall();
        }

        // lastrunstatus = config.get("lastrunstatus")
        // if(lastrunstatus === undefined){
        //     config.default();
        //     lastrunstatus = config.get("lastrunstatus");
        // }
        // if(lastrunstatus){
        //     menu.main_last();
        // }else{
        //     lastrunstatus = config.get("lastrunstatus")
        //     if(lastrunstatus === undefined){
        //         lastrunstatus = false;
        //         config.set("lastrunstatus", lastrunstatus);
        //     }
        //     menu.main();
        // }
    },
    main_last: async function(){
        cmd.clear(); await ascii_art("yellow", app_name);
        cmd.title(app_title, `Lobby`);
        // console.log("At menu");
        console.log(color("blue"),`App Version: ${app_version.current}`);
        inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `${i.__('Run Stable Diffusion Last Status')}`,
                `${i.__('Run Stable Diffusion')}`,
                // `X${i.__('Manual Install Model URL')}`,
                `${i.__('Install Stable Diffusion')}`,
                `${i.__('Check System what settings recommended of My PC')}`,
                `${i.__('Settings')}`,
                `${i.__('Exit')}`
            ]
            }
        ]).then(function(answers) {
            firstmenu = false;
            switch (answers.choice) {
                case `${i.__('Run Stable Diffusion Last Status')}`:
                    running.main_last();
                    break;
                case `${i.__('Run Stable Diffusion')}`:
                    running.main();
                    break;
                case `${i.__('Install Stable Diffusion')}`:
                    // install.sd_core();
                    install.menu();
                    break;
                case `${i.__('Manual Install Model URL')}`:
                    // $.models_menu();
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
    },
    main: async function(){
        cmd.clear(); await ascii_art("yellow", app_name);
        cmd.title(app_title, `Lobby`);
        // console.log("At menu");
        console.log(color("blue"),`App Version: ${app_version.current}`);
        inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `${i.__('Run Stable Diffusion')}`,
                // `X${i.__('Manual Install Model URL')}`,
                `${i.__('Install Stable Diffusion')}`,
                `${i.__('Check System what settings recommended of My PC')}`,
                `${i.__('Settings')}`,
                `${i.__('Exit')}`
            ]
            }
        ]).then(function(answers) {
            firstmenu = false;
            switch (answers.choice) {
                case `${i.__('Run Stable Diffusion')}`:
                    running.main();
                    break;
                case `${i.__('Install Stable Diffusion')}`:
                    // install.sd_core();
                    install.menu();
                    break;
                case `${i.__('Manual Install Model URL')}`:
                    // $.models_menu();
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
    },
    main_notinstall: async function(){
        cmd.clear(); await ascii_art("yellow", app_name);
        cmd.title(app_title, `Lobby`);
        // console.log("At menu");
        console.log(color("blue"),`App Version: ${app_version.current}`);
        inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                // `${i.__('Run Stable Diffusion')}`,
                `${i.__('Install Stable Diffusion')}`,
                // `X${i.__('Manual Install Model URL')}`,
                `${i.__('Check System what settings recommended of My PC')}`,
                `${i.__('Settings')}`,
                `${i.__('Exit')}`
            ]
            }
        ]).then(function(answers) {
            firstmenu = false;
            switch (answers.choice) {
                // case `${i.__('Run Stable Diffusion')}`:
                //     running.main();
                //     break;
                case `${i.__('Install Stable Diffusion')}`:
                    // install.sd_core();
                    install.menu();
                    break;
                // case `${i.__('Manual Install Model URL')}`:
                //     // $.models_menu();
                //     break;
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
    },
    input: async function(message, value){
        let answers = await inquirer.prompt([
            {
              name: 'value',
              message: `${message}:`
            }
        ]);
        if (!answers.value) {
            return value;
        }

        return answers.value;
    }
}

const settings = {
    menu: async function(){
        cmd.clear(); await ascii_art("yellow", "Settings");
        cmd.title(app_title, `Settings`);
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
                    $.status();
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
                    config.set("displaylang", "tw");displaylang = "tw";i.setLocale(displaylang);
                    settings.menu();
                    break;
                case `${i.__('Back')}`:
                    settings.menu();
                    break;
                default:
                    break;
            }
        });
    }
}

module.exports = $;