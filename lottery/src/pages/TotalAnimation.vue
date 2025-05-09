<template>
    <div id="blackhole" ref="blackhole">
        <div class="centerHover" :class="{ open: isOpen || showResult }" @click="handleClick"
            @mouseover="handleMouseOver" @mouseout="handleMouseOut">
            <span>{{ currentButtonText }}</span>
        </div>
        <canvas ref="canvas"></canvas>

        <!-- 分阶段显示抽奖结果 -->
        <div v-if="showResult" class="result-container">
            <div class="result-box">
                <h1 class="result-title">{{ currentPrize.level }} ({{ currentPrize.name }})</h1>
                <div class="winner-list">
                    <div v-for="(winner, i) in currentWinners" :key="i" class="winner-item">
                        <span class="winner-rank">{{ i + 1 }}.</span>
                        <span class="winner-name">{{ winner }}</span>
                    </div>
                    <div v-if="!currentWinners.length" class="no-winner">暂无中奖者</div>
                </div>
                <button v-if="showContinueButton" @click="nextPrize" class="continue-btn">
                    {{ currentStage < prizes.length - 1 ? '继续' : '导出全部结果(xlxs)' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
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
            showResult: false,
            result: '',
            prizes: [],
            winners: {},
            participantList: [],
            lotteryInfo: {},
            currentStage: -1,
            currentPrize: {},
            currentWinners: [],
            currentButtonText: 'ENTER',
            showContinueButton: false,
            isContinueFading: false,
            continueTimer: null,
            fadeTimer: null,
            isAnimating: false
        }
    },
    created() {
        // 优先从 Vuex 获取数据
        const lotteryData = this.store.state.lotteryData || this.$route.params.lotteryData;
        
        if (!lotteryData) {
            console.error('未找到抽奖数据');
            return this.router.back();
        }

        this.lotteryInfo = lotteryData.lotteryInfo || {};
        this.prizes = lotteryData.prizes || [];
        this.participantList = lotteryData.participantList || [];

        // 按奖项等级排序
        this.prizes.sort((a, b) => {
            const levelMap = { '一等奖': 1, '二等奖': 2, '三等奖': 3, '四等奖': 4, '五等奖': 5, '六等奖': 6 };
            return levelMap[a.level] - levelMap[b.level];
        });

        console.log('初始化数据:', {
            prizes: this.prizes,
            participants: this.participantList
        });
    },
    mounted() {
        this.initCanvas();
        this.init();
        
        if (process.env.NODE_ENV === 'development' && this.prizes.length === 0) {
            this.prizes = [
                { level: '一等奖', name: 'iPhone 15', quantity: 1 },
                { level: '二等奖', name: 'AirPods Pro', quantity: 3 },
                { level: '三等奖', name: '充电宝', quantity: 5 }
            ];
            this.participantList = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
        }
    },
    beforeUnmount() {
        cancelAnimationFrame(this.animationFrameId);
        clearTimeout(this.redirectTimer);
        clearTimeout(this.continueTimer);
        clearTimeout(this.fadeTimer);
    },
    methods: {
        initCanvas() {
            const element = this.$refs.blackhole;
            this.h = element.offsetHeight;
            this.w = element.offsetWidth;
            this.cw = this.w;
            this.ch = this.h;
            this.centery = this.ch / 2;
            this.centerx = this.cw / 2;

            const canvas = this.$refs.canvas;
            canvas.width = this.cw;
            canvas.height = this.ch;
            this.context = canvas.getContext("2d");
            this.context.globalCompositeOperation = "multiply";
            this.setDPI(canvas, 192);
        },
        setDPI(canvas, dpi) {
            if (!canvas.style.width)
                canvas.style.width = canvas.width + 'px';
            if (!canvas.style.height)
                canvas.style.height = canvas.height + 'px';

            const scaleFactor = dpi / 96;
            canvas.width = Math.ceil(canvas.width * scaleFactor);
            canvas.height = Math.ceil(canvas.height * scaleFactor);
            const ctx = canvas.getContext('2d');
            ctx.scale(scaleFactor, scaleFactor);
        },
        rotate(cx, cy, x, y, angle) {
            const radians = angle;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
            const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
            return [nx, ny];
        },
        handleClick() {
            if (this.showResult || this.isAnimating) return;

            if(this.currentStage === -1) {
                this.currentStage = 0;
                this.startLotteryAnimation();
            } else if(this.currentStage < this.prizes.length) {
                this.startLotteryAnimation();
            }
        },
        startLotteryAnimation() {
            this.isAnimating = true;
            this.collapse = false;
            this.expanse = true;
            this.isOpen = true;
            this.currentButtonText = '开奖中...';
            
            setTimeout(() => {
                this.expanse = false;
                this.isOpen = false;
                this.collapse = true;
                
                setTimeout(() => {
                    this.generateResult();
                    this.isAnimating = false;
                }, 1000);
            }, 1000);
        },
    generateResult() {
    if (this.currentStage >= this.prizes.length) {
      this.goToResultMan();
      return;
    }

    const prize = this.prizes[this.currentStage];
    this.currentPrize = prize;
    
    // 初始化该奖项的中奖者数组
    this.winners[prize.level] = [];
    
    // 复制参与者名单以避免修改原数组
    const availableParticipants = [...this.participantList];
    
    // 抽奖逻辑 - 确保不会重复中奖
    const drawCount = Math.min(prize.quantity, availableParticipants.length);
    for (let i = 0; i < drawCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[randomIndex];
      
      this.winners[prize.level].push(winner);
      availableParticipants.splice(randomIndex, 1); // 移除已中奖者
    }

    // 更新当前显示的中奖者
    this.currentWinners = [...this.winners[prize.level]];
    this.showResult = true;
    
    // 更新按钮文本
    if (this.currentStage < this.prizes.length - 1) {
      this.currentButtonText = `继续抽取${this.prizes[this.currentStage + 1].level}`;
    } else {
      this.currentButtonText = '已抽完';
    }
    
    this.showContinueButton = true;
    },
/*     exportResults() {
        // 准备数据
        const data = [];
        for (const [level, winners] of Object.entries(this.winners)) {
        // 根据奖项等级找到对应的奖品
        const prize = this.prizes.find(p => p.level === level);
            winners.forEach((winner, index) => {
                data.push({
                    奖项: level,
                    奖品名称: prize ? prize.name : '未设置奖品', // 添加奖品名称
                    中奖者: winner,
                });
            });
        }

        // 创建工作簿和工作表
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖结果');

        // 导出文件
        const fileName = `${this.lotteryInfo.name || '抽奖结果'}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }, */
        nextPrize() {
            clearTimeout(this.continueTimer);
            clearTimeout(this.fadeTimer);
            
            this.showContinueButton = false;
            this.showResult = false;
            this.currentStage++;
            
            if (this.currentStage >= this.prizes.length) {
                this.goToResultMan();
                return;
            }
            
            this.currentButtonText = 'ENTER';
            this.collapse = false;
            this.expanse = false;
            this.isOpen = false;
        },
        goToResultMan() {
            this.store.commit('saveLotteryResult', {
                lotteryInfo: this.lotteryInfo,
                prizes: this.prizes,
                winners: this.winners,
            });
        // 准备数据
        const data = [];
        for (const [level, winners] of Object.entries(this.winners)) {
        // 根据奖项等级找到对应的奖品
        const prize = this.prizes.find(p => p.level === level);
            winners.forEach((winner, index) => {
                data.push({
                    奖项: level,
                    名称: index + 1,
                    奖品名称: prize ? prize.name : '未设置奖品', // 添加奖品名称
                    中奖者: winner,
                });
            });
        }

        // 创建工作簿和工作表
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖结果');

        // 导出文件
        const fileName = `${this.lotteryInfo.name || '抽奖结果'}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        },
        handleMouseOver() {
            if (!this.expanse && !this.showResult && !this.isAnimating) this.collapse = true;
        },
        handleMouseOut() {
            if (!this.expanse && !this.showResult && !this.isAnimating) this.collapse = false;
        },
        createStar() {
            const rands = [];
            rands.push(Math.random() * (this.maxorbit / 2) + 1);
            rands.push(Math.random() * (this.maxorbit / 2) + this.maxorbit);

            const orbital = (rands.reduce((p, c) => p + c, 0) / rands.length);
            const star = {
                orbital,
                x: this.centerx,
                y: this.centery + orbital,
                yOrigin: this.centery + orbital,
                speed: (Math.floor(Math.random() * 2.5) + 1.5) * Math.PI / 180,
                rotation: 0,
                startRotation: (Math.floor(Math.random() * 360) + 1) * Math.PI / 180,
                id: this.stars.length,
                collapseBonus: orbital - (this.maxorbit * 0.7),
                prevR: 0,
                prevX: 0,
                prevY: 0
            };

            if (star.collapseBonus < 0) {
                star.collapseBonus = 0;
            }

            star.color = `rgba(255,255,255,${1 - (orbital / 255)})`;
            star.hoverPos = this.centery + (this.maxorbit / 2) + star.collapseBonus;
            star.expansePos = this.centery + (star.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1);
            star.prevR = star.startRotation;
            star.prevX = star.x;
            star.prevY = star.y;

            return star;
        },
        drawStar(star) {
            if (!this.expanse) {
                star.rotation = star.startRotation + (this.currentTime * star.speed);
                if (!this.collapse) {
                    if (star.y > star.yOrigin) {
                        star.y -= 2.5;
                    }
                    if (star.y < star.yOrigin - 4) {
                        star.y += (star.yOrigin - star.y) / 10;
                    }
                } else {
                    star.trail = 1;
                    if (star.y > star.hoverPos) {
                        star.y -= (star.hoverPos - star.y) / -5;
                    }
                    if (star.y < star.hoverPos - 4) {
                        star.y += 2.5;
                    }
                }
            } else {
                star.rotation = star.startRotation + (this.currentTime * (star.speed / 2));
                if (star.y > star.expansePos) {
                    star.y -= Math.floor(star.expansePos - star.y) / -140;
                }
            }

            this.context.save();
            this.context.fillStyle = star.color;
            this.context.strokeStyle = star.color;
            this.context.beginPath();
            const oldPos = this.rotate(this.centerx, this.centery, star.prevX, star.prevY, -star.prevR);
            this.context.moveTo(oldPos[0], oldPos[1]);
            this.context.translate(this.centerx, this.centery);
            this.context.rotate(star.rotation);
            this.context.translate(-this.centerx, -this.centery);
            this.context.lineTo(star.x, star.y);
            this.context.stroke();
            this.context.restore();

            star.prevR = star.rotation;
            star.prevX = star.x;
            star.prevY = star.y;
        },
        loop() {
            const now = new Date().getTime();
            this.currentTime = (now - this.startTime) / 50;

            this.context.fillStyle = 'rgba(25,25,25,0.2)';
            this.context.fillRect(0, 0, this.cw, this.ch);

            for (let i = 0; i < this.stars.length; i++) {
                this.drawStar(this.stars[i]);
            }

            this.animationFrameId = requestAnimationFrame(this.loop);
        },
        init() {
            this.startTime = new Date().getTime();
            this.context.fillStyle = 'rgba(25,25,25,1)';
            this.context.fillRect(0, 0, this.cw, this.ch);

            for (let i = 0; i < 2500; i++) {
                this.stars.push(this.createStar());
            }

            this.loop();
        }
    }
}
</script>

<style scoped>
body,
html {
    height: 100%;
    margin: 0;
    padding: 0;
}

#blackhole {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    background-color: rgba(25, 25, 25, 1);
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

.result-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(80vw, 600px);
    z-index: 10;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -40%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
}

.result-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
    border-radius: 12px;
    padding: 20px;
    color: white;
    box-sizing: border-box;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}

.result-title {
    margin: 0 0 15px 0;
    font-size: 24px;
    text-align: center;
    flex-shrink: 0;
    color: #4dc3d7;
    text-shadow: 0 0 10px rgba(77, 195, 215, 0.7);
}

.winner-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
}

.winner-item {
    display: flex;
    align-items: center;
}

.winner-rank {
    color: #3abd92;
    margin-right: 5px;
    font-weight: bold;
}

.winner-name {
    font-size: 16px;
    margin: 8px 0;
    padding: 8px;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.no-winner {
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.continue-btn {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 8px 25px;
    border-radius: 20px;
    margin-top: 20px;
    align-self: center;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
</style>