<template>
    <div class="share-lottery">
        <h1>分享抽奖</h1>

        <!-- 显示实际参与的人数 -->
        <div v-if="participantCount !== null" style="margin-top: 20px;">
            <h3>实际参与人数：</h3>
            <p>{{ participantCount }}</p>
        </div>

        <!-- 按钮组 -->
        <div class="button-group" style="margin-top: 20px;">
            <button @click="triggerGenerate">生成</button>
            <button @click="triggerShare" :disabled="!generated">分享</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            generated: false, // 标记是否已生成分享URL
            participantCount: null // 实际参与人数
        };
    },
    methods: {
        // 触发生成分享URL的操作（实际逻辑在后端）
        triggerGenerate() {
            this.generated = true;
            // 这里可以添加调用后端API生成分享URL的逻辑
            // 示例伪代码:
            /*
            axios.post('/api/generate-share-url')
              .then(response => {
                console.log('Generated share URL:', response.data);
              })
              .catch(error => {
                console.error('Error generating share URL:', error);
                this.generated = false; // 如果生成失败，重置状态
              });
            */
        },
        // 触发分享操作（实际逻辑在后端）
        triggerShare() {
            if (!this.generated) return;
            // 这里可以添加调用后端API进行分享的逻辑
            // 示例伪代码:
            /*
            axios.post('/api/share-url', { url: 'your-generated-url' })
              .then(response => {
                console.log('Shared successfully:', response.data);
                alert('分享链接已发送！');
              })
              .catch(error => {
                console.error('Error sharing URL:', error);
              });
            */
        },
        // 假设这是从后端或其他地方获取参与人数的方法
        fetchParticipantCount() {
            // 示例伪代码:
            /*
            axios.get('/api/participant-count')
              .then(response => {
                this.participantCount = response.data.count;
              })
              .catch(error => {
                console.error('Error fetching participant count:', error);
              });
            */
            // 为了演示目的，这里直接赋值
            this.participantCount = 100; // 假设实际参与人数为100
        }
    },
    mounted() {
        // 在组件挂载完成后获取参与人数
        this.fetchParticipantCount();
    }
};
</script>

<style scoped>
.share-lottery {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1 {
    margin-bottom: 20px;
}

.button-group {
    display: flex;
    justify-content: center;
    /* 居中对齐 */
    gap: 10px;
    /* 按钮之间的间距 */
}

button {
    padding: 8px 12px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #bbb;
}

button:hover:not(:disabled) {
    background-color: #35495e;
}
</style>