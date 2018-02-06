var http = require('http')
var url = require('url')
var fs = require('fs')
var port = process.argv[2]


if(!port){
    console.log('请指定端口好不啦？\nnode server 8888这样不会吗？')
    process.exit()
}

 var server = http.createServer((req,res)=>{
    var pathWithQuery = req.url
    var queryString = ''
    if(pathWithQuery.indexOf('?')>=0){
        queryString = pathWithQuery.substring(pathWithQuery.lastIndexOf('?'))
    }
    var parsedUrl = url.parse(pathWithQuery)
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = req.method

    /**********************************处理**********************************/
    console.log('含查询字符串的路径\n' + pathWithQuery)

    if(path === '/'){
        var string = fs.readFileSync('./index.html')
        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.write(string)
        res.end()
    }else if(path ==='/style.css'){
        var string = fs.readFileSync('./style.css')
        res.setHeader('Content-Type','text/css')
        res.write(string)
        res.end()
    }else if(path ==='/main.js'){
        var string = fs.readFileSync('./main.js')
        res.setHeader('Content-Type','application/javascript')
        res.write(string)
        res.end()
    }else if(path ==='/mainPromise.js'){
        var string = fs.readFileSync('./mainPromise.js')
        res.setHeader('Content-Type','application/javascript')
        res.write(string)
        res.end()
    }else if(path ==='/oylx' && method === 'POST'){
        let string = `{"name":"oylx","age":21}`
        res.statusCode = 200
        res.setHeader('Content-Type','text/json;charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin','http://oylx.com:8001')
        res.write(string)
        res.end()
    }else{
        let string = `{"name":"oylx","age":21}`
        res.statusCode = 400
        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.write(string)
        res.end()
    }



    /**********************************处理**********************************/

 })

 server.listen(port)
 console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);








