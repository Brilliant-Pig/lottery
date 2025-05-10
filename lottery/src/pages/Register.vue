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
            placeholder="请输入用户名（不得少于3个字符）"
            required
        />
        <div class="validation-message">
            <span v-if="isChecking">检查中...</span>
            <span v-if="usernameAvailable" class="success">✓ 用户名可用</span>
            <span v-if="usernameExists" class="error">✗ 用户名已存在</span>
        </div>
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
        <button type="submit" 
        class="register-btn" 
        :disabled="shouldDisableRegisterButton"
        >
            注册
        </button>
    </form>
    <!-- 返回登录链接 -->
    <div class="login-link">
        <p>已有账号？<router-link to="/LoginMain">立即登录</router-link></p>
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
      confirmPassword: "",
      isChecking: false,
      usernameAvailable: false,
      usernameExists: false,
      debounceTimer: null,
      errorMessage: ""
    };
  },
  computed: {
    // 新增计算属性，判断是否应该禁用注册按钮
    shouldDisableRegisterButton() {
      return (
        !this.username || 
        !this.password || 
        !this.confirmPassword || 
        this.password !== this.confirmPassword ||
        this.usernameExists ||
        this.isChecking
      );
    }
  },
  watch: {
    // 添加对username的监听
    username(newVal) {
      if (newVal) {
        this.checkUsernameAvailability();
      }
    }
  },

  methods: {
    ...mapActions(['register']), // 映射 Vuex 的 register action

    checkUsernameAvailability() {
      clearTimeout(this.debounceTimer);
      
      if (this.username.length < 3) {
        this.usernameAvailable = false;
        this.usernameExists = false;
        return;
      }
      
      this.isChecking = true;
      this.debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch('api/auth/checkUsername', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: this.username })
            });
        
            const result = await response.json();
        
         // 根据后端返回的 code 和 data.available 更新状态
            this.usernameAvailable = result.code === 0;
            this.usernameExists = !this.usernameAvailable;
        } catch (error) {
          console.error("检查用户名失败:", error);
        } finally {
          this.isChecking = false;
        }
      }, 500);
    },

    async handleRegister() {
        // 添加用户名可用性检查
      if (this.usernameExists) {
        alert("用户名已存在，请更换其他用户名");
        return;
      }

      // 1. 基础验证（保持原有验证逻辑）
      if (!this.username || !this.password || !this.confirmPassword) {
        alert("所有字段都必须填写！"); // 保持 alert 提示
        return;
      }
      if (this.password !== this.confirmPassword) {
        alert("两次输入的密码不一致！");
        return;
      }

      try {
        // 2. 调用 Vuex action 提交注册
        await this.register({
          username: this.username,
          password: this.password
        });

        // 3. 注册成功处理（保持原有跳转逻辑）
        alert("注册成功！");
        this.$router.push("/LoginMain"); 

      } catch (error) {
        // 4. 错误处理（复用 errorMessage 显示后端错误）
        this.errorMessage = error.message || "注册失败";
        alert(this.errorMessage); // 保持 alert 形式
      }
    },

    // 保留原有 goToLogin 方法
    goToLogin() {
      this.$router.push("/");
    }
  }
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
    color: #28a745;
}

.input-group {
    margin-bottom: 15px;
    font-size: 1.4em;
}

label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: #ccc;
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

.validation-message {
  height: 20px;
  margin-top: 5px;
  font-size: 14px;
}
.success {
  color: #28a745;
}
.error {
  color: #dc3545;
}

.register-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>