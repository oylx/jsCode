## JSONP的理解

### JSONP实现步骤

JSONP是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，老式浏览器全部支持，服务器改造非常小。它的基本思想是，网页通过添加一个<script>元素，向服务器请求JSON数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

步骤包含如下：

1.请求方创建 script，src 指向响应方，这种做法不受同源政策限制，同时传一个查询参数 ?callbackName=xxx

2.响应方服务器根据查询参数callbackName，构造形如xxx.call(undefined, '数据')这样的响应，将数据传回

3.浏览器接收到响应，就会执行xxx.call(undefined, '数据')，那么请求方就获得了想要的数据

请求方code实现:

注意code细节：

- 变量名：第一个字符是字母/下划线/$，第二个字母可以加入数字（**functionName不加_，导致函数不执行**）

```
btn.addEventListener('click', () => {
    let script = document.createElement('script');
    let functionName ='_'+parseInt(Math.random() * 10000000, 10);//变量定义注意首字符
    window[functionName] = function () {
        amount.innerText = parseInt(amount.innerText, 10) - 1
    }
    script.src = 'http://sjh.com:8002/pay?callback=' + functionName;//跨域
    document.body.appendChild(script);
    script.onload = (e) => {
        e.currentTarget.remove();
        delete window[functionName]
    }
    script.onerror = (e) => {
        e.currentTarget.remove();
        delete window[functionName]
    }
    
})
```

响应方code(Node js实现)：

```
if(path === '/pay'){
    let newServerAmount = parseInt(fs.readFileSync('./db','utf-8'),10)-1;
    fs.writeFileSync('./db',newServerAmount)
    let callbackName = query.callback;
    res.setHeader('Content-Type', 'application/javascript')
    res.statusCode = 200
    res.write(`
    ${callbackName}.call(undefined,{
      "success":true,
      "left":${newServerAmount}
    })
    `);//callbackName,newServerAmount是变量,这一步非常关键，在页面执行callback回调
    res.end()
  }
```

### JSONP的约定

1. callbackName -> callback

2. xxx-> 随机数 xxx32132432()(functionName包含随机数)

3. jQuery的写法:

   ```
   btn.addEventListener('click', () => {
       $.ajax({
           url:'http://sjh.com:8002/pay',
           dataType:'jsonp',
           success:function(res,status){
               if(res.success === true){
                   amount.innerText = parseInt(amount.innerText,10)-1
               }
           }
       })
   })
   ```

### JSONP 是什么?

在 JSONP 的实现步骤中, 必须是 JSONP 格式, 它是从后端传给前端的数据(即前端需要的数据)

```
res.write(`${callbackName}.call(undefined,{
      "success":true,
      "left":${newServerAmount}
    })`);
```

而 P 则表示padding, 它表示 JSONP 的左右两边

JSONP === `_134567890.call(undefined, "返回数据")`

其中_134567890 是 sjh.com 后端根据 oylx.com 的查询参数产生的

`返回数据`则是 sjh.com 后端传给oylx.com 前端的 JSON 数据

## img造GET请求

注意代码细节:

- document.createElement('img') 创建img图片 get请求  
- 缺少res.write(fs.readFileSync('./l1.png'))img返回请求才能onload
- 只有上面写入图片，不返回statusCode=200 img图片是破裂状态

code实现：

```
btn.addEventListener('click', () => {
    let img = document.createElement('img')
    img.src = '/pay'
    img.onload = function () {
        alert('success')
        amount.innerText = parseInt(amount.innerText,10)-1
    }
    img.onerror = function () {
        alert('error')
    }
})
```

## script造 GET 请求

SRJ - Server Rendered JavaScript

注意代码细节：

- script必须插在body内

code实现：

```
btn.addEventListener('click',()=>{
    let script = document.createElement('script');
    document.body.appendChild(script);
    script.onload = (e)=>{
        alert('success')
        amount.innerText = parseInt(amount.innerText,10)-1
        e.currentTarget.remove();
    }
    script.onerror = (e)=>{
        alert('error')
        e.currentTarget.remove();
    }
})
```

### form POST请求,iframe实现局部刷新 

请求方code实现：

```
<form action="/pay" method="post" target="result">
	<input type="text" name="number" value="1">
	<input type="submit" value="付款">
</form>
<iframe src="about:blank" name="result" frameborder="0"></iframe>
```

响应方code实现：

```
  if(path === '/pay' && method.toUpperCase() ==='POST'){
    var serverAmount = fs.readFileSync('./db','utf8')-1;
    if(Math.random()>0.5){
      fs.writeFileSync('./db',serverAmount);
      res.write('success');
      res.end()
    }else{
      res.write('error');
      res.end()
    }
  }
```