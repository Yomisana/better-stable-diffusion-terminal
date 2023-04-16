// 測試的參數在 Windows 11 pro 剛裝下去

// @echo off

// set PYTHON=C:\Users\Yomisana\Desktop\bin\stable-diffusion-webui\venv\Scripts\python.exe
// set GIT=C:\Users\Yomisana\Desktop\bin\git\cmd\
// set VENV_DIR=venv
// set COMMANDLINE_ARGS= --skip-torch-cuda-test

// call webui.bat


// const { execSync } = require('child_process');
// const { existsSync } = require('fs');

// // VC Redist 註冊表路徑
// const registryPath = 'HKLM\\SOFTWARE\\Microsoft\\VisualStudio\\';

// // 檢查是否有 VC Redist 的註冊表項目存在
// function hasVCRedistInstalled(version) {
//   const path = `${registryPath}${version}.0`;

//   try {
//     const output = execSync(`reg query "${path}"`, { timeout: 5000 });
//     console.log(`VC Redist ${version} is installed`);
//     return true;
//   } catch (err) {
//     console.log(`VC Redist ${version} is not installed`);
//     return false;
//   }
// }

// // 檢查 VC Redist 2005、2008、2010、2012、2013、2015、2017、2019 版本
// const versions = ['8.0', '9.0', '10.0', '11.0', '12.0', '14.0', '15.0', '16.0'];
// versions.forEach(version => hasVCRedistInstalled(version));