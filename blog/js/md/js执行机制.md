###JS为什么是单线程的? 
```$xslt
场景描述:

那么现在有2个线程,process1 process2,由于是多线程的JS,所以他们对同一个dom,同时进行操作

process1 删除了该dom,而process2 编辑了该dom,同时下达2个矛盾的命令,浏览器究竟该如何执行呢?
```
###为什么需要异步? 
```$xslt
场景描述:

如果JS中不存在异步,只能自上而下执行,如果上一行解析时间很长,那么下面的代码就会被阻塞。
对于用户而言,阻塞就意味着"卡死",这样就导致了很差的用户体验
```
###单线程又是如何实现异步的呢?
```$xslt
是通过的事件循环(event loop),理解了event loop机制,就理解了JS的执行机制
```
###任务分类
macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
micro-task(微任务)：Promise，process.nextTick
![](./../image/eventLoop.png)

按照这种分类方式:JS的执行机制是

- 执行一个宏任务,过程中如果遇到微任务,就将其放到微任务的【事件队列】里
- 当前宏任务执行完成后,会查看微任务的【事件队列】,并将里面全部的微任务依次执行完
- 重复以上2步骤,结合event loop(1) event loop(2) ,就是更为准确的JS执行机制了。

```$xslt
// 请给出下面这段代码执行后，log 的打印顺序
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')

```

- JavaScript 解析引擎在脚本开头碰到了 console.log 于是打印 script strt
- 解析引擎解析至 async1() ，async1 执行环境被推入执行栈，解析引擎进入 async1 内部
- 引擎发现 async1 内部调用了 async2，于是继续进入 async 2，并将 async 2 执行环境推入执行栈
- 引擎碰到 console.log，于是打印 async2 end
- async2 函数执行完成，返回了一个 Promise.resolve(undefined)，此时，该回调被推入 microtask ，async1 函数中的执行权被让出，等待主线程空闲
- 引擎解析至 setTimeout，等待 0ms 后将其回调推入 macrotask，执行权继续让出
- 引擎指针继续下移，直到碰到了 Promise，解析进入注入函数的内部，碰到 console.log，于是打印 Promise，再往下，碰到了 resolve，此时，该回调被推入 microtask ，执行权被让出
- 引擎继续往下，碰到 console.log，打印完 script end
- 至此，主线程空闲，Event Loop 事件循环启动，开始从 microtask 里拿出 promise 回调，放入主线程执行，首先拿出最早注入的 async2 的 Promise.resolve(undefined)执行，此时 await 操作符解析该表达式，得到结果 undefined，并将 async1 [Promise] 函数 标志为 resolve 状态，将 await 后面的代码作为回调，继续推入 microtask，等待执行，执行权被让出
- 此时主线程没有可执行的代码，再次空闲，Event Loop 启动，去 microtask 中拿到之前的 new Promise 回调，放入主线程执行，打印结果 promise1 和 promise2
- 主线程空闲，Event Loop 去 microtask 里拿 aysnc1 的回调，打印出 async1 end
- 最后，主线程空闲，microtask 队列空，Event Loop 去 macrotask 里拿到 setTimeout 的回调，放入主线程，打印最后的 setTimeout

