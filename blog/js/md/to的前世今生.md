# Generator 函数的含义与用法

> - **Generator函数的含义与用法**
> - [Thunk函数的含义与用法](http://www.ruanyifeng.com/blog/2015/05/thunk.html)
> - [co函数库的含义与用法](http://www.ruanyifeng.com/blog/2015/05/co.html)
> - [async函数的含义与用法](http://www.ruanyifeng.com/blog/2015/05/async.html)

异步编程对 JavaScript 语言太重要。JavaScript 只有一根线程，如果没有异步编程，根本没法用，非卡死不可。

以前，异步编程的方法，大概有[下面四种](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)。

> - 回调函数
> - 事件监听
> - 发布/订阅
> - Promise 对象

**这组系列文章的主题，就是介绍更强大、更完善的 ES6 异步编程方法。**

**异步编程的语法目标，就是怎样让它更像同步编程**。

## 一、什么是异步？

**不连续的执行，就叫做异步。**相应地，连续的执行，就叫做同步。

## 二、回调函数的概念

JavaScript 语言对异步编程的实现，就是回调函数。**所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。**

## 三、Promise

回调函数本身并没有问题，它的问题出现在多个回调函数嵌套。假定读取A文件之后，再读取B文件，代码如下。

> ```
> fs.readFile(fileA, function (err, data) {
>   fs.readFile(fileB, function (err, data) {
>     // ...
>   });
> });
> ```

如果依次读取多个文件，就会出现多重嵌套。这种情况就称为["回调函数噩梦"](http://callbackhell.com/)（callback hell）。

Promise就是为了解决这个问题而提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的横向加载，改成纵向加载。采用Promise，连续读取多个文件，写法如下。

> ```
> var readFile = require('fs-readfile-promise');
> 
> readFile(fileA)
> .then(function(data){
>   console.log(data.toString());
> })
> .then(function(){
>   return readFile(fileB);
> })
> .then(function(data){
>   console.log(data.toString());
> })
> .catch(function(err) {
>   console.log(err);
> });
> ```

Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

Promise 的最大问题是代码冗余，原来的任务被Promise 包装了一下，不管什么操作，一眼看去都是一堆 then，原来的语义变得很不清楚。

## 四、协程

传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做["协程"](https://en.wikipedia.org/wiki/Coroutine)（coroutine），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。

> 第一步，协程A开始执行。
>
> 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
>
> 第三步，（一段时间后）协程B交还执行权。
>
> 第四步，协程A恢复执行。

上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

举例来说，读取文件的协程写法如下。

> ```
> function asnycJob() {
>   // ...其他代码
>   var f = yield readFile(fileA);
>   // ...其他代码
> }
> ```

协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

## 五、Generator函数的概念

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

> ```
> function* gen(x){
>   var y = yield x + 2;
>   return y;
> }
> ```

上面代码就是一个 Generator 函数。它不同于普通函数，是可以暂停执行的，所以函数名之前要加星号，以示区别。

整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明。Generator 函数的执行方法如下。

> ```
> var g = gen(1);
> g.next() // { value: 3, done: false }
> g.next() // { value: undefined, done: true }
> ```

上面代码中，调用 Generator 函数，会返回一个内部指针（即[遍历器](http://es6.ruanyifeng.com/#docs/iterator) ）g 。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。调用指针 g 的 next 方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的 yield 语句，上例是执行到 x + 2 为止。

换言之，next 方法的作用是分阶段执行 Generator 函数。每次调用 next 方法，会返回一个对象，表示当前阶段的信息（ value 属性和 done 属性）。value 属性是 yield 语句后面表达式的值，表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。

## 六、Generator 函数的数据交换和错误处理

Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

next 方法返回值的 value 属性，是 Generator 函数向外输出数据；next 方法还可以接受参数，这是向 Generator 函数体内输入数据。

> ```
> function* gen(x){
>   var y = yield x + 2;
>   return y;
> }
> 
> var g = gen(1);
> g.next() // { value: 3, done: false }
> g.next(2) // { value: 2, done: true }
> ```

上面代码中，第一个 next 方法的 value 属性，返回表达式 x + 2 的值（3）。第二个 next 方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的变量 y 接收。因此，这一步的 value 属性，返回的就是2（变量 y 的值）。

Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。

> ```
> function* gen(x){
>   try {
>     var y = yield x + 2;
>   } catch (e){ 
>     console.log(e);
>   }
>   return y;
> }
> 
> var g = gen(1);
> g.next();
> g.throw（'出错了'）;
> // 出错了
> ```

上面代码的最后一行，Generator 函数体外，使用指针对象的 throw 方法抛出的错误，可以被函数体内的 try ... catch 代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

## 七、Generator 函数的用法

下面看看如何使用 Generator 函数，执行一个真实的异步任务。

> ```
> var fetch = require('node-fetch');
> 
> function* gen(){
>   var url = 'https://api.github.com/users/github';
>   var result = yield fetch(url);
>   console.log(result.bio);
> }
> ```

上面代码中，Generator 函数封装了一个异步操作，该操作先读取一个远程接口，然后从 JSON 格式的数据解析信息。就像前面说过的，这段代码非常像同步操作，除了加上了 yield 命令。

执行这段代码的方法如下。

> ```
> var g = gen();
> var result = g.next();
> 
> result.value.then(function(data){
>   return data.json();
> }).then(function(data){
>   g.next(data);
> });
> ```

上面代码中，首先执行 Generator 函数，获取遍历器对象，然后使用 next 方法（第二行），执行异步任务的第一阶段。由于 [Fetch 模块](https://github.com/bitinn/node-fetch)返回的是一个 Promise 对象，因此要用 then 方法调用下一个next 方法。

可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。本系列的[后面部分](http://www.ruanyifeng.com/blog/2015/05/thunk.html)，就将介绍如何自动化异步任务的流程管理。另外，本文对 Generator 函数的介绍很简单，详尽的教程请阅读我写的[《ECMAScript 6入门》](http://es6.ruanyifeng.com/#docs/generator)。

# Thunk 函数的含义和用法

本文是《深入掌握 ECMAScript 6 异步编程》系列文章的第二篇。

> - [Generator函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)
> - **Thunk函数的含义与用法**
> - [co函数库的含义与用法](http://www.ruanyifeng.com/blog/2015/05/co.html)
> - [async函数的含义与用法

## 一、参数的求值策略

Thunk函数**一个争论的焦点是"求值策略"，即函数的参数到底应该何时求值。**传值调用和传名调用，哪一种比较好？

传值调用比较简单，但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失。

> ```
> function f(a, b){
>   return b;
> }
> 
> f(3 * x * x - 2 * x - 1, x);
> ```



## 二、Thunk 函数的含义

**编译器的"传名调用"实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。**

> ```
> function f(m){
>   return m * 2;     
> }
> f(x + 5);
> // 等同于
> var thunk = function () {
>   return x + 5;
> };
> function f(thunk){
>   return thunk() * 2;
> }
> ```



## 三、JavaScript 语言的 Thunk 函数

JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。**在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。**

> ```
> // 正常版本的readFile（多参数版本）
> fs.readFile(fileName, callback);
> 
> // Thunk版本的readFile（单参数版本）
> var readFileThunk = Thunk(fileName);
> readFileThunk(callback);
> 
> var Thunk = function (fileName){
>   return function (callback){
>     return fs.readFile(fileName, callback); 
>   };
> };
> ```

上面代码中，fs 模块的 readFile 方法是一个多参数函数，两个参数分别为文件名和回调函数。经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。

任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。下面是一个简单的 Thunk 函数转换器。

> ```
> var Thunk = function(fn){
>   return function (){
>     var args = Array.prototype.slice.call(arguments);
>     return function (callback){
>       args.push(callback);
>       return fn.apply(this, args);
>     }
>   };
> };
> ```

使用上面的转换器，生成 fs.readFile 的 Thunk 函数。

> ```
> var readFileThunk = Thunk(fs.readFile);
> readFileThunk(fileA)(callback);
> ```

## 四、Thunkify 模块

生产环境的转换器，建议使用 [Thunkify 模块](https://github.com/tj/node-thunkify)。

首先是安装。

> ```
> $ npm install thunkify
> ```

使用方式如下。

> ```
> var thunkify = require('thunkify');
> var fs = require('fs');
> 
> var read = thunkify(fs.readFile);
> read('package.json')(function(err, str){
>   // ...
> });
> ```

Thunkify 的[源码](https://github.com/tj/node-thunkify/blob/master/index.js)与上一节那个简单的转换器非常像。

> ```
> function thunkify(fn){
>   return function(){
>     var args = new Array(arguments.length);
>     var ctx = this;
> 
>     for(var i = 0; i < args.length; ++i) {
>       args[i] = arguments[i];
>     }
> 
>     return function(done){
>       var called;
> 
>       args.push(function(){
>         if (called) return;
>         called = true;
>         done.apply(null, arguments);
>       });
> 
>       try {
>         fn.apply(ctx, args);
>       } catch (err) {
>         done(err);
>       }
>     }
>   }
> };
> ```

它的源码主要多了一个检查机制，[变量 called](http://segmentfault.com/q/1010000000524121) 确保回调函数只运行一次。这样的设计与下文的 Generator 函数相关。请看下面的例子。

> ```
> function f(a, b, callback){
>   var sum = a + b;
>   callback(sum);
>   callback(sum);
> }
> 
> var ft = thunkify(f);
> ft(1, 2)(console.log); 
> // 3
> ```

上面代码中，由于 thunkify 只允许回调函数执行一次，所以只输出一行结果。

## 五、Generator 函数的流程管理

你可能会问， Thunk 函数有什么用？回答是以前确实没什么用，但是 ES6 有了 Generator 函数，Thunk 函数现在可以用于 Generator 函数的自动流程管理。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015043002.jpg)

以读取文件为例。下面的 Generator 函数封装了两个异步操作。

> ```
> var fs = require('fs');
> var thunkify = require('thunkify');
> var readFile = thunkify(fs.readFile);
> 
> var gen = function* (){
>   var r1 = yield readFile('/etc/fstab');
>   console.log(r1.toString());
>   var r2 = yield readFile('/etc/shells');
>   console.log(r2.toString());
> };
> ```

上面代码中，yield 命令用于将程序的执行权移出 Generator 函数，那么就需要一种方法，将执行权再交还给 Generator 函数。

这种方法就是 Thunk 函数，因为它可以在回调函数里，将执行权交还给 Generator 函数。为了便于理解，我们先看如何手动执行上面这个 Generator 函数。

> ```
> var g = gen();
> 
> var r1 = g.next();
> r1.value(function(err, data){
>   if (err) throw err;
>   var r2 = g.next(data);
>   r2.value(function(err, data){
>     if (err) throw err;
>     g.next(data);
>   });
> });
> ```

上面代码中，变量 g 是 Generator 函数的内部指针，表示目前执行到哪一步。next 方法负责将指针移动到下一步，并返回该步的信息（value 属性和 done 属性）。

仔细查看上面的代码，可以发现 Generator 函数的执行过程，其实是将同一个回调函数，反复传入 next 方法的 value 属性。这使得我们可以用递归来自动完成这个过程。

## 六、Thunk 函数的自动流程管理

Thunk 函数真正的威力，在于可以自动执行 Generator 函数。下面就是一个基于 Thunk 函数的 Generator 执行器。

> ```
> function run(fn) {
>   var gen = fn();
> 
>   function next(err, data) {
>     var result = gen.next(data);
>     if (result.done) return;
>     result.value(next);
>   }
> 
>   next();
> }
> 
> run(gen);
> ```

上面代码的 run 函数，就是一个 Generator 函数的自动执行器。内部的 next 函数就是 Thunk 的回调函数。 next 函数先将指针移到 Generator 函数的下一步（gen.next 方法），然后判断 Generator 函数是否结束（result.done 属性），如果没结束，就将 next 函数再传入 Thunk 函数（result.value 属性），否则就直接退出。

有了这个执行器，执行 Generator 函数方便多了。不管有多少个异步操作，直接传入 run 函数即可。当然，前提是每一个异步操作，都要是 Thunk 函数，也就是说，跟在 yield 命令后面的必须是 Thunk 函数。

> ```
> var gen = function* (){
>   var f1 = yield readFile('fileA');
>   var f2 = yield readFile('fileB');
>   // ...
>   var fn = yield readFile('fileN');
> };
> 
> run(gen);
> ```

上面代码中，函数 gen 封装了 n 个异步的读取文件操作，只要执行 run 函数，这些操作就会自动完成。这样一来，异步操作不仅可以写得像同步操作，而且一行代码就可以执行。

Thunk 函数并不是 Generator 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 Generator 函数的流程，接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到这一点。本系列的[下一篇](http://www.ruanyifeng.com/blog/2015/05/co.html)，将介绍基于 Promise 的自动执行器。

# co 函数库的含义和用法

以下是《深入掌握 ECMAScript 6 异步编程》系列文章的第三篇。

> - [Generator函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)
> - [Thunk函数的含义与用法](http://www.ruanyifeng.com/blog/2015/05/thunk.html)
> - **co函数库的含义与用法**
> - [async函数的含义与用法](http://www.ruanyifeng.com/blog/2015/05/async.html)

## 一、什么是 co 函数库？

[co 函数库](https://github.com/tj/co)是著名程序员 TJ Holowaychuk 于2013年6月发布的一个小工具，用于 Generator 函数的自动执行。

比如，有一个 Generator 函数，用于依次读取两个文件。

> ```
> var gen = function* (){
>   var f1 = yield readFile('/etc/fstab');
>   var f2 = yield readFile('/etc/shells');
>   console.log(f1.toString());
>   console.log(f2.toString());
> };
> ```

**co 函数库可以让你不用编写 Generator 函数的执行器。**

> ```
> var co = require('co');
> co(gen);
> ```

上面代码中，Generator 函数只要传入 co 函数，就会自动执行。

co 函数返回一个 Promise 对象，因此可以用 then 方法添加回调函数。

> ```
> co(gen).then(function (){
>   console.log('Generator 函数执行完成');
> })
> ```

上面代码中，等到 Generator 函数执行结束，就会输出一行提示。

## 二、 co 函数库的原理

为什么 co 可以自动执行 Generator 函数？

前面文章说过，Generator 函数就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

两种方法可以做到这一点。

> （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
>
> （2）Promise 对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权。

**co 函数库其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个库。**使用 co 的前提条件是，Generator 函数的 yield 命令后面，只能是 Thunk 函数或 Promise 对象。

[上一篇文章](http://www.ruanyifeng.com/blog/2015/05/thunk.html)已经介绍了基于 Thunk 函数的自动执行器。下面来看，基于 Promise 对象的自动执行器。这是理解 co 函数库必须的。

## 三、基于 Promise 对象的自动执行

还是沿用上面的例子。首先，把 fs 模块的 readFile 方法包装成一个 Promise 对象。

> ```
> var fs = require('fs');
> 
> var readFile = function (fileName){
>   return new Promise(function (resolve, reject){
>     fs.readFile(fileName, function(error, data){
>       if (error) reject(error);
>       resolve(data);
>     });
>   });
> };
> 
> var gen = function* (){
>   var f1 = yield readFile('/etc/fstab');
>   var f2 = yield readFile('/etc/shells');
>   console.log(f1.toString());
>   console.log(f2.toString());
> };
> ```

然后，手动执行上面的 Generator 函数。

> ```
> var g = gen();
> 
> g.next().value.then(function(data){
>   g.next(data).value.then(function(data){
>     g.next(data);
>   });
> })
> ```

手动执行其实就是用 then 方法，层层添加回调函数。理解了这一点，就可以写出一个自动执行器。

> ```
> function run(gen){
>   var g = gen();
> 
>   function next(data){
>     var result = g.next(data);
>     if (result.done) return result.value;
>     result.value.then(function(data){
>       next(data);
>     });
>   }
> 
>   next();
> }
> 
> run(gen);
> ```

上面代码中，只要 Generator 函数还没执行到最后一步，next 函数就调用自身，以此实现自动执行。

## 四、co 函数库的源码

co 就是上面那个自动执行器的扩展，它的[源码](https://github.com/tj/co/blob/master/index.js)只有几十行，非常简单。

首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。

> ```
> function co(gen) {
>   var ctx = this;
> 
>   return new Promise(function(resolve, reject) {
>   });
> }
> ```

在返回的 Promise 对象里面，co 先检查参数 gen 是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为 resolved 。

> ```
> function co(gen) {
>   var ctx = this;
> 
>   return new Promise(function(resolve, reject) {
>     if (typeof gen === 'function') gen = gen.call(ctx);
>     if (!gen || typeof gen.next !== 'function') return resolve(gen);
>   });
> }
> ```

接着，co 将 Generator 函数的内部指针对象的 next 方法，包装成 onFulefilled 函数。这主要是为了能够捕捉抛出的错误。

> ```
> function co(gen) {
>   var ctx = this;
> 
>   return new Promise(function(resolve, reject) {
>     if (typeof gen === 'function') gen = gen.call(ctx);
>     if (!gen || typeof gen.next !== 'function') return resolve(gen);
> 
>     onFulfilled();
>     function onFulfilled(res) {
>       var ret;
>       try {
>         ret = gen.next(res);
>       } catch (e) {
>         return reject(e);
>       }
>       next(ret);
>     }    
>   });
> }
> ```

最后，就是关键的 next 函数，它会反复调用自身。

> ```
> function next(ret) {
>   if (ret.done) return resolve(ret.value);
>   var value = toPromise.call(ctx, ret.value);
>   if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
>   return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
>         + 'but the following object was passed: "' + String(ret.value) + '"'));
>     }
> });
> ```

上面代码中，next 函数的内部代码，一共只有四行命令。

> 第一行，检查当前是否为 Generator 函数的最后一步，如果是就返回。
>
> 第二行，确保每一步的返回值，是 Promise 对象。
>
> 第三行，使用 then 方法，为返回值加上回调函数，然后通过 onFulfilled 函数再次调用 next 函数。
>
> 第四行，在参数不符合要求的情况下（参数非 Thunk 函数和 Promise 对象），将 Promise 对象的状态改为 rejected，从而终止执行。

## 五、并发的异步操作

co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。

这时，要把并发的操作都放在数组或对象里面。

> ```
> // 数组的写法
> co(function* () {
>   var res = yield [
>     Promise.resolve(1),
>     Promise.resolve(2)
>   ];
>   console.log(res); 
> }).catch(onerror);
> 
> // 对象的写法
> co(function* () {
>   var res = yield {
>     1: Promise.resolve(1),
>     2: Promise.resolve(2),
>   };
>   console.log(res); 
> }).catch(onerror);
> ```

（完）

# async 函数的含义和用法

本文是《深入掌握 ECMAScript 6 异步编程》系列文章的最后一篇。

> - [Generator函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)
> - [Thunk函数的含义与用法](http://www.ruanyifeng.com/blog/2015/05/thunk.html)
> - [co函数库的含义与用法](http://www.ruanyifeng.com/blog/2015/05/co.html)
> - **async函数的含义与用法**

## 一、终极解决

异步操作是 JavaScript 编程的麻烦事，麻烦到一直有人提出各种各样的方案，试图解决这个问题。

从最早的回调函数，到 Promise 对象，再到 Generator 函数，每次都有所改进，但又让人觉得不彻底。它们都有额外的复杂性，都需要理解抽象的底层运行机制。

异步I/O不就是读取一个文件吗，干嘛要搞得这么复杂？**异步编程的最高境界，就是根本不用关心它是不是异步。**

## 二、async 函数是什么？

**一句话，async 函数就是 Generator 函数的语法糖。**

前文有一个 Generator 函数，依次读取两个文件。

> ```
> var fs = require('fs');
> 
> var readFile = function (fileName){
>   return new Promise(function (resolve, reject){
>     fs.readFile(fileName, function(error, data){
>       if (error) reject(error);
>       resolve(data);
>     });
>   });
> };
> 
> var gen = function* (){
>   var f1 = yield readFile('/etc/fstab');
>   var f2 = yield readFile('/etc/shells');
>   console.log(f1.toString());
>   console.log(f2.toString());
> };
> ```

写成 async 函数，就是下面这样。

> ```
> var asyncReadFile = async function (){
>   var f1 = await readFile('/etc/fstab');
>   var f2 = await readFile('/etc/shells');
>   console.log(f1.toString());
>   console.log(f2.toString());
> };
> ```

一比较就会发现，async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await，仅此而已。

## 三、async 函数的优点

async 函数对 Generator 函数的改进，体现在以下三点。

**（1）内置执行器。** Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

> ```
> var result = asyncReadFile();
> ```

**（2）更好的语义。** async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

**（3）更广的适用性。** co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

## 四、async 函数的实现

**async 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。**

> ```
> async function fn(args){
>   // ...
> }
> 
> // 等同于
> 
> function fn(args){ 
>   return spawn(function*() {
>     // ...
>   }); 
> }
> ```

所有的 async 函数都可以写成上面的第二种形式，其中的 spawn 函数就是自动执行器。

下面给出 spawn 函数的实现，基本就是前文自动执行器的翻版。

> ```
> function spawn(genF) {
>   return new Promise(function(resolve, reject) {
>     var gen = genF();
>     function step(nextF) {
>       try {
>         var next = nextF();
>       } catch(e) {
>         return reject(e); 
>       }
>       if(next.done) {
>         return resolve(next.value);
>       } 
>       Promise.resolve(next.value).then(function(v) {
>         step(function() { return gen.next(v); });      
>       }, function(e) {
>         step(function() { return gen.throw(e); });
>       });
>     }
>     step(function() { return gen.next(undefined); });
>   });
> }
> ```

async 函数是非常新的语法功能，新到都不属于 ES6，而是属于 ES7。目前，它仍处于提案阶段，但是转码器 Babel 和 regenerator 都已经支持，转码后就能使用。

## 五、async 函数的用法

同 Generator 函数一样，async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。

下面是一个例子。

> ```
> async function getStockPriceByName(name) {
>   var symbol = await getStockSymbol(name);
>   var stockPrice = await getStockPrice(symbol);
>   return stockPrice;
> }
> 
> getStockPriceByName('goog').then(function (result){
>   console.log(result);
> });
> ```

上面代码是一个获取股票报价的函数，函数前面的async关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个Promise对象。

下面的例子，指定多少毫秒后输出一个值。

> ```
> function timeout(ms) {
>   return new Promise((resolve) => {
>     setTimeout(resolve, ms);
>   });
> }
> 
> async function asyncPrint(value, ms) {
>   await timeout(ms);
>   console.log(value)
> }
> 
> asyncPrint('hello world', 50);
> ```

上面代码指定50毫秒以后，输出"hello world"。

## 六、注意点

await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。

> ```
> async function myFunction() {
>   try {
>     await somethingThatReturnsAPromise();
>   } catch (err) {
>     console.log(err);
>   }
> }
> 
> // 另一种写法
> 
> async function myFunction() {
>   await somethingThatReturnsAPromise().catch(function (err){
>     console.log(err);
>   });
> }
> ```

await 命令只能用在 async 函数之中，如果用在普通函数，就会报错。

> ```
> async function dbFuc(db) {
>   let docs = [{}, {}, {}];
> 
>   // 报错
>   docs.forEach(function (doc) {
>     await db.post(doc);
>   });
> }
> ```

上面代码会报错，因为 await 用在普通函数之中了。但是，如果将 forEach 方法的参数改成 async 函数，也有问题。

> ```
> async function dbFuc(db) {
>   let docs = [{}, {}, {}];
> 
>   // 可能得到错误结果
>   docs.forEach(async function (doc) {
>     await db.post(doc);
>   });
> }
> ```

上面代码可能不会正常工作，原因是这时三个 db.post 操作将是并发执行，也就是同时执行，而不是继发执行。正确的写法是采用 for 循环。

> ```
> async function dbFuc(db) {
>   let docs = [{}, {}, {}];
> 
>   for (let doc of docs) {
>     await db.post(doc);
>   }
> }
> ```

如果确实希望多个请求并发执行，可以使用 Promise.all 方法。

> ```
> async function dbFuc(db) {
>   let docs = [{}, {}, {}];
>   let promises = docs.map((doc) => db.post(doc));
> 
>   let results = await Promise.all(promises);
>   console.log(results);
> }
> 
> // 或者使用下面的写法
> 
> async function dbFuc(db) {
>   let docs = [{}, {}, {}];
>   let promises = docs.map((doc) => db.post(doc));
> 
>   let results = [];
>   for (let promise of promises) {
>     results.push(await promise);
>   }
>   console.log(results);
> }
> ```

 