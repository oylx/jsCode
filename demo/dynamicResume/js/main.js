//html遇到多个空格及回车，只保留第一个
//pre标签保留所有缩进和空格
let css1 = `/* 
    * 面试官你好，我是oylx
    * 只用文字作做我介绍太单调了
    * 我就用代码来介绍吧
    * 首先准备一些样式
    */
    html{
        background: #eee;
    }
    #code{
        border: 1px solid #aaa;
        padding: 16px;
    }
    /* 我需要一点代码高亮 */
    .token.selector{ color: #690; }
    .token.property{ color: #905; }
    /* 加一个呼吸效果 */
    #code{
        animation: breath 0.5s infinite alternate-reverse;
    }
    /* 现在正式开始 */
    /* 我需要一张白纸 */
    #code-wrapper{
        width: 50%; left: 0; position: fixed; 
        height: 100%;
    }
    #paper > .content {
    display: block;
    }
    /* 于是我就可以在白纸上写字了，请看右边 */
    `

var css2 = `
    /* 接下来用一个优秀的库 marked.js
        * 把 Markdown 变成 HTML
        */
    `
var md = `
    # 自我介绍
    我叫 oylx
    1990 年 5 月出生
    毕业于南京信息工程大学
    前端工年2年
    希望应聘前端开发岗位
    # 技能介绍
    熟悉 JavaScript CSS
    # 联系方式
    - QQ 5732709**
    - Email oylx@163.com
    - 手机 151****5371
    `
let css3 = `
    /*
    * 这就是我的会动的简历
    * 谢谢观看
    */
    `

/*把code写到#code和style标签里*/
function writeCss(prefix, code, fn){
    let domCode = document.querySelector('#code')
    let n = 0
    let id = setInterval(() => {
      n += 1
      domCode.innerHTML = Prism.highlight(prefix + code.substring(0, n), Prism.languages.css);
      styleTag.innerHTML = prefix +  code.substring(0, n)
      domCode.scrollTop = domCode.scrollHeight
      if (n >= code.length) {
        window.clearInterval(id)
        fn && fn.call()
      }
    }, 10)
  }
  function writeMarkdown(markdown, fn){
    let domPaper = document.querySelector('#paper>.content')
    let n = 0
    let id = setInterval(() => {
      n += 1
      domPaper.innerHTML = markdown.substring(0, n)
      domPaper.scrollTop = domPaper.scrollHeight
      if (n >= markdown.length) {
        window.clearInterval(id)
        fn && fn.call()
      }
    }, 15)
  }


writeCss('', css1, ()=>{ // writeCss call the function
    createPaper(() => {
      writeMarkdown(md, ()=> {
        writeCss(css1, css2, ()=>{
          convertMarkdownToHtml(()=>{
            writeCss(css1 + css2, css3, ()=> {
              console.log('完成')
            })
          })
        })
      })
    })
  })
  
  
  
  
  function createPaper(fn){
    var paper = document.createElement('div') 
    paper.id = 'paper'
    var content = document.createElement('pre')
    content.className = 'content'
    paper.appendChild(content)
    document.body.appendChild(paper)
    fn && fn.call()
  }
  
  function convertMarkdownToHtml(fn){
    var div = document.createElement('div')  
    div.className = 'html markdown-body'
    div.innerHTML = marked(md)
    let markdownContainer = document.querySelector('#paper > .content')
    markdownContainer.replaceWith(div)
    fn && fn.call()
  }