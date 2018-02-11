!function () {

    let model = {
        init: function () {
            var APP_ID = 'MPdVob3eDCDDPi0m6LcYvkEr-gzGzoHsz';
            var APP_KEY = 'FTInetMAy7Xq9mJ94ipTLP2k';
            AV.init({
                appId: APP_ID,
                appKey: APP_KEY
            });
        },
        fetch: function(){
            let query = new AV.Query('Message')
            return query.find()//promise对象
        },
        save: function(name,content){
            var Message = AV.Object.extend('Message');
            var message = new Message();
            // return message
            return message.save({  // Promise 对象
                'name': name,
                'content': content
              })
        }
    }
    let view = document.querySelector('section.message')
    let controller = {
        view: null,
        model: null,
        messageList: null,
        form:null,
        init:function(view,model){
            this.view = view
            this.model = model
            this.messageList = this.view.querySelector('#messageList')
            this.form = this.view.querySelector('#postMessageForm')
            this.model.init()
            this.loadMessages()
            this.bindEvents()
        },
        loadMessages:function(){
            let myMessageList = this.messageList
            this.model.fetch().then(function (messages) {
                let array = messages.map(element => {
                    return element.attributes
                });
                array.forEach(element => {
                    let li = document.createElement('li')
                    li.innerText = `${element.name}:${element.content}`
                    // this.messageList.appendChild(li)
                    myMessageList.appendChild(li)
                });
                //fetch成功进去1
            }, function (error) {
                console.log(error)  //fetch失败进入2
            }).then(function (resolve) { 
                console.log(resolve) //1失败进入3
            }, function (error) { 
                console.log(error) //1&2都失败进入4
            });
        },
        saveMessage:function(){
            let myForm = this.form
            let name = this.form.querySelector('input[name=name]').value
            let content = this.form.querySelector('input[name=content]').value
            if (!content && !name) {
                alert('请输入内容')
                return
            } 
            this.model.save(name,content).then(function (object) {
                let li = document.createElement('li')
                li.innerText = `${name}:${content}`
                this.messageList.appendChild(li)
                // this回调作用域是window
                console.log(1)
                myForm.querySelector('input[name=name]').value = ''
                myForm.querySelector('input[name=content]').value=''
                // this.form.querySelector('input[name=name]').value = ''
                // this.form.querySelector('input[name=content]').value=''
                console.log(2)
            }).then(function () {

            })
        },
        bindEvents:function(){
            // this.form.addEventListener('submit', function (e) {
            //     e.preventDefault()
            //     this.saveMessage()
            // })this作用域改变了，为被点击的form
            this.form.addEventListener('submit', e=> {
                e.preventDefault()
                this.saveMessage()
            })
        }
    }
    controller.init(view,model)// controller.init.call(controller,view.model)
}.call()