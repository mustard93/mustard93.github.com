
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
    $loveHeart = $("#loveHeart");
    var offsetX = $loveHeart.width() / 2;
    var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}

(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function() {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

function timeElapse(date){
    var current = Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
    $("#elapseClock").html(result);
}

function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
        showLoveU();
    });
}

function adjustWordsPosition() {
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
    $('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
    $('#loveu').fadeIn(3000);
}



var curOpac = 0;
var filterTimer;
var isIE = /internet explorer/i.test(window.navigator.appName);

function MyScroll(cnt, control){
    this.data = []; // 存放图片路径
    this.interval = 3000; // 过渡一次的间隔时间(过渡时间+图片显示时间)
    this.timer; // 定时器：控制当前显示的图片
    this.container = cnt;
    this.curFrame = 0;
    this.oldFrame = 0;
    this.controls = control; // 按钮集合
    Global = this;     // 获取对象的指针

    this.run = function(){
        this.timer = window.setInterval("Global.showFrame()", this.interval);
    }

    // 按钮的处理程序
    this.go = function(i){
        curOpac = 0; // 透明度归0
        this.curFrame = i; // 当前要过渡的图片
        this.stop(); // 清空计时器
        this.showFrame(); // 当前图片过渡
        this.run(); // 循环播放
    }

    this.stop = function(){
        window.clearInterval(this.timer);
        window.clearInterval(filterTimer);
    }

    this.showFrame = function(){
        // 设置当前按钮样式
        this.controls[this.oldFrame].style.backgroundColor = "white";
        this.controls[this.curFrame].style.backgroundColor = "gray";

        if(isIE) this.container.style.filter = "alpha(opacity=0)";
        else this.container.style.cssText = "-moz-opacity:0";

        this.container.innerHTML = this.data[this.curFrame];
        filterTimer = window.setInterval("blend()", 100);

        this.oldFrame = this.curFrame;
        this.curFrame ++;
        if(this.curFrame == this.data.length){
            this.curFrame = 0;
        }
    }
}
// 增加透明度
function blend(){
    curOpac+=10;
    if(isIE) Global.container.style.filter='alpha(opacity=' + curOpac + ')';
    else Global.container.style.cssText = "-moz-opacity:" + curOpac/100.0;

    if(curOpac == 100){
        curOpac = 0;
        window.clearInterval(filterTimer);
    }
}
//开始

function startIt(){
    var imgArr = [];
    // 创建4个图片对象保存图片路径
    for(var i=0;i<4;i++){
        imgArr[i] = new Image();
        imgArr[i].src = "../images/" + (i + 1) + ".jpg";
    }

    var controlArr = $("mainTb").getElementsByTagName("span");
    for(var i=0;i<controlArr.length;i++){
        controlArr[i].tag = i;
        controlArr[i].onclick = function(){
            myScroll.go(this.tag);
        }
    }

    var myScroll = new MyScroll($("cnt"), controlArr);
    myScroll.data.push("<img src='" + imgArr[0].src + "'>");
    myScroll.data.push("<img src='" + imgArr[1].src + "'>");
    myScroll.data.push("<img src='" + imgArr[2].src + "'>");
    myScroll.data.push("<img src='" + imgArr[3].src + "'>");

    myScroll.go(0);
}

window.onload = startIt;

// function $(mainTb){ return document.getElementById(mainTb);}
