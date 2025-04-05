<template>
    <div class="register-container">
    <h1>用户注册</h1>
    <!-- 注册表单 -->
    <form @submit.prevent="handleRegister">
        <div class="input-group">
        <label for="username">用户名：</label>
        <input
            type="text"
            id="username"
            v-model="username"
            placeholder="请输入用户名"
            required
        />
        </div>
        <div class="input-group">
        <label for="password">密码：</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
            required
        />
        </div>
        <div class="input-group">
        <label for="confirmPassword">确认密码：</label>
        <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="请再次输入密码"
            required
        />
        </div>
        <button type="submit" class="register-btn">注册</button>
    </form>
    <!-- 返回登录链接 -->
    <div class="login-link">
        <p>已有账号？<router-link to="/LoginMain">立即登录</router-link></p>
    </div>
    </div>
</template>

<script>
export default {
    data() {
    return {
        username: "",
        password: "",
        confirmPassword: "",
    };
    },
    methods: {
      // 处理注册逻辑
    handleRegister() {
        if (!this.username || !this.password || !this.confirmPassword) {
        alert("所有字段都必须填写！");
        return;
        }
        if (this.password !== this.confirmPassword) {
        alert("两次输入的密码不一致！");
        return;
        }
        // 模拟注册成功
        alert("注册成功！");
        this.$router.push("/"); // 跳转回登录页面
    },
      // 返回登录页面
    goToLogin() {
        this.$router.push("/"); // 跳转到登录页面
    },
    },
};
</script>

<style scoped>
.register-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 80px;
    border: 1px solid #ccc;
    border-radius: 8px;
    border: none;
}

h1 {
    text-align: center;
    margin-bottom: 60px;
    color: #555;
}

.input-group {
    margin-bottom: 15px;
    font-size: 1.4em;
}

label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: #555;
}

input {
    width: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 16px;
}

.register-btn {
    width: 110%;
    padding: 20px;
    background-color: #28a745; 
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease-in-out;
    margin-top: 50px;
}

.register-btn:hover {
    background-color: #218838; 
}

.login-link {
    margin-top: 30px;
    text-align: center;
}

.login-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>