<h1 align="center">Better Stable Diffusion</h1>
<p>
  <img alt="Release" src="https://img.shields.io/github/v/release/Yomisana/Better-Stable-Diffusion.png?" />
  <img alt="Release_Downloads" src="https://img.shields.io/github/downloads/Yomisana/Better-Stable-Diffusion/total.png?" />
  <img alt="Discord" src="https://img.shields.io/static/v1?&message=Discord&color=5865F2&logo=Discord&logoColor=FFFFFF&label=Mjolnir+Studio" />
</p>

[English](./README.md) | 
[中文](#)

> Better Stable Diffusion 讓 Stable Diffusion 可以更簡單的方式安裝與運行與下載模型

***

## 安裝 Stable Diffusion

僅支援 Windows  
[點我下載軟體也可以!](https://github.com/Yomisana/stable-diffusion-installer/releases/latest/download/Stable-Diffusion-Installer.exe)

## 特色
- 自動更新軟體
  - 啟動時檢查更新 Better Stable Diffusion
- 終端機文字介面選單
- 安裝 AUTOMATIC1111/stable-diffusion-webui
  - 免安裝 Python: 不需要安裝在系統上! 安裝版本的 Python 不干擾你的系統先前持有或是不想安裝Python
    - 支援選擇 3.10.6 ~ 3.10.11
  - 免安裝 Git: 不需要安裝在系統上!
- Stable Diffusion啟動參數可以自訂義
- 檢查電腦硬體設備資訊 
- 基本檢測
  - 檢測型號是否支援 FP16 半精度浮點數
    - 支援檢查 Geforce GTX 9,GTX 10,GTX 16,RTX 20,RTX 30,RTX 40系列
  - [X]檢測顯存大小是否超過 6G(建議至少)、 8G(建議)
- 執行 AUTOMATIC1111/stable-diffusion-webui
  - 啟動時設定此啟動附帶參數
    - 可以記憶在`command_args.txt`上
- [X]瀏覽器擴充插件自動掛勾下載模型
  - [X]頁面上監聽模型資源網站上的版本與類型，選擇好後直接下載到執行中的Better Stable Diffusion的軟體路徑上的 Stable Diffsuion 上
- [X]可以偵測當前環境是否移動到另外一台電腦上進行額外修改
  - [X]讓你的 venv 可以正常運行
- [X]檢查路徑是否為純英文路徑
  - [X]看起來這部分好像沒有問題
- 軟體額外指令
  - `--dev`:執行檔目錄下創建一個 `better-stable-diffusion`資料夾把所有相關產生的資料夾存放在此資料夾底下。(可能會有BUG!)
- 全球性語言
  - 中文
  - 英文

## 展現你對我們的支持

給個右上方的 Star ⭐️ 如果這個專案軟體對你有幫助的話，或是 ko-fi 小額支持我們!  
``可以單次小額支持或是月附支持我們!``

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F2F3EIJG8)

Copyright © 2023 [Yomisana](https://dev.yomisana.xyz).
