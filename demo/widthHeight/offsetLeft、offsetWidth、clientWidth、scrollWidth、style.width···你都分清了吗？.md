### 1.offsetLeft和offsetTop

1. 本身不为fixed&&父级(可一直向上追溯)有定位=>offsetParent为父级
2. 除1的情况外，其他=>offsetParent为body

```
`offsetTop`, `offsetLeft`：只读属性。要确定的这两个属性的值，首先得确定元素的`offsetParent`。`offsetParent`指的是距该元素最近的`position`不为static的祖先元素，如果没有则指向`body`元素。确定了`offsetParent`，`offsetLeft`指的是元素左侧偏移`offsetParent`的距离，同理`offsetTop`指的是上侧偏移的距离。
```



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/1/162804163d195550~tplv-t2oaga2asx-watermark.awebp)

**offsetLeft/offsetTop和style.left/style.top的区别**

style.left/style.top和offsetLeft/offsetTop的功能一样，那么它们有什么区别呢？

1.返回值不一样：style.left/style.top返回的是字符串，带了单位（px）的，而offsetLeft/offsetTop只返回数字（小数会四舍五入）。

2.可读写性不同：offsetLeft/offsetTop只读，而style.left/style.top 可读写。

3.若是没有给 HTML 元素指定过 top 样式，则 style.top 返回的是空字符串（而且必须要定义在html里，如果定义在css里，style.left的值仍然为空，这也是个坑啊，大家谨慎）。

### 2.offsetWidth和offsetHeight

这两个也是**只读属性**，先上公式：**offsetHeight || offsetWidth = boder + padding + content（不包括margin）**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/1/16280300d2cbc0ad~tplv-t2oaga2asx-watermark.awebp)

**offsetHeight/offsetWidth和style.height/style.width的区别**

1.返回值不一样：offsetHeight/offsetWidth返回纯数字（小数会四舍五入），style.height/style.width返回字符串，带单位（px）。

2.可读写性不一样：offsetHeight/offsetWidth只读，style.height/style.width可读写。

3.style.height/style.width是不包含边框的哦。用公式表示一下：offsetWidth = style.width + style.padding + style.border

4.如果没有为元素设置高度，offsetHeight会根据内容获取高度值，style.height会返回undefind

### 3.clientWidth和clientHeight

**只读属性**，返回当前节点的**可视宽度**和**可视高度**（不包括边框、外边距）（包括内边距）clientHeight = style.height + style.padding  - scrollbar.height。

### 4.scrollTop、scrollLeft、scrollWidth、scrollHeight

scrollTop和scrollLeft是**可读写属性** 。如果元素不能被滚动，则为0。scrollTop：返回网页滚动条垂直方向滚去的距离； scrollLeft：返回网页滚动条水平方向滚去的距离；

scrollWidth和scrolltHeight是**只读属性**，返回元素内容的整体尺寸，包括元素看不见的部分（需要滚动才能看见的）。返回值包括padding，但不包括边框。没有滚动条时和clientWidth和clientHeight一样

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/1/1628055d0479d7c5~tplv-t2oaga2asx-watermark.awebp)

### 5.event.clientX、event.clientY、event.pageX、event.pageY

event.clientX /event.clientY是目标点距离浏览器可视范围的X轴/Y轴坐标

event.pageX /event.pageY 是目标点距离document最左上角的X轴/Y轴坐标

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/1/1628064e83bb382a~tplv-t2oaga2asx-watermark.awebp)

### 6.innerHeight/innerWidth和outerHeight/outerWidth

innerHeight/innerWidth为**只读属性**，返回窗口文档显示区的高度和宽度，不包括菜单栏、工具栏和滚动条的宽高。（ 注：IE不支持这些属性，它用document.documentElement 或document.body 的 clientWidth和 clientHeight属性作为替代。）

outerHeight/outerWidth为**可读写属性**，设置或返回一个窗口的高度和宽度，包括所有界面元素（如工具栏/滚动条）。