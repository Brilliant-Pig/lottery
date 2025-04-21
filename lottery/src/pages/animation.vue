<template>
  <div id="blackhole" ref="blackhole">
    <div 
      class="centerHover" 
      :class="{ open: isOpen || showResult }"
      @click="handleClick"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    >
      <span>ENTER</span>
    </div>
    <canvas ref="canvas"></canvas>

    <!-- 抽奖结果展示 - 直接显示白色文字和按钮 -->
    <div v-if="showResult" class="result-container">
        <h1 class="result-title">{{ result }}</h1>
        <p class="result-info">用户: {{ userName }}</p>
        <p class="result-info">活动: {{ activityName }}</p>
        <button @click="goToResultMan" class="result-btn">返回</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'BlackHole',
  setup() {
    const store = useStore();
    const router = useRouter();
    return { store, router };
  },
  data() {
    return {
      h: 0,
      w: 0,
      cw: 0,
      ch: 0,
      maxorbit: 255,
      centery: 0,
      centerx: 0,
      startTime: 0,
      currentTime: 0,
      stars: [],
      collapse: false,
      expanse: false,
      isOpen: false,
      animationFrameId: null,
      context: null,
      redirectTimer: null,
      result: '',
      userName: '',
      activityName: '',
      showResult: false
    }
  },
  mounted() {
    this.initCanvas()
    this.init()
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrameId)
    if(this.redirectTimer) {
      clearTimeout(this.redirectTimer)
    }
  },
  async created() {
    // 从Vuex获取抽奖结果
    const lotteryResult = this.store.state.lotteryResult;
    
    if (lotteryResult) {
        this.result = lotteryResult.prize;
        this.userName = lotteryResult.userName;
        this.activityName = lotteryResult.activityName;
        this.showResult = true;
    } else {
        this.result = '请从抽奖页面进入';
        this.showResult = true;
    }
},
  methods: {
    initCanvas() {
      const element = this.$refs.blackhole
      this.h = element.offsetHeight
      this.w = element.offsetWidth
      this.cw = this.w
      this.ch = this.h
      this.centery = this.ch / 2
      this.centerx = this.cw / 2

      const canvas = this.$refs.canvas
      canvas.width = this.cw
      canvas.height = this.ch
      this.context = canvas.getContext("2d")
      this.context.globalCompositeOperation = "multiply"
      this.setDPI(canvas, 192)
    },

    setDPI(canvas, dpi) {
      if (!canvas.style.width)
        canvas.style.width = canvas.width + 'px'
      if (!canvas.style.height)
        canvas.style.height = canvas.height + 'px'

      const scaleFactor = dpi / 96
      canvas.width = Math.ceil(canvas.width * scaleFactor)
      canvas.height = Math.ceil(canvas.height * scaleFactor)
      const ctx = canvas.getContext('2d')
      ctx.scale(scaleFactor, scaleFactor)
    },

    rotate(cx, cy, x, y, angle) {
      const radians = angle
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)
      const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
      const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
      return [nx, ny]
    },

    handleClick() {
      if (this.showResult) return;
      
      this.collapse = false
      this.expanse = true
      this.isOpen = true
      
      // 4秒后显示结果
      this.redirectTimer = setTimeout(() => {
        this.generateResult();
      }, 4000)
    },

    generateResult() {
      const randomNum = Math.floor(Math.random() * this.prizeOptions.length);
      this.result = this.prizeOptions[randomNum];
      this.showResult = true;

      // 提交到Vuex store
      this.store.commit('addLotteryHistory', {
        time: new Date().toLocaleString(),
        award: this.result,
      });
    },

    goToResultMan() {
      this.router.push({ name: 'ResultMan' });
    },

    handleMouseOver() {
      if (!this.expanse && !this.showResult) this.collapse = true
    },

    handleMouseOut() {
      if (!this.expanse && !this.showResult) this.collapse = false
    },

    createStar() {
      const rands = []
      rands.push(Math.random() * (this.maxorbit/2) + 1)
      rands.push(Math.random() * (this.maxorbit/2) + this.maxorbit)

      const orbital = (rands.reduce((p, c) => p + c, 0) / rands.length
    )
      const star = {
        orbital,
        x: this.centerx,
        y: this.centery + orbital,
        yOrigin: this.centery + orbital,
        speed: (Math.floor(Math.random() * 2.5) + 1.5)*Math.PI/180,
        rotation: 0,
        startRotation: (Math.floor(Math.random() * 360) + 1)*Math.PI/180,
        id: this.stars.length,
        collapseBonus: orbital - (this.maxorbit * 0.7),
        prevR: 0,
        prevX: 0,
        prevY: 0
      }

      if(star.collapseBonus < 0) {
        star.collapseBonus = 0
      }

      star.color = `rgba(255,255,255,${1 - (orbital / 255)})`
      star.hoverPos = this.centery + (this.maxorbit/2) + star.collapseBonus
      star.expansePos = this.centery + (star.id%100)*-10 + (Math.floor(Math.random() * 20) + 1)
      star.prevR = star.startRotation
      star.prevX = star.x
      star.prevY = star.y

      return star
    },

    drawStar(star) {
      if(!this.expanse) {
        star.rotation = star.startRotation + (this.currentTime * star.speed)
        if(!this.collapse) {
          if(star.y > star.yOrigin) {
            star.y -= 2.5
          }
          if(star.y < star.yOrigin-4) {
            star.y += (star.yOrigin - star.y) / 10
          }
        } else {
          star.trail = 1
          if(star.y > star.hoverPos) {
            star.y -= (star.hoverPos - star.y) / -5
          }
          if(star.y < star.hoverPos-4) {
            star.y += 2.5
          }
        }
      } else {
        star.rotation = star.startRotation + (this.currentTime * (star.speed / 2))
        if(star.y > star.expansePos) {
          star.y -= Math.floor(star.expansePos - star.y) / -140
        }
      }

      this.context.save()
      this.context.fillStyle = star.color
      this.context.strokeStyle = star.color
      this.context.beginPath()
      const oldPos = this.rotate(this.centerx, this.centery, star.prevX, star.prevY, -star.prevR)
      this.context.moveTo(oldPos[0], oldPos[1])
      this.context.translate(this.centerx, this.centery)
      this.context.rotate(star.rotation)
      this.context.translate(-this.centerx, -this.centery)
      this.context.lineTo(star.x, star.y)
      this.context.stroke()
      this.context.restore()

      star.prevR = star.rotation
      star.prevX = star.x
      star.prevY = star.y
    },

    loop() {
      const now = new Date().getTime()
      this.currentTime = (now - this.startTime) / 50

      this.context.fillStyle = 'rgba(25,25,25,0.2)'
      this.context.fillRect(0, 0, this.cw, this.ch)

      for(let i = 0; i < this.stars.length; i++) {
        this.drawStar(this.stars[i])
      }

      this.animationFrameId = requestAnimationFrame(this.loop)
    },

    init() {
      this.startTime = new Date().getTime()
      this.context.fillStyle = 'rgba(25,25,25,1)'
      this.context.fillRect(0, 0, this.cw, this.ch)
      
      for(let i = 0; i < 2500; i++) {
        this.stars.push(this.createStar())
      }
      
      this.loop()
    }
  }
}
</script>

<style scoped>
body, html { 
  height: 100%; 
  margin: 0;
  padding: 0;
}

#blackhole {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  background-color: rgba(25,25,25,1);
}

.centerHover {
  width: 255px;
  height: 255px;
  background-color: transparent;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -128px;
  margin-left: -128px;
  z-index: 2;
  cursor: pointer;
  line-height: 255px;
  text-align: center;
  transition: all 500ms;
}

.centerHover.open {
  opacity: 0;
  pointer-events: none;
}

.centerHover:hover span {
  color: #DDD;
}

.centerHover:hover span::before,
.centerHover:hover span::after {
  background-color: #DDD;
}

.centerHover span {
  color: #666;
  font-family: serif;
  font-size: 18px;
  position: relative;
  transition: all 500ms;
}

.centerHover span::before {
  content: '';
  display: inline-block;
  height: 1px;
  width: 16px;
  margin-right: 12px;
  margin-bottom: 4px;
  background-color: #666;
  transition: all 500ms;
}

.centerHover span::after {
  content: '';
  display: inline-block;
  height: 1px;
  width: 16px;
  margin-left: 12px;
  margin-bottom: 4px;
  background-color: #666;
  transition: all 500ms;
}

canvas {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin: auto;
}

/* 修改后的结果展示样式 - 直接显示白色文字和按钮 */
.result-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.result-title {
  color: white;
  font-size: 30px;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.result-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 12px 40px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  outline: none;
}

.result-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>