//用document.getElementById无法使用classList
var siteWelcome = document.querySelector('#siteWelcome'),topNavBar = document.querySelector('#topNavBar');
setTimeout(function () {
    siteWelcome.classList.remove('active')
},1000)

window.onscroll = function () {
    if(window.scrollY > 0){
        topNavBar.classList.add('sticky');
    }else{
        topNavBar.classList.remove('sticky');
    }
    findClosest()
}

// 添加 offset 类
let specialTags = document.querySelectorAll('[data-x]')
for(let i =0;i<specialTags.length; i++){
    specialTags[i].classList.add('offset')
}
function findClosest(){
    let specialTags = document.querySelectorAll('[data-x]')
    let minIndex = 0
    for(let i =1;i<specialTags.length; i++){
        if(Math.abs(specialTags[i].offsetTop - window.scrollY) < Math.abs(specialTags[minIndex].offsetTop - window.scrollY)){
            minIndex = i
        }
    }
    // minIndex 就是里窗口顶部最近的元素
    specialTags[minIndex].classList.remove('offset')
    let id = specialTags[minIndex].id
    let a = document.querySelector('a[href="#'+ id + '"]')
    let li = a.parentNode
    let brothersAndMe = li.parentNode.children
    for(let i=0; i<brothersAndMe.length; i++){
        brothersAndMe[i].classList.remove('highlight')
    }
    li.classList.add('highlight')
}

findClosest()
let liTags = document.querySelectorAll('nav.menu > ul > li')
//除mouseenter mouseleave不冒泡，其他鼠标事件都冒泡
for(let i=0; i<liTags.length; i++){
    liTags[i].onmouseenter = function (event) {
        event.currentTarget.classList.add('active');
    }
    liTags[i].onmouseleave = function (event) {
        event.currentTarget.classList.remove('active');
    }
}
let aTags = document.querySelectorAll('nav.menu > ul > li > a')
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);
for(let i=0; i<aTags.length; i++){
    aTags[i].onclick = function(x){

        event.preventDefault();//阻止默认的a链接锚点跳转,不信去掉试试
        var a = event.currentTarget;//event.currentTarget指向事件所绑定的元素，而event.target始终指向事件发生时的元素
        var href = a.getAttribute('href');// a.href = 'http://localhost:8080/resume/index.html?_ijt=r6gq151b4skb6ts8p5fbe0ermi#siteSkills'
        if(href === "#") return;
        var dest = document.querySelector(href);
        let top = dest.offsetTop;//此时相距body为dest.offsetTop
        // window.scrollTo(0,top-80)//scrollTo(xpos,ypos)window需要被卷去top-80的高度,避免被topNavBar(高度80)遮挡

        let currentTop = window.scrollY
        let targetTop = top - 80
        let s = targetTop - currentTop // 路程
        var coords = { y: currentTop}; // 起始位置
        var t = Math.abs((s/100)*300) // 时间
        if(t>500){ t = 500 }
        var tween = new TWEEN.Tween(coords) // 起始位置
            .to({ y: targetTop}, t) // 结束位置 和 时间
            .easing(TWEEN.Easing.Back.Out) // 缓动类型
            .onUpdate(function() {
                // coords.y 已经变了
                window.scrollTo(0,coords.y) // 如何更新界面
            })
            .start(); // 开始缓动
    }
}