let btn = document.querySelector('#btn')
window.jQuery = function () {
    let nodes = {}
    nodes.addClass = function () { }
    nodes.html = function () { }
    return nodes;
}
window.$ = window.jQuery
window.jQuery.ajax = function ({ url, method, body, successFn, failFn, headers }) {

    let request = new XMLHttpRequest()
    request.open(method, url)
    for(var key in headers){
        request.setRequestHeader(key,headers[key])
    }
    request.onreadystatechange = () => {
        if(request.readyState === 4){
            if (request.status >= 200 && request.status < 300) {
                successFn.call(undefined, JSON.parse(request.responseText))
            } else if (request.status >= 400) {
                failFn.call(undefined, request)
            }
        }
    }
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