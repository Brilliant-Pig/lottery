<template>
<div id="whole">
<div class="login-container">
    <h1>用户登录</h1>
    <form @submit.prevent="handleLogin">
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
    <button type="submit" class="login-btn">登录</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div class="register-link">
    <p>还没有账号？<router-link to="/Register">立即注册</router-link></p>
    </div>
</div>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
    return {
        username: "",
        password: "",
        errorMessage: "",
    };
    },
    methods: {
        ...mapActions(['login']), // 映射 Vuex action
    
        async handleLogin() {
            if (!this.username || !this.password) {
            this.errorMessage = "用户名和密码不能为空！";
            return;
        }

        try {
        // 调用 Vuex 的 login action
            await this.login({
                username: this.username,
                password: this.password
            });
        
        // 登录成功后的操作
        this.errorMessage = "";
        this.$router.push('/LotteryMain'); // 使用路由跳转替代 window.location
        
        } catch (error) {
            this.errorMessage = "用户名或密码错误！";
            console.error('登录失败:', error);
        }
        },
    
        goToRegister() {
            this.$router.push("/Register");
        }
    }
};
</script>

<style scoped>
.login-container {
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
}

.input-group {
margin-bottom: 15px;
font-size: 16px;
}

label {
display: block;
margin-bottom: 10px;
font-weight: bold;
}

input {
width: 100%;
padding: 20px;
border: 1px solid #ccc;
border-radius: 20px;
font-size: 16px;
}

.login-btn {
width: 110%;
padding: 20px;
background-color: #007bff;
color: white;
border: none;
border-radius: 20px;
cursor: pointer;
font-size: 16px;
margin-top: 50px;
}

.login-btn:hover {
background-color: #0056b3;
}

.register-link {
margin-top: 30px;
text-align: center;
}

.register-link a {
color: #007bff;
text-decoration: none;
font-weight: bold;
}

.register-link a:hover {
text-decoration: underline;
}

.error-message {
color: red;
text-align: center;
margin-top: 20px;
font-size: 1.2em;
}
</style>