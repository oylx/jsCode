## 总结

- 一个函数，只要被 async 关键字包装过，就会返回一个 promise，如果该函数有返回值，那么这个返回值就会作为 then 处理的 response ，如果没有返回值，那么 then 就处理 undefined
- await 表达式，只能用在被 async 包装过的函数里，否则会报错
- await 表达式后接的函数返回值，类型可以为 promise，或者其他任何的值，await 后的代码在当前执行环境下，会被阻塞至拿到该函数调用后的结果，等拿到结果后，会将 await 后面的代码继续包装成新的 promise，并将之前拿到的结果作为 response 传入其中，同时让出线程控权
- async/await 本质上是 Generator 的语法糖

### async作用

输出promise对象

```$xslt
async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);
```
### await作用-必须放在async函数中

await等待一个任意表达式的结果，可以是promise对象或其他值，一般是等待一个async函数完成的返回值

### await等到了promise

如果等到了一个promise，await则会阻塞后面的代码，等待resolve后面的值，作为await表达式的运算结果。所以需要放在async函数中

### async/await优势

在于处理then链，清晰可维护