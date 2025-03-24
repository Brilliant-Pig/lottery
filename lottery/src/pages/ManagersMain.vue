<template>
    <div class="container">
        <h1>抽奖设置 - 导入参与者信息</h1>
        <input type="file" @change="handleFileUpload" accept=".csv,.xlsx,.xls" />
        <div v-if="fileData">
            <h3>文件预览：</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in fileData" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button @click="importData" :disabled="!fileData">导入数据</button>
        <div v-if="importStatus" class="status">{{ importStatus }}</div>
    </div>
</template>

<script>
import Papa from 'papaparse';
import XLSX from 'xlsx';

export default {
    data() {
        return {
            fileData: null,
            headers: [],
            importStatus: null,
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                if (file.name.endsWith('.csv')) {
                    Papa.parse(data, {
                        header: true,
                        complete: (results) => {
                            this.fileData = results.data;
                            this.headers = Object.keys(results.meta.fields);
                        },
                    });
                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    this.fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    this.headers = this.fileData[0];
                }
            };
            reader.readAsBinaryString(file);
        },
        async importData() {
            try {
                this.importStatus = "正在导入...";
                const response = await this.$axios.post('/api/import', { data: this.fileData });
                this.importStatus = response.data.message || "导入成功！";
            } catch (error) {
                this.importStatus = "导入失败：" + error.message;
            }
        },
    },
};
</script>

<style>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

table {
    width: 100%;
    margin-top: 20px;
}

.status {
    margin-top: 20px;
    color: rgb(30, 125, 249);
}
</style>