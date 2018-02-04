let amount = document.querySelector('#amount')
let btn = document.querySelector('#btn');
//自己实现JSONP

btn.addEventListener('click', () => {
    let script = document.createElement('script');
    let functionName ='_'+parseInt(Math.random() * 10000000, 10);
    window[functionName] = function () {
        amount.innerText = parseInt(amount.innerText, 10) - 1
    }
    script.src = 'http://jack.com:8002/pay?callback=' + functionName;
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