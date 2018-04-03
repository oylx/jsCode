var APP_ID = 'MPdVob3eDCDDPi0m6LcYvkEr-gzGzoHsz';
var APP_KEY = 'FTInetMAy7Xq9mJ94ipTLP2k';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// //创建TestObject类
// var TestObject = AV.Object.extend('TestObject');
// //在表中创建一行数据
// var testObject = new TestObject();
// //数据内容是words: 'Hello World!'
// //如果保存成功，则运行alert
// testObject.save({
//   words: 'Hello World!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })
var view = document.querySelector('section.message')
var myForm = view.querySelector('#postMessageForm')
var content, name
myForm.addEventListener('submit', function (e) {
    e.preventDefault()
    content = myForm.querySelector('input[name=content]').value
    name = myForm.querySelector('input[name=name]').value
    if (!content && !name) {
        alert('请输入内容')
        return
    }
    controller.submitMessage(content, name)

})

//myForm submit事件等价于以下
// var submitBtn = myForm.querySelector('#submitBtn'),input = myForm.querySelector('input[name=content]')
// submitBtn.addEventListener('click',function(){

// })
// input.addEventListener('keypress',function(e){
//     if(e.keyCode===13){}
// })

var controller = {
    content: null,
    name: null,
    submitMessage: function (content, name) {
        this.content = content
        this.name = name
        var Message = AV.Object.extend('Message');
        var message = new Message();
        message.save({
            name: this.name,
            content: this.content
        }).then(function (object) {
            alert('success!');
            let li = document.createElement('li')
            li.innerText = `${name}:${content}`
            messageList.appendChild(li)
        }).then(function () {

        })
    }
}

let query = new AV.Query('Message'), messageList = view.querySelector('#messageList')
query.find().then(function (messages) {
    let array = messages.map(element => {
        return element.attributes
    });
    // let str = ``
    array.forEach(element => {
        let li = document.createElement('li')
        li.innerText = `${element.name}:${element.content}`
        messageList.appendChild(li)
        // str += `<li>${element.name}:${element.content}</li>`
    });
    // messageList.innerHTML = str
}, function (error) {
    // 异常处理
}).then(function (resolve) { console.log(resolve) }, function (error) { console.log(error) });
//form监听submit事件

// MVC 是什么？
// Model 操作数据
// View 表示视图
// Controller 是控制器

// Model 和服务器交互，Model 将得到的数据交给 Controller，Controller 把数据填入 View，并监听 View
// 用户操作 View，如点击按钮，Controller 就会接受到点击事件，Controller 这时会去调用 Model，Model 会与服务器交互，得到数据后返回给 Controller，Controller 得到数据就去更新 View