!function () {
    var model = Model({ resourceName: 'Message' })
    var view = View('section.message')
    var controller = Controller({
        init: function (view, controller) {
            this.messageList = view.querySelector('#messageList')
            this.form = view.querySelector('form')
            this.loadMessages()
        },
        loadMessages: function () {
            this.model.fetch().then(
                (messages) => {
                    let array = messages.map(element => {
                        return element.attributes
                    });
                    array.forEach(element => {
                        let li = document.createElement('li')
                        li.innerText = `${element.name}:${element.content}`
                        this.messageList.appendChild(li)
                        // myMessageList.appendChild(li)
                    });
                    //fetch成功进去1
                });
        },
        saveMessage: function () {
            let myForm = this.form
            let name = this.form.querySelector('input[name=name]').value
            let content = this.form.querySelector('input[name=content]').value
            if (!content && !name) {
                alert('请输入内容')
                return
            }
            this.model.save({ 'name': name, 'content': content }).then(function (object) {
                let li = document.createElement('li')
                li.innerText = `${name}:${content}`
                this.messageList.appendChild(li)
                // this回调作用域是window
                console.log(1)
                myForm.querySelector('input[name=name]').value = ''
                myForm.querySelector('input[name=content]').value = ''
                // this.form.querySelector('input[name=name]').value = ''
                // this.form.querySelector('input[name=content]').value=''
                console.log(2)
            }).then(function () {

            })
        },
        bindEvents: function () {
            // this.form.addEventListener('submit', function (e) {
            //     e.preventDefault()
            //     this.saveMessage()
            // })this作用域改变了，为被点击的form
            this.form.addEventListener('submit', e => {
                e.preventDefault()
                this.saveMessage()
            })
        }
    })
    controller.init(view, model)
}.call()