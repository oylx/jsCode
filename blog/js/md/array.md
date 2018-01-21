# JS数组

number		string		boolean				Object:array	function

Number()=>基本类型							Object(1)=>对象

new Number()=>对象							new Object(1)=>对象

不一样										一样



```
function

new Function('x','y','x+y')

```

```
var ary=[1,2,3,4];

ary.xxx=1;

for(var i =0;i<ary.length;i++){

	console.log(ary[i])

}//0,1,2,3

for(let i in ary){

	console.log(ary[i])

}//0,1,2,3,xxx

```



```
function f(){

	return undefined//如果不写retuen,函数默认帮你加上

}
```

