const $ = {
    checkForUpdates: function(){
        app_version.current = app.version
        console.log(`${i.__('Check Update')}`);
        console.log(`${i.__('Current Version')}: ${app_version.current}`);
        const headers = {
            'User-Agent': 'Better-Stable-Diffusion/v1'
        };
        
        request({ url: repoUrl, headers }, (error, response, body) => {
            if (error) {
                console.error(error);
            } else {
                let data = JSON.parse(body);
                let latestVersion = data.tag_name;
                app_version.latest = latestVersion;
                console.log(`${i.__('Latest Version')}`, latestVersion);
                $.update($.compareVersions(app_version.current,app_version.latest));
            }
        });
    },
    compareVersions: function(current, latest){
        const v1 = current.split('.').map(Number);
        const v2 = latest.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
          if (v1[i] > v2[i]) {
            return 1;
          } else if (v1[i] < v2[i]) {
            return -1;
          }
        }
        return 0;
    },
    update: async function(result){
      if (result < 0) {
        console.log(`New version ${app_version.latest} is available!`);
        try {
          const targetPath = app_dev ? d_value.dev_temp : d_value.temp;
          await Promise.all([
            downloadData(`${repoUrl_update_file}`, path.join(targetPath)),
            downloadData(`${repoUrl_file}`, path.join(targetPath))
          ]);
          $.call_update();
        } catch (error) {
          console.error(error);
        }
      }else {
        if (result === 0) {
          console.log('You are using the latest version.');
        }else{
          console.log(`Your version ${app_version.current} is newer than the latest version ${app_version.latest}.`);
        }
        let index = require('../index');
        index.init();
      }
    },
    call_update: function(){
      const { spawn } = require('child_process');
      let path = app_dev ? d_value.dev_temp : d_value.temp;
      const child = spawn(`${path}\\update.bat`, [], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      close();
    }
}

module.exports = $;