1.封装函数，命名空间

  

```
  window.newNode ={};//或者 var newNode ={};
  newNode.getSiblings = function(node){
    let allChildren = node.parentNode.children;
    let nodes = {
      length:0
    };
    for(let i =0;i<allChildren.length;i++){
      if(node !== allChildren[i]){
        nodes[nodes.length] = allChildren[i];//若用i计数，存在空档
        nodes.length ++;
      }
    }
    return nodes;
  }
  newNode.addClass = function(node,classes){
    classes.forEach((value) =>{
      node.classList.add(value)
    })
  }
  var node = newNode.getSiblings(li1);
  newNode.addClass(li1,['red','bold'])
```

2.封装函数，node 放在前面，参考jQuery习惯，node.getSiblings()，node.addClass()

​    2.1 扩展 Node 接口

```
Node.prototype.getSiblings = function () {
      let allChildren = this.parentNode.children;
      let nodes = {
        length: 0
      };
      for (let i = 0; i < allChildren.length; i++) {
        if (this !== allChildren[i]) {
          nodes[nodes.length] = allChildren[i];
          nodes.length++;
        }
      }
      return nodes;
    }

    Node.prototype.addClass = function (classes) {
      classes.forEach((value) => {
        this.classList.add(value)
      })
    }

    // var node = li1.getSiblings();
    var node = li1.getSiblings.call(li1);
    console.log(node);
    // li2.addClass(['red','bold']);
    li2.addClass.call(li3, ['red', 'bold']);
```

  2.2 新的接口 MyjQuery

​    改进一：改掉 document.getElementById;改进二：接受多个 node

```
function MyJquery(nodeOrSelector) {
      let nodes ={};//结构为object
      if(typeof nodeOrSelector === 'string'){
        let temp = document.querySelectorAll(nodeOrSelector);
        for(let i = 0;i<temp.length;i++){
          nodes[i] = temp[i];
        }

        nodes.length = temp.length;
        // nodes = document.querySelectorAll(nodeOrSelector);
      }else{
        nodes[0] = nodeOrSelector;
        nodes.length = 1;
      }

      nodes.addClass = function (classes){
        for(let i=0;i<this.length;i++){
          classes.forEach(element => {
            this[i].classList.add(element);
          });
        }
      }
      
      nodes.text = function(text){
        if(text === undefined){
          for(let i=0;i<this.length;i++){
            this[i].textContent = '';
          }

        }else{
          for(let i=0;i<this.length;i++){
            this[i].textContent = text;
          }
        }
      }
      return nodes
    }

    window.$ = MyJquery;
    var li = ('ul > li');
    var li1 = ('#li1');
    var li2 = (li2)//li2为id,直接写是node类型
    console.dir($li1)
    console.dir($li2)
    $li.addClass(['red','blue'])
    $li2.text('hi');
```

3.测试

```
 window.jQuery = function(nodeOrSelector){
      let nodes ={};//结构为
      if(typeof nodeOrSelector === 'string'){
        let temp = document.querySelectorAll(nodeOrSelector);
        for(let i = 0;i<temp.length;i++){
          nodes[i] = temp[i];
        }
        nodes.length = temp.length;
      }else{
        nodes[0] = nodeOrSelector;
        nodes.length = 1;
      }

      nodes.addClass = function (value){
        for(let i=0;i<this.length;i++){
          this[i].classList.add(value)
        }
      }

      nodes.setText = function(text){
        for(let i=0;i<this.length;i++){
          this[i].textContent = text;
        }
      }
      return nodes
  }

  window.$ = jQuery
  var div = ('div')
  $div.addClass('red') // 可将所有 div 的 class 添加一个 red
  $div.setText('hi') // 可将所有 div 的 textContent 变为 hi
```