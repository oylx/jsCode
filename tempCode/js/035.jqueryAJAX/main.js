let btn = document.querySelector('#btn')
window.jQuery = function () {
    let nodes = {}
    nodes.addClass = function () { }
    nodes.html = function () { }
    return nodes;
}
window.$ = window.jQuery
window.jQuery.ajax = function ({ url, method, body, successFn, failFn, headers }) {
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





//箭头函数没有arguments
//callback === function