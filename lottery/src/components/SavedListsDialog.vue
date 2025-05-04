<!-- src/components/SavedListsDialog.vue -->
<template>
    <dialog ref="dialog" class="saved-lists-dialog">
        <div class="dialog-header">
            <h3>选择已有名单</h3>
            <button @click="close" class="close-btn">&times;</button>
        </div>
        <div class="dialog-body">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else>
                <div v-if="lists.length === 0" class="no-lists">没有找到保存的名单</div>
                <ul v-else class="lists-container">
                    <li v-for="list in lists" :key="list.id" @click="select(list)"
                        :class="{ selected: selectedList && selectedList.id === list.id }">
                        <div class="list-name">{{ list.name }}</div>
                        <div class="list-meta">
                            <span>人数: {{ list.count }}</span>
                            <span>创建时间: {{ formatDate(list.createdAt) }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="dialog-footer">
            <button @click="confirm" class="confirm-btn" :disabled="!selectedList">确认选择</button>
        </div>
    </dialog>
</template>

<script>
export default {
    props: {
        loading: Boolean,
        lists: Array
    },
    data() {
        return {
            selectedList: null
        }
    },
    methods: {
        open() {
            this.$refs.dialog.showModal()
        },
        close() {
            this.$refs.dialog.close()
        },
        select(list) {
            this.selectedList = list
        },
        confirm() {
            this.$emit('confirm', this.selectedList)
            this.close()
        },
        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString()
        }
    }
}
</script>

<style scoped>
.saved-lists-dialog {
    width: 80%;
    max-width: 600px;
    border: none;
    border-radius: 8px;
    padding: 0;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
}

.dialog-body {
    padding: 15px;
    max-height: 60vh;
    overflow-y: auto;
}

.lists-container {
    list-style: none;
    padding: 0;
    margin: 0;
}

.lists-container li {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.lists-container li:hover {
    background-color: #f5f5f5;
}

.lists-container li.selected {
    background-color: #e1f5fe;
}

.list-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.list-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #666;
}

.dialog-footer {
    padding: 15px;
    text-align: right;
    border-top: 1px solid #eee;
}

.confirm-btn {
    padding: 8px 16px;
    background-color: #51c9a1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>