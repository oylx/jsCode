var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.argv[2];

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer((req,res)=>{
  var pathWithQuery = req.url; 
  var parsedurl = url.parse(pathWithQuery,true);
  var queryString = '';
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedurl.pathname;
  var query = parsedurl.query;
  var method = req.method;


  /**********************************处理**********************************/
  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if(path === '/'){
    var string = fs.readFileSync('./index.html','utf8');
    var serverAmount = fs.readFileSync('./db','utf8');
    string = string.replace('&&&amount&&&',serverAmount);
    res.setHeader('content-Type','text/html;charset=utf-8');
    res.end(string);
  }else if(path === '/style.css'){
    var string = fs.readFileSync('./style.css','utf8')
    res.setHeader('content-Type','text/css')
    res.end(string)
  }else if(path === '/main.js'){
    var string = fs.readFileSync('./main.js','utf8')
    res.setHeader('content-Type','application/javascript')
    res.end(string)
  }else if(path === '/pay'){
    let newServerAmount = parseInt(fs.readFileSync('./db','utf-8'),10)-1;
    fs.writeFileSync('./db',newServerAmount)
    let callbackName = query.callback;
    res.setHeader('Content-Type', 'application/javascript')
    res.statusCode = 200
    res.write(`
    ${callbackName}.call(undefined,{"success":true,"left":${newServerAmount}})
    `);
    res.end()
  }else{
    res.statusCode = 404;
    res.setHeader('content-Type','text/html;charset=utf-8');
    res.write('找不到对应路径，请自行修改')
    res.end();
  }

  /**********************************处理**********************************/
})


server.listen(port);
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);