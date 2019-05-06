"use strict";
let array1 =['a','b','c'],array2=['d','e','f'];
//1.基本用法
// push pop unshift shift（改变原有数组）
// slice 截取数组（不改变原有，前闭后开，无参为整个数组） 
// splice 拼接数组（改变原有数组） 
// toString() 方法返回一个表示该对象的字符串
// join 将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串
// Array.from() 方法从一个类似数组或可迭代对象中创建一个新的数组实例
// Array.indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1
// includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false
// find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
// findIndex
// some() 方法测试是否至少有一个元素通过由提供的函数实现的测试。
// map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
// reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
// Object等同于new Object()
// in如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。(数组类型也可以使用)
// void 0   等于undefined

// >>>0 作用:1.所有非数值转换成0 2.所有大于等于 0 等数取整数部分
//'string' >>> 0 null undefined [] {}  function a (){}都为0    
// -1212 >>> 0  4294966084
// 45.2 >>> 0   45

//2.拼接数组
// array1.push(...array2)
// [].push.apply(array1,array2)
// array1=array1.concat(array2);
// console.log(array1)

//3.arguments转为数组
// let args=[].slice.call(arguments);

//4.new Array(num)
//生成num-1个数组

//5.join连接字符串
let array =['a','b','c'];
function repeat(str,num){
    return new Array(num+1).join(str)
}
let x = repeat('abc',4);

// 6.arguments转参数
function max(){
    let args=[].slice.call(arguments);//[].slice === [].__proto__.slice ===Array.prototype.slice
    // return Math.max(...arguments)
    // return Math.max.apply(null,arguments)//apply调用前面的方法,用另一个对象,传入参数为[],此处为arguments(伪数组)
}
max(1,2,34)

//7.判断arguments是不是数组，不是数组，是伪数组，object类型
// console.log(Array.isArray(arguments))//最常用
// console.log(arguments instanceof Array)
// console.log(Object.prototype.toString.call(array1) === '[object Array]')//call调用前面的方法，用另一个对象，传入对象为参数
// console.log({}.toString.call(array1) === '[object Array]')//1.call调用前面的方法，用另一个对象，传入对象为参数


//8.删除数组某元素
let array3 = [1,2,3,4];
function _delete(ary,num){
    ary.includes(num)?ary.splice(ary.indexOf(num),1):null
}
_delete(array3,-3)

let array4 =[{name:'oy'},{name:'sjh'}];
// let index = array4.indexOf({name:'oy'})//-1引用类型索引值不同
// let index = array4.find(val=>{
//     return val.name==='oy'
// })
// let index = array4.findIndex(val=>{
//     return val.name==='oy'
// })
// console.log(index)

// Array.prototype._find =function(cb){
//     return cb.call()
// }
// let index = array4._find(val=>{
//     return val.name==='oy'
// })
// console.log(index)

let array5 =['name','age','sex'];
function validate(person){
    // return array5.some(val=>{
    //     return person.hasOwnProperty(val)
    // })
    return array5.some(Object.prototype.hasOwnProperty,person)
}
console.log(validate({name:'oy',age:'12'}))
console.log(validate({na:'oy',ag:'12'}))

let array6 = [20,30,40];
// let result = array6.some((val)=>{
//     return val>3
// })
// array6.forEach((val,index,arr)=>{
//     arr[index]+=5;
// })
// let map1 = array6.map(val=>val+5)
// console.log(array6)
// console.log(map1)
// let result =array6.reduce((prev,next)=>{
//     return prev+next
// })
// console.log(result)
// for(let val of array6){
//     console.log(val)
// }

// let array7 = ['a','b','c'];
// console.log(typeof Symbol.iterator)
// let iterator = array7[Symbol.iterator]();
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())


Array.prototype._find=function(callback){
    //关键this是什么 ._find前的数组
    if(this==null){
        throw new TypeError('this is null')
    }
    if(typeof callback !=='function'){
        throw new TypeError('callback is not function')
    }
    var oldArr = Object(this);
    var len = oldArr.length,
        i = 0,
        //thisArg也要考虑
        //void 0
        thisArg = arguments.length>=2?arguments[1]:void 0;
        while(i<len){
            if(i in oldArr){
                var val = oldArr[i];
                if(callback.call(thisArg,val,i,oldArr)){
                    return val
                }
            }
        }
    return undefined
}
let array8=[10,2,3,4];
let result =array8._find(function(val){
    return val>0
})
console.log(result);

Array.prototype._map=function(callback){
    if(typeof this == null){
        throw new TypeError('this is null')
    }
    if(typeof callback!=='function'){
        throw new TypeError('callback is not a function')
    }
    var oldArr = new Object(this),
        len = oldArr.length >>> 0,
        thisArg = arguments.length>=2?arguments[1]:void 0,
        i =0,
        newArr=[];
        console.log(Array.isArray(oldArr))
    while(i<len){
        if(i in oldArr){
            var val = oldArr[i];
            newArr[i] = callback.call(thisArg,val,i,oldArr)
        }
        i++
    }
    return newArr
}
let array9=array8._map((val)=>{return val+1})
console.log(array9)