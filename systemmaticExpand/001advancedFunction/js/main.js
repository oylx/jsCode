function print(a) {
    console.log(a)
}
print('hello')

function max() {
    // let max = 0
    // for(var i=0;i<arguments.length;i++){

    //     if(arguments[i]>max){
    //         max = arguments[i]
    //     }
    // }
    // console.log(max)

    // let array = Array.prototype.slice.apply(arguments)
    // console.log(Math.max(array))

    console.log(Math.max.apply(null, arguments))

    // Math.max(1,2,3)
    // Math.max.call(null,1,2,3)
    // Math.max.apply(null,[1,2,3]) //this=>null
    // console.log(Math.max.apply('abc',[1,2,3])) //this=>'abc'

}

max(15, 2, 3, 4, 5)


//不能接受数组  用apply
// call apply 的用法区分：call(a,b,c)   apply数组[a,b,c]

// 摊平数组 arr1.push(arr2)=>[1,2,[3,4]]    arr.push(3,4,5)
var arr1 = [1, 2];
var arr2 = [3, 4];
[].push.apply(arr1, arr2);//this=>arr1
// arr1.push.apply(null,arr2)//this=>null 报错
console.log(arr1)


//bind 1.改变上下文2.函数珂理化，使用传入参数，返回函数
// setTimeout(function(){
//     console.log(1)
// },500)//setTimeout第一个参数刚好是一个匿名函数

// setTimeout(console.log.bind(null,1),500)


function fn_bind(a,b,c) {
    console.log(this.d +a+b+c)
}

// Function.prototype._bind = function (obj) {
//     // this+apply/call实现bind
//     // var bindObj = this
//     // var $this;
//     // if(arguments.length<=1){
//     //     $this = window
//     //     return function(){
//     //         bindObj.apply($this)
//     //     }
//     // }else{
//     //     $this = [].slice.call(arguments,0,1);
//     //     console.dir(bindObj)
//     //     return function(){
//     //         return bindObj.apply($this,[].slice.call(arguments,1))
//     //     }
//     // }

//     var bindObj = this
//     return function () {
//         return bindObj.apply(obj, [].slice.call(arguments))
//     }

// }

// Function.prototype._bind = function(){
//     var $this = this;
//     var arg1 = arguments[0]
//     var arg2s = Array.prototype.slice.call(arguments,1)
//     console.log(arg1,arg2s)
//     console.log($this)
//     return function(){
//         $this.apply(arg1,arg2s)
//     }
// }

Function.prototype._bind = function(obj){
    var $this = this;
    var args = Array.prototype.slice.call(arguments,1)
    
    console.log('args')
    console.log(args)
    return function(){
        var arg2s = Array.prototype.slice.call(arguments)
        console.log('arg2s')
        console.log(arg2s)
        var arg3s = args.concat(arg2s)
        console.log('arg3s')
        console.log(arg3s)
        return $this.apply(obj,arg3s)
    }
}

var curryFn = fn_bind._bind({d:1}, 2,3,4)


curryFn()


function Person(name){
    this.name = name
}
Person.prototype.sayHi = function(){
    console.log(`hi,i am ${this.name}`)
}
// let mike = new Person('michale1')
// mike.sayHi()


function _new(){
    var obj = {}
    obj.__proto__ = arguments[0].prototype
    arguments[0].call(obj,arguments[1])
    return obj
}
var mike1 = _new(Person,'michale2')
console.dir(mike1)
mike1.sayHi()