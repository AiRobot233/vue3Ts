<template>
  <canvas
      style="cursor: pointer; border-radius: 5px"
      id="s-canvas"
      :width="contentWidth"
      :height="contentHeight"
      @click="click"
  ></canvas>
</template>
<script>
export default {
  props: {
    identifyCode: {
      type: String,
      default: '123456789',
    },
    fontSizeMin: {
      type: Number,
      default: 16,
    },
    fontSizeMax: {
      type: Number,
      default: 20,
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    backgroundColorMin: {
      type: Number,
      default: 180,
    },
    backgroundColorMax: {
      type: Number,
      default: 240,
    },
    colorMin: {
      type: Number,
      default: 50,
    },
    colorMax: {
      type: Number,
      default: 160,
    },
    // 是否绘制 干扰线
    lineFlag: {
      type: Boolean,
      default: false,
    },
    lineColorMin: {
      type: Number,
      default: 40,
    },
    lineColorMax: {
      type: Number,
      default: 180,
    },
    // 是否绘制 干扰点
    dotFlag: {
      type: Boolean,
      default: true,
    },
    dotColorMin: {
      type: Number,
      default: 100,
    },
    dotColorMax: {
      type: Number,
      default: 255,
    },
    contentWidth: {
      type: Number,
      default: 70,
    },
    contentHeight: {
      type: Number,
      default: 30,
    },
    textColor: {
      type: String,
      default: '',
    },
  },
  // model: {
  //   event: 'click',
  // },
  watch: {
    identifyCode() {
      this.drawPic();
    },
  },
  data() {
    return {
      code: '',
    };
  },
  mounted() {
    this.drawPic();
    this.$emit('click', this.code); //默认往外暴露一次值
  },
  methods: {
    click() {
      this.drawPic();
      this.$emit('click', this.code.toLowerCase());
    },

    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      const r = this.randomNum(min, max);
      const g = this.randomNum(min, max);
      const b = this.randomNum(min, max);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    // 获取随机字符
    get_random_str(number) {
      const x = this.identifyCode;
      let str = '';
      for (let i = 0; i < number; i++) {
        //重点  这里利用了Math.random()函数生成的随机数大于0 小于1 我们可以
        //用它的随机数来乘以字符串的长度,得到的也是一个随机值，再通过parseInt()
        //函数取整，这样就可以实现字符串的随机取值了
        str += x[parseInt(Math.random() * x.length)];
      }
      return str;
    },

    drawPic() {
      const canvas = document.getElementById('s-canvas'); //画板
      const ctx = canvas.getContext('2d'); //画笔
      ctx.clearRect(0, 0, this.contentWidth, this.contentHeight);
      ctx.textBaseline = 'bottom';
      // 绘制背景
      ctx.fillStyle =
          this.backgroundColor || this.randomColor(this.backgroundColorMin, this.backgroundColorMax);
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight);

      const result = this.get_random_str(4); //4个随机字符
      this.code = result;
      // 绘制文字
      for (let i = 0; i < result.length; i++) {
        this.drawText(ctx, result[i], i, result.length);
      }

      if (this.lineFlag) this.drawLine(ctx);
      if (this.dotFlag) this.drawDot(ctx);
    },

    drawText(ctx, txt, i, length) {
      ctx.fillStyle = this.textColor || this.randomColor(this.colorMin, this.colorMax);
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei';
      const x = (i + 1) * (this.contentWidth / (length + 1));
      const y = this.randomNum(this.fontSizeMax, this.contentHeight);
      const deg = this.randomNum(-10, 10);
      // 修改坐标原点和旋转角度
      ctx.translate(x, y);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillText(txt, 0, 0);
      // 恢复坐标原点和旋转角度
      ctx.rotate((-deg * Math.PI) / 180);
      ctx.translate(-x, -y);
    },

    drawLine(ctx) {
      // 绘制干扰线
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax);
        ctx.beginPath();
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight));
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight));
        ctx.stroke();
      }
    },

    drawDot(ctx) {
      // 绘制干扰点
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = this.randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(
            this.randomNum(0, this.contentWidth),
            this.randomNum(0, this.contentHeight),
            1,
            0,
            2 * Math.PI,
        );
        ctx.fill();
      }
    },
  },
};
</script>