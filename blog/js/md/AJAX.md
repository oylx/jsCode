## 简要理解 AJAX

1. AJAX 就是用 JS set 请求和get 响应
2. 你才返回对象，你全家都返回对象("你"指的是**响应内容的第四部分**):响应的第四部分是字符串，可以用 JSON 语法表示一个对象，也可以用 JSON 语法表示一个数组，还可以用 XML 语法，还可以用 HTML 语法，还可以用 CSS 语法，还可以用 JS 语法，还可以用我自创的语法

## 如何发请求？

用 form 可以发请求，但是会刷新页面或新开页面
用 a 可以发 get 请求，但是也会刷新页面或新开页面
用 img 可以发 get 请求，但是只能以图片的形式展示
用 link 可以发 get 请求，但是只能以 CSS、favicon 的形式展示
用 script 可以发 get 请求，但是只能以脚本的形式运行

有没有什么方式可以实现

1. get、post、put、delete 请求都行
2. 想以什么形式展示就以什么形式展示

## 微软的突破

IE 5 率先在 JS 中引入 ActiveX 对象（API），使得 JS 可以直接发起 HTTP 请求。
随后 Mozilla、 Safari、 Opera 也跟进（抄袭）了，取名 XMLHttpRequest，并被纳入 W3C 规范

## AJAX

Jesse James Garrett 讲如下技术取名叫做 AJAX：异步的 JavaScript 和 XML

1. 使用 XMLHttpRequest 发请求
2. 服务器返回 XML 格式的字符串
3. JS 解析 XML，并更新局部页面

## AJAX demo

https://github.com/oylx/jsCode/tree/master/tempCode/js/35.jqueryAJAX

**AJAX 就是在 chrome 通过 XMLHttpRequest 对象, 构造（set）HTTP 请求和获取（get）HTTP 响应的技术**

那么 AJAX 的具体实现方法是怎么样的呢？

1. JS 设置（set）任意请求 header 请求内容第一部分 request.open('get', '/xxx') 请求内容第二部分 request.setRequestHeader('content-type','x-www-form-urlencoded') 请求内容第四部分 request.send('a=1&b=2')
2. JS 获取（get）任意响应 header 响应内容第一部分 request.status / request.statusText 响应内容第二部分 request.getResponseHeader() / request.getAllResponseHeaders() 响应内容第四部分 request.responseText

## 复习 window.jQuery 

```
window.jQuery = function(node){
    let nodes = {
        0: node,
        length: 1
    }
    nodes.addClass = function(){}
    nodes.siblings = function(){}
    return nodes
}
```

## window.jQuery.ajax

```
window.jQuery = function () {
    let nodes = {}
    nodes.addClass = function () { }
    nodes.html = function () { }
    return nodes;
}
window.$ = window.jQuery
window.jQuery.ajax = function (options) {
	var method = options.method
    var path = options.path
    var header = options.header
    var successFn = options.successFnAA
    var failFn = options.failFnAA
    var body = options.body
    //相当于告诉浏览器我要set Http 请求了
    let request = new XMLHttpRequest()
    //对应 http 请求的第一部分
    request.open(method, url)
    //对应 http 请求的第二部分
    for(var key in headers){
        request.setRequestHeader(key,headers[key])
    }
    //对应 http 请求的第三部分，仅仅是为了便于记忆
    request.onreadystatechange = () => {
        if(request.readyState === 4){
            if (request.status >= 200 && request.status < 300) {
                successFn.call(undefined, JSON.parse(request.responseText))
            } else if (request.status >= 400) {
                failFn.call(undefined, request)
            }
        }
    }
    //对应 http 请求的第四部分
    request.send(body)
}
function f1(responseText){console.dir(responseText)}
function f2(responseText){console.dir(responseText)}

btn.addEventListener('click', (e) => {
    $.ajax({
        url:'/oylx', 
        method:'POST', 
        body:'name=oylx&age=27', 
        successFn:(res) => { 
            f1.call(undefined,res)
            f2.call(undefined,res)
        }, 
        failFn:(res) => { console.log(res) },
        headers:{
            'content-Type':'application/x-www-form-urlencoded',
            'oylx':'27'
        }
    })
})
```

## ES6 析构赋值

优化前code：

```
var method = options.method
var path = options.path
var header = options.header
var successFn = options.successFn
var failFn = options.failFn
var body = options.body
```

ES6形式

```
let {method, path, header, successFn, failFn, body} = options
```

优化后code：

```
window.jQuery.ajax = function ({ url, method, body, successFn, failFn, headers }) {...}
```

## 使用 promise

关键：**return new Promise(function(resolve, reject){})**

```
let btn = document.querySelector('#btn')
window.jQuery = () => {
    let nodes = {}
    nodes.addClass = () => { }
    return nodes
}
window.$ = window.jQuery//注意注意注意注意这一行不要写错^_^

window.jQuery.ajax = ({ url, method, body, headers }) => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open(method,url)
        request.onreadystatechange = ()=>{
            if(request.readyState ===4){
                if(request.status >=200 && request.status<300){
                    resolve.call(undefined,request.responseText)
                }else if(request.status>=400){
                    reject.call(undefined,request)
                }
            }
        }
        request.send(body)
    })
}

btn.addEventListener('click', (e) => {
    $.ajax({
        url:'/oyl1x',
        method:'POST',
        body:'name=oylx&age=27',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'oylx':'NB'
        }
    }).then(
        (res)=>{console.log(res)},
        (req)=>{console.log(req)}
    )

})
```

## 同源策略

只有 协议+端口+域名 一模一样才允许发 AJAX 请求

一模一样一模一样一模一样一模一样一模一样一模一样一模一样一模一样

1. [http://baidu.com](http://baidu.com/) 可以向 [http://www.baidu.com](http://www.baidu.com/) 发 AJAX 请求吗 no
2. [http://baidu.com:80](http://baidu.com/) 可以向 [http://baidu.com:81](http://baidu.com:81/) 发 AJAX 请求吗 no

浏览器必须保证 只有 协议+端口+域名 一模一样才允许发 AJAX 请求 CORS 可以告诉浏览器，我俩一家的，别阻止他

突破同源策略 === 跨域

Cross-Origin Resource Sharing C O 资源R S

## CORS 跨域

> A网站的前端程序员打电话告诉B网站的后端程序员
>
> A前: 我想和你的网站进行交互, 你同意吗?
>
> B后: 我同意

然后**B后端后台**代码(响应内容)写上这一句代码:(**注意注意注意注意是在B的后台写上允许A前端请求**)

`response.setHeader("Access-Control-Allow-Origin", "http://A.com:8001")`

这就是 CORS 跨域