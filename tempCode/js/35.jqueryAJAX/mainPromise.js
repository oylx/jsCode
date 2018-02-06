let btn = document.querySelector('#btn')
window.jQuery = () => {
    let nodes = {}
    nodes.addClass = () => { }
    return nodes
}
window.$ = window.jQuery

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



