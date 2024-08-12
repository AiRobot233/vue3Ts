<template>
  <canvas
      style="cursor: pointer; border-radius: 5px"
      id="s-canvas"
      :width="contentWidth"
      :height="contentHeight"
      @click="click"
  ></canvas>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';

const props = defineProps({
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
});

const emit = defineEmits(['click']);

const code = ref('');

const randomNum = (min: any, max: any) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const randomColor = (min: any, max: any) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};

const getRandomStr = (number: any) => {
  const x = props.identifyCode;
  let str = '';
  for (let i = 0; i < number; i++) {
    str += x[parseInt(String(Math.random() * x.length))];
  }
  return str;
};

const drawPic = () => {
  const canvas =  <HTMLCanvasElement> document.getElementById('s-canvas');
  const ctx = canvas!.getContext('2d');
  ctx!.clearRect(0, 0, props.contentWidth, props.contentHeight);
  ctx!.textBaseline = 'bottom';

  ctx!.fillStyle = props.backgroundColor || randomColor(props.backgroundColorMin, props.backgroundColorMax);
  ctx!.fillRect(0, 0, props.contentWidth, props.contentHeight);

  const result = getRandomStr(4);
  code.value = result;

  for (let i = 0; i < result.length; i++) {
    drawText(ctx, result[i], i, result.length);
  }

  if (props.lineFlag) drawLine(ctx);
  if (props.dotFlag) drawDot(ctx);
};

const drawText = (ctx: any, txt: any, i: any, length: any) => {
  ctx.fillStyle = props.textColor || randomColor(props.colorMin, props.colorMax);
  ctx.font = `${randomNum(props.fontSizeMin, props.fontSizeMax)}px SimHei`;
  const x = (i + 1) * (props.contentWidth / (length + 1));
  const y = randomNum(props.fontSizeMax, props.contentHeight);
  const deg = randomNum(-10, 10);

  ctx.translate(x, y);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.fillText(txt, 0, 0);

  ctx.rotate((-deg * Math.PI) / 180);
  ctx.translate(-x, -y);
};

const drawLine = (ctx: any) => {
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = randomColor(props.lineColorMin, props.lineColorMax);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight));
    ctx.lineTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight));
    ctx.stroke();
  }
};

const drawDot = (ctx: any) => {
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
};

const click = () => {
  drawPic();
  emit('click', code.value.toLowerCase());
};

onMounted(() => {
  drawPic();
  emit('click', code.value); // 默认往外暴露一次值
});
</script>
