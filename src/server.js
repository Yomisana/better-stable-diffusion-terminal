// // http://localhost:7858/?url="+location.href
// // 7858 port is better stable diffusion use port
// const express = require('express');

// const app = express();
// app_server.port = 7858;

// // 路由處理
// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// // 啟動服務器
// app.listen(app_server.port , () => {
//     console.log(`Server is running on port ${app_server.port}`);
// });
// require('./global')
const express = require('express');

const app = express();
const port = app_server.port;
console.log(`[express] Starting... ${port} port online`)
// 路由處理
app.get('/', (req, res) => {
    // res.send('Hello, World!');
    const url = req.query.url;
    res.send(`Received URL: ${url}`);
});

// 啟動服務器
app.listen(port, () => {
    console.log(`[express] Server is running on port ${port}`);
});