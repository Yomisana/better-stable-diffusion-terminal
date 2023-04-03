[English](#) | 
[中文](./equipment.tw.md)
<h1 align="center">Better Stable Diffusion System/hardware requirements</h1>

# Operation system selection
> Recommend Windows > Linux > macOS
## Windows
It is recommended to run under Windows 10 or Windows 11
## Linux
None
## macOS
None

# Hardware equipment selection
## Minimum configuration:
> This low configuration issue requires debugging hardware on your own

|Hardware Name    |   Require               |
|----             |    ----                 |
|CPU(處理器)      | None                   |
|RAM(記憶體)      | Minimum at least 8G    |
|GPU(顯示卡)      | Minimum at least 4G    |
|DISK(硬碟)       | SSD or HDD             |
> DISK only affects the initial startup and replacement modules, and the files such as LoRa and other files need to be read and write at high speed.
> If you can use SSD, but it will affect the life of the SSD

## Recommended configuration:
> This is the recommended configuration, usually it will be easier to export the picture, but the waiting time depends on your graphics card

|Hardware Name    |   Require               |
|----             |    ----                 |
|CPU              | None                    |
|RAM              | Minimum at least 16G    |
|GPU              | The lowest at least 6g is recommended to 8G or more    |
|DISK             | SSD or HDD              |
> GPU can be used for GTX 1660 Ti as an example 6G may take 3~4 seconds for each step of drawing
> If you can release more shallow power (or overclock), then the drawing speed will be faster.
> Attention! Any overclocking may exceed the original settings of the hardware, and the life of the hardware device may be shortened.  
> DISK only affects high-speed reading and writing when starting up for the first time and replacing modules, loading lora and other files
> SSD if possible, but it will affect the life of SSD

### Selection of GPU
> Nvidia > AMD > Intel Arc > CPU(Yes! Draw to CPU but very slow!)

#### Nvidia
Suggested model: GTX 980 (or Ti) or above, and a graphics card with at least 6G memory, a graphics card above 8G is recommended 
Recommended series: GTX 9, 10, 16 series or RTX 20, 30, 40 series

If you have enough ability to disassemble and troubleshoot computer equipment for Tesla series graphics cards, you can buy.
Series timeline: K > M > P > V > T > RTX 40 
> If there is any omission or error, please add explanation

Recommended models to buy: TESLA K80(Dual Core / 24GB), Tesla M40(24GB), Tesla P40(24G)
> The latter or other models may not be recommended models, or the price is not very friendly to the purse

### Selection of DISK
No matter what type of SSD you have, remember it!
Stable Diffusion will be stored on the SSD, so you need to pay attention to the read and write life of the current hard disk, because you will use the data in the hard disk to read to the memory when you start it for the first time, and replace the model, etc.
Therefore, it is suggested that you can find a SSD that is not very important to use, or you are determined to use it on this SSD, otherwise it is not recommended to store it in SSD, it is recommended to store it in HDD.