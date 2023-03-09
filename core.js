const $ = {
    close: function(){
        console.log(`[X] See you next time...Bye ;_;`);
        process.exit(0);
    },
    welcome: function(){  
        figlet('Stable Diffusion Installer', function(err, data) {
            if (err) {
            console.log('Show ASCII Art Fail!...');
            console.dir(err);
            return;
            }
            console.log(data);
            inquirer
            .prompt([
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
            ])
            .then(function(answers) {
                switch (answers.choice) {
                    case 'English':
                        // console.log(`[*] English...`);
                        displaylang = "en";i.setLocale(displaylang);
                        break;
                    case 'Chinese':
                        // console.log(`[*] Chinese...`);
                        displaylang = "zh";i.setLocale(displaylang);
                        break;
                    case 'Exit':
                        $.close();
                        break;
                    default:
                        break;
                }
                $.menu();
            });
        });
    },
    menu: function () {
        inquirer
        .prompt([
            {
            type: 'list',
            name: 'choice',
            message: `${i.__('Please choose what you wanna do?')}:`,
            choices: [
                `${i.__('Auto Install Stable Diffusion')}`,
                `${i.__('Check System what settings recommended of My PC')}`,
                `${i.__('Exit')}`
            ]
            }
        ])
        .then(function(answers) {
            console.log(answers.choice)
            switch (answers.choice) {
                case `${i.__('Auto Install Stable Diffusion')}`:
                    $.autoinstall();
                    break;
                case `${i.__('Check System what settings recommended of My PC')}`:
                    $.checkPC();
                    break;
                case `${i.__('Exit')}`:
                    $.close();
                    break;
                default:
                    break;
            }
        });
    },
    checkPC: function(){
        console.log("這個是 checkPC 的 function")
    },
    autoinstall: function(){
        console.log("這個是 autoinstall 的 function")
    }
}

module.exports = $;