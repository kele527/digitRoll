/**
 * H5数字滚动效果
 * @class DigitRoll
 * @desc 没有任何依赖, 只兼容webkit内核, 主要用于H5页面. 组件本身没有css, 如果需要修改默认样式 可以添加css样式修饰.
 * @param {object} opts 实例化参数
 * @param {string} opts.container 容器选择器 selector
 * @param {number} opts.width=1 数字的总宽度个数, 即要显示几位数
 * @param {effect} effect 运动的效果，如上下滚动，左右翻转
 * @example
    HTML:
    <div id="num-roll"></div>
 * @example
    js:
    var r1=new DigitRoll({
        container:'#num-roll',
        width:9,
        effect:'flip'
    });
 */
function DigitRoll(opts) {
    this.container=document.querySelector(opts.container); //容器
    this.width=opts.width || 1;
    this.effect=opts.effect;

    //typeof 函数, chrome 返回 "function"
    //判断所选的效果是否存在
    if(typeof DigitRoll.prototype[this.effect]!="function"){
        this.effect="roll";
    }

    if (!this.container) {
        throw Error('no container');
    }
    this.container.style.overflow='hidden';
    this.rollHeight=parseInt(getComputedStyle(this.container).height); //容器高度 也用于滚动间隔距离

    if (this.rollHeight<1) {//只有容器的高度是必选样式  如果没有设置 那就给一个默认的
        this.container.style.height='20px';
        this.rollHeight=20;
    }
    this.setWidth();
}
/**  @lends DigitRoll */
DigitRoll.prototype={
    /** 
     * 滚动数字
     * @param {number} n 要滚动的数字
     * @param {effect} effect 运动的效果，如上下滚动，左右翻转
     * @example
        r1.move(314159);

        //定时更新
        setInterval(function(){
            r1.move(314159);
        },5000)
     */
    move:function(n){
        this[this.effect](n);
    },
    /*
     *@desc左右翻转
     *@param {number} n 要滚动的数字
     */
    flip:function(n){
        var self=this;
        this.check(n);
        Array.prototype.forEach.call(this.container.querySelectorAll(".num"),function(item,i){
            var currentNum=parseInt(item.querySelector("div:last-child").innerHTML);
            var goalNum=parseInt(self.number[i]);
            var gapNum=0;
            var gapStr="";
            if(currentNum==goalNum){
                return ;
            }else{
                gapStr="<div>"+goalNum+"</div>";
            }
            
            item.style.cssText+="-webkit-transition-duration:0s;-webkit-transform:rotateY(0)";
            setTimeout(function(){
                item.style.cssText+="-webkit-transition-duration:500ms;-webkit-transform:rotateY(-90deg);";
            },50);
            var rot=function(){
                item.innerHTML=gapStr;
                item.style.cssText+="-webkit-transform:rotateY(0deg);";
                item.removeEventListener("webkitTransitionEnd",rot);
            };
            item.addEventListener("webkitTransitionEnd",rot);
        });
    },
    /**
     *@desc上下滚动效果
     *@param {number} n 要滚动的数字
     */
    roll:function (n) {
        var self=this;
        this.check(n);
        Array.prototype.forEach.call(this.container.querySelectorAll('.num'), function (item,i) {
            var currentNum=parseInt(item.querySelector('div:last-child').innerHTML);//当前数字
            var goalNum=parseInt(self.number[i]);//目标数字
            var gapNum=0; //数字滚动的间隔个数
            var gapStr='';
            if (currentNum==goalNum) { //数字没变 不处理
                return ;
            }else if(currentNum<goalNum) { // 比如数字从1到3   
                gapNum=goalNum-currentNum;
                for (var j=currentNum; j<goalNum+1; j++) {
                    gapStr+='<div>'+j+'</div>'
                }
            }else {// 比如 数字从6到5  因为所有情况都是从下往上滚动 所以如果是6到5的话 要滚动9个数字
                gapNum=10-currentNum+goalNum;
                for (var j=currentNum; j<10; j++) {
                    gapStr+='<div>'+j+'</div>'
                }
                for (var j=0; j<goalNum+1; j++) {
                    gapStr+='<div>'+j+'</div>'
                }
            }
            item.style.cssText += '-webkit-transition-duration:0s;-webkit-transform:translateY(0)';//重置位置
            item.innerHTML = gapStr;
            setTimeout(function () {
                item.style.cssText+='-webkit-transition-duration:1s;-webkit-transform:translateY(-'+self.rollHeight*gapNum+'px)';
            },50)
        })
    },
    /**
     *@desc 检查位数，多退少补
     *@param{number} n
     */
    check:function(n){
        this.number=parseInt(n)+'';
        if (this.number.length<this.width) {
            this.number=new Array(this.width - this.number.length + 1).join('0') + this.number;
        }else if (this.number.length>this.width) {
            this.width=this.number.length;
            this.setWidth();
        }
    },
    /** 
     * 重置宽度
     * @desc 一般用不到这个方法  
     * @param {number} n 宽度 即数字位数
     * @example
        r1.setWidth(10);
     */
    setWidth:function (n) {
        n=n||this.width;
        var str='';
        for (var i=0; i<n; i++) {
            str+='<div class="num" style="float:left;height:100%;position:relative;line-height:'+this.rollHeight+'px"><div>0</div></div>';
        }
        this.container.innerHTML=str;
    }
}