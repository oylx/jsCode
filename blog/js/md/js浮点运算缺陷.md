缺陷

```
0.1+0.2==0.3
>>false

0.1+0.2
>>0.30000000000000004
```

改进

1.提供精确范围比较是否相等

```
x = 0.2;
y = 0.3;
equal = (Math.abs(x - y) < 0.000001)
>>false
```

2.内置函数oPrecision或toFixed来保留一定的精度

```
(0.1 + 0.2).toPrecision(10) == 0.3
>> true

(0.1 + 0.2).toFixed(10) == 0.3
>> true
```

试题

```
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one == one, eight - six == two]
>>[true,false]

结果精准度未知，有时true，有时false
```

