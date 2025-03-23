<template>
    <div id="PR">
        <span>{{PRe}}</span><span>人</span>
    </div>
</template>

<script>
export default {
    data(){
        return{
            PRe:0,
        }
    },
    props: {
        apiUrl: { 
            type: String, 
            required: true 
        },  // 后端接口地址
        interval: { 
            type: Number, 
            default: 10000 
        }, // 数据更新间隔（默认10秒）
        format: { 
            type: String, 
            default: '' 
        } // 时间格式
    },
    method(){
        const getReal = this.RealRemainder
        
    }
}
</script>

<style>

</style>