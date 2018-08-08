//模块导入
//1.读取文件的模块
const fs = require("fs")
//2开启服务器的模块
const http = require("http")
//生成路径的模块
const path = require("path")
//引入第三方模块
const  mime=require("mime")//识别后缀(例如,图片,css,js)

/* 流程 */
//1记录网站根目录
let rootPath = path.join(__dirname, "DIR");//Node.js 中，__dirname 总是指向被执行 js 文件的绝对路径，
//2创建服务器
let server=http.createServer((request,response)=>{
    //2.1生成地址
    let targetPath=path.join(rootPath,request.url)            // response.setHeader("content-type",mime.getType(targetPath))

    //2.2判断路径是否存在
    //存在
    if(fs.existsSync(targetPath)){
       //判断是文件还是文件夹
       fs.stat(targetPath,(err,stats)=>{
           //如果是文件,直接读取,返回结果
           if(stats.isFile()){
               fs.readFile(targetPath,(err,data)=>{
                   response.end(data)
               })
           }
           //如果是文件夹,渲染出列表
           if(stats.isDirectory()){
               //读取文件夹信息
               fs.readdir(targetPath,(err,files)=>{
                    let tem=""
                    //遍历
                    for(let i=0;i<files.length;i++){
                        tem+=`
                        <li>
                            <a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">${files[i]}</a>
                        </li>                       
                         `
                    }

                    response.end(`
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
                    <html>
                    
                    <head>
                        <title>Index of/ </title>
                    </head>
                    
                    <body>
                        <h1>Index of ${request.url}</h1>
                        <ul>
                            ${tem}
                        </ul>
                    </body>
                    
                    </html>
                    `)
               })
           }
       })
    }else{
        response.setHeader("content-type","text/html;charset=utf-8")
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
            </body></html>
        `)
    }
})
//3开启服务器(监听)
server.listen(8848,'127.0.0.1',()=>{
    console.log("开启成功");
    
})

