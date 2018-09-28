# 1.前端环境搭建

```
npm install webpack webpack-cli -g 
# 或者 
yarn global add webpack webpack-cli
```

# 2.部署webpack

```
"scripts": {
    "build": "webpack --mode production" //我们在这里配置，就可以使用npm run build 启动我们的webpack
  },
  "devDependencies": {
    "webpack": "^4.16.0",
    "webpack-cli": "^3.0.8"
  }
```

# 3.npm run build

```
在webpacktest目录下
mkdir src
cd src && mkdir index.js
echo "const a=1;">index.js
npm run build
```

此时，出现dist目录，进入dist目录，看到main.js

## 4.Html在webpack中的配置

```
在webpack目录下
touch webpack.config.js 
touch index.html

```

```
vim webpack.config.js
const path = require('path'); //引入我们的node模块里的path
//测试下 console.log(path.resolve(__dirname,'dist')); //物理地址拼接
module.exports = {
    entry: './src/index.js', //入口文件  在vue-cli main.js
    output: {       //webpack如何向外输出
        path: path.resolve(__dirname, 'dist'),//定位，输出文件的目标路径
        filename: '[name].js' //文件名[name].js默认，也可自行配置
    },
```

