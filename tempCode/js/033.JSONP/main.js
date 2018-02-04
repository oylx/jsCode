let amount = document.querySelector('#amount')
let btn = document.querySelector('#btn');

//  img造 get 请求
//  document.createElement('img') 创建img图片 get请求  
//  缺少res.write(fs.readFileSync('./l1.png'))img返回请求才能onload
//  只有上面写入图片，不返回statusCode=200 img图片是破裂状态

// btn.addEventListener('click', () => {
//     let img = document.createElement('img')
//     img.src = '/pay'
//     img.onload = function () {
//         alert('success')
//         amount.innerText = parseInt(amount.innerText,10)-1
//     }
//     img.onerror = function () {
//         alert('error')
//     }
// })

// SRJ - Server Rendered JavaScript
//script造 get 请求
//script必须插在body内
// btn.addEventListener('click',()=>{
//     let script = document.createElement('script');
//     document.body.appendChild(script);
//     script.onload = (e)=>{
//         alert('success')
//         amount.innerText = parseInt(amount.innerText,10)-1
//         e.currentTarget.remove();
//     }
//     script.onerror = (e)=>{
//         alert('error')
//         e.currentTarget.remove();
//     }
// })


//自己实现JSONP
//变量名：第一个字符是字母/下划线/$，第二个字母可以加入数字
// btn.addEventListener('click', () => {
//     let script = document.createElement('script');
//     let functionName ='_'+parseInt(Math.random() * 10000000, 10);
//     window[functionName] = function () {
//         amount.innerText = parseInt(amount.innerText, 10) - 1
//     }
//     script.src = 'http://jack.com:8002/pay?callback=' + functionName;
//     document.body.appendChild(script);
//     script.onload = (e) => {
//         e.currentTarget.remove();
//         delete window[functionName]
//     }
//     script.onerror = (e) => {
//         e.currentTarget.remove();
//         delete window[functionName]
//     }
    
// })

btn.addEventListener('click', () => {
    $.ajax({
        url:'http://jack.com:8002/pay',
        dataType:'jsonp',
        success:function(res,status){
            if(res.success === true){
                amount.innerText = parseInt(amount.innerText,10)-1
            }
        }
    })
})


// btn.addEventListener('click', (e)=>{
//     let script = document.createElement('script')
//     let functionName = 'frank'+ parseInt(Math.random()*10000000 ,10)
//     window[functionName] = function(){  // 每次请求之前搞出一个随机的函数
//         amount.innerText = amount.innerText - 0 - 1
//     }
//     script.src = '/pay?callback=' + functionName
//     document.body.appendChild(script)
//     script.onload = function(e){ // 状态码是 200~299 则表示成功
//         e.currentTarget.remove()
//         delete window[functionName] // 请求完了就干掉这个随机函数
//     }
//     script.onload = function(e){ // 状态码大于等于 400 则表示失败
//         e.currentTarget.remove()
//         delete window[functionName] // 请求完了就干掉这个随机函数
//     }
// })











// window.location.reload;//刷新当前页面
//string = string.replace('&&&amount&&&',serverAmount);//replace返回新的字符串