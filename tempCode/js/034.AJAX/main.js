let btn = document.querySelector('#btn')
btn.addEventListener('click',()=>{
    var req = new XMLHttpRequest
    req.open('POST','http://sjh.com:8002/oylx')
    req.send()
    req.onreadystatechange = ()=>{
        if(req.readyState === 4){
            if(req.status >= 200 && req.status<300){
                console.log(JSON.parse(req.responseText))
            }else if(req.status>=400){
                console.log('failed')
            }
        }
    }
    

})