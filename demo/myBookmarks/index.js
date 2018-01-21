"use strict";

// 初始化init
function init() {
    var keys = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];
    var hash = {
        'q': 'qq.com',
        'w': 'weibo.com',
        'e': 'ele.me',
        'r': 'renren.com',
        't': 'tianya.com',
        'y': 'youtube.com',
        'u': 'uc.com',
        'i': 'iqiyi.com',
        'o': 'opera.com',
        'p': undefined,
        'a': 'acfun.tv',
        's': 'sohu.com',
        'z': 'zhihu.com',
        'm': 'www.mcdonalds.com.cn'
    };
    var hashInLocalStorage = JSON.parse(localStorage.getItem('wrapper') || 'null');
    hashInLocalStorage ? hash = hashInLocalStorage : null;
    return{
        "keys":keys,
        "hash":hash
    }
}

function tag(tagName){
    return document.createElement(tagName)
}
function createSpan(textContent){
    var span = tag('span');
    span.textContent = textContent;
    return span;
}
function createButton(id){
    var btn = tag('button');
    btn.id = id;
    btn.textContent = 'E';
    btn.onclick = function (ele) {
        var x = prompt('请给我一个网址');
        hash[ele.target.id] = x;
        localStorage.setItem('wrapper', JSON.stringify(hash));
        var img2 = ele.target.nextSibling;
        img2.src = '//' + x + '/favicon.ico';
        img2.onerror = function (ele) {
            ele.target.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png'
        }
    }
    return btn;

}
function createImage(domain){
    var img = tag('img');
    img.src = '//' + domain + '/favicon.ico';
    img.onerror = function (ele) {
        ele.target.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png'
    }
    return img;
}
//生成keybord
function generateKeyboard(keys, hash) {
    var main = document.getElementById('main');
    for (var i = 0, l = keys.length; i < l; i++) {
        var innerKeys = keys[i];
        var div = tag('div');
        for (var j = 0, innnerL = innerKeys.length; j < innnerL; j++) {
            var kbd = tag('kbd');
            var span = createSpan(innerKeys[j]);
            var btn = createButton(innerKeys[j]);
            var img = createImage(hash[innerKeys[j]]);

            kbd.appendChild(span);
            kbd.appendChild(btn);
            kbd.appendChild(img);
            div.appendChild(kbd);


        }
        main.appendChild(div);
    }
}

function listenToUser(hash) {
    document.onkeypress = function (ele) {
        // location.href = 'http://'+ hash[ele.key];
        window.open('//' + hash[ele.key], '_blank');
        // console.log('http://'+ hash[ele.key]);
    }
}


var hashA = init();
var keys = hashA['keys'];
var hash = hashA['hash'];
generateKeyboard(keys, hash);
listenToUser(hash);