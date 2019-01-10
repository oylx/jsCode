"use strict";
let array1 =['a','b','c'],array2=['d','e','f'];
//1.基本用法
// push pop unshift shift（改变原有数组）
// slice 截取数组（不改变原有，前闭后开，无参为整个数组） 
// splice 拼接数组（改变原有数组） 
// toString() 方法返回一个表示该对象的字符串
// join 将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串
// Array.from() 方法从一个类似数组或可迭代对象中创建一个新的数组实例

//2.拼接数组
// array1.push(...array2)
// [].push.apply(array1,array2)
// array1=array1.concat(array2);
// console.log(array1)

//3.arguments转为数组
// let args=[].slice.call(arguments);

//4.join连接字符串
let array =['a','b','c'];
function repeat(str,num){
    return new Array(num+1).join(str)
}
let x = repeat('abc',4);
console.log(x)

function max(){
    let args=[].slice.call(arguments);//[].slice === [].__proto__.slice ===Array.prototype.slice
    // return Math.max(...arguments)
    // return Math.max.apply(null,arguments)//apply调用前面的方法,用另一个对象,传入参数为[],此处为arguments(伪数组)
}
max(1,2,34)

//判断arguments是不是数组，不是数组，是伪数组，object类型
// console.log(Array.isArray(arguments))//最常用
// console.log(arguments instanceof Array)
// console.log(Object.prototype.toString.call(array1) === '[object Array]')//call调用前面的方法，用另一个对象，传入对象为参数
// console.log({}.toString.call(array1) === '[object Array]')//1.call调用前面的方法，用另一个对象，传入对象为参数

