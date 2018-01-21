var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var brushFlag = true;
var lineWidth = 10;
var brushIcon = document.getElementById('brushIcon'),eraseIcon = document.getElementById('eraseIcon'),saveIcon = document.getElementById('saveIcon'),deleteIcon= document.getElementById('deleteIcon'),thickIcon = document.getElementById('thick'),thinIcon = document.getElementById('thin');
thinIcon.onclick = function () {
    lineWidth = 5;
}
thickIcon.onclick = function () {
    lineWidth = 10;
}
brushIcon.onclick = function () {
    brushFlag = true;
    this.classList.add('active');
    eraseIcon.classList = 'icon';
}
eraseIcon.onclick = function () {
    brushFlag = false;
    this.classList.add('active');
    eraseIcon.classList = 'icon active';
    brushIcon.classList = 'icon';
}
saveIcon.onclick =function () {
    var url = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'canvas';
    a.target='_blank';
    a.click();
}
deleteIcon.onclick = function () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
var colorIcons = document.getElementsByClassName('colorIcon');
for(var i =0;i<colorIcons.length;i++) {
    (function (i) {
        colorIcons[i].onclick = function (ele) {
            ctx.strokeStyle = this.attributes['color']['value'];
            removeClass();
            this.classList.add('active');
        }
    }(i))
}
function removeClass() {
    for(var i=0;i<colorIcons.length;i++){
        if(colorIcons[i].classList.value.indexOf('active')){
            colorIcons[i].classList.remove('active');
        }

    }
}

function autoSetCanvasSize(canvas) {
    setCanvasSize();
    window.onresize = function() {
        setCanvasSize();
    }
    function setCanvasSize() {
        var pageWidth = document.documentElement.clientWidth,pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }

}

function listenToUser(canvas) {
    var using = false;
    var lastPoint={
        x:undefined,
        y:undefined
    };

    if(document.body.ontouchstart !== undefined){
        canvas.ontouchstart = function (ele) {
            using = true;
            var x = ele.touches[0].clientX,y = ele.touches[0].clientY;;
            if(brushFlag == true){
                lastPoint.x = x;
                lastPoint.y = y;
            }else{
                ctx.clearRect(x-5,y-5,10,10);
            }
        }
        canvas.ontouchmove = function (ele) {
            var x = ele.touches[0].clientX,y = ele.touches[0].clientY;
            if(!using){
                return
            }
            if(brushFlag == true){
                var newPoint = {
                    x:x,
                    y:y
                }
                brush(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }else{
                ctx.clearRect(x-5,y-5,10,10);
            }
        }
        canvas.ontouchend = function (ele) {
            console.log('end');
            using = false;
        }
    }else{
        canvas.onmousedown = function (ele) {
            lastX = ele.clientX,lastY = ele.clientY;
            using = true;
            brushCircle(lastX,lastY);
        }
        canvas.onmouseup = function (ele) {
            using = false;
            console.log('up');
        }
        canvas.onmousemove = function (ele) {
            if(using){
                var curX = ele.pageX,curY = ele.pageY;
                if(brushFlag){
                    brush(lastX,lastY,curX,curY);
                }else{
                    eraser(lastX,lastY);
                }
                lastX = curX;
                lastY = curY;
            }
        }
    }
}

autoSetCanvasSize(canvas);
listenToUser(canvas);

function brushCircle(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,5,0,Math.PI*2);
    ctx.closePath();
}
function brush(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    ctx.closePath();
}
function eraser(x0, y0) {
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(x0-5,y0-5,10,10);
}