    <template>
        <div class="user-manual">
        <!-- 顶部导航 -->
        <nav class="manual-nav">
            <a v-for="link in navLinks" 
            :key="link.anchor"
            :href="'#'+link.anchor" 
            @click.prevent="scrollTo(link.anchor)">
            {{ link.text }}
            </a>
        </nav>
        <!-- 内容容器 -->
        <div class="manual-content">
            <!-- 快速入门 -->
            <section id="快速入门" class="manual-section">
            <h1>快速入门指南</h1>
    <!-- 注册登录模块 -->
    <section id="注册登录">
        <h2>一、注册与登录</h2>
        
        <!-- 新用户注册部分添加按钮 -->
        <div class="auth-section">
            <h3>1. 新用户注册</h3>
            <ul>
            <li>点击「📧 邮箱/手机注册」</li>
            <li>输入邮箱/手机号并设置密码（8-16位字符）</li>
            <li>完成验证：
                <ul>
                <li>邮箱用户：查收激活邮件并点击验证链接</li>
                <li>手机用户：输入短信验证码</li>
                </ul>
            </li>
            </ul>
            <button 
            class="black-border-button"
            @click="handleAuthActionone('register')">
            🚀 立即注册
            </button>
        </div>

        <!-- 已有账号登录部分添加按钮 -->
        <div class="auth-section">
            <h3>2. 已有账号登录</h3>
            <ul>
            <li><strong>密码登录</strong>：输入注册邮箱/手机 + 密码</li>
            <li><strong>第三方登录</strong>：点击「🌐 微信/Google」图标快速授权</li>
            <li><strong>忘记密码</strong>：通过注册邮箱重置密码</li>
            </ul>
            <button 
            class="black-border-button"
            @click="handleAuthActiontwo('login')">
            🔑 立即登录
            </button>
        </div>
        </section>

        <!-- 创建抽奖模块添加按钮 -->
        <section id="创建抽奖">
        <h2>二、创建抽奖活动</h2>
        <div class="creation-section">
            <button 
            class="black-border-button"
            @click="handleCreateAction">
            🎯 开始创建抽奖
            </button>
        </div>
        </section>

<!-- 参与流程模块 -->
<section>
    <h2>三、参与抽奖流程</h2>
    <table class="process-table">
        <tr>
        <th>方式</th>
        <th>操作步骤</th>
        </tr>
        <tr>
        <td>名单用户</td>
        <td>
            1. 收到系统通知<br>
            2. 点击确认参与
        </td>
        </tr>
        <tr>
        <td>链接用户</td>
        <td>
        1. 打开分享链接<br>
        2. 点击立即参与
        </td>
        </tr>
    </table>
    </section>

    <!-- 注意事项模块 -->
    <section class="warning-section">
    <h2>⚠️ 注意事项</h2>
    <ul>
        <li v-for="(item, index) in warnings" :key="index">
        {{ item }}
        </li>
    </ul>
</section>
</section>
            <!-- 全流程操作指南 -->
            <section id="全流程操作指南" class="manual-section">
            <h1>操作流程图解</h1>
            <div class="flow-guides">
                <div class="user-flow">
                <h2>终端用户流程</h2>
                <div class="mermaid-diagram">
                    <img style="width: 100%;" src="../assets/终端用户流程.png" alt="用户流程图" />
                    <UserJourney />
                </div>
                </div>
                
                <div class="admin-flow">
                <h2>管理员流程</h2>
                <div class="mermaid-diagram">
                    <img style="width: 100%;" src="../assets/管理员流程.png" alt="管理员流程图" />
                    <AdminSequence />
                </div>
                </div>
            </div>
            </section>
            <!-- 角色权限说明 -->
            <section id="角色权限说明" class="manual-section">
            <h1>角色权限矩阵</h1>
            <table class="role-matrix">
                <thead>
                <tr>
                    <th>权限项</th>
                    <th>普通用户</th>
                    <th>活动管理员</th>
                    <th>系统管理员</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(perm, index) in permissions" :key="index">
                    <td>{{ perm.name }}</td>
                    <td>{{ perm.user }}</td>
                    <td>{{ perm.manager }}</td>
                    <td>{{ perm.admin }}</td>
                </tr>
                </tbody>
            </table>
            </section>
            <!-- 系统架构 -->
            <section id="系统架构" class="manual-section">
            <h1>系统架构</h1>
            
            <div class="tech-stack">
                <h2>技术栈组成</h2>
                <div class="mermaid-diagram">
                <img style="width: 100%;" src="../assets/architecture.png" alt="系统架构图" />
                <TechStackDiagram />
                </div>
            </div>
    
            <div class="deploy-arch">
                <h2>部署架构</h2>
                <table class="deploy-table">
                <thead>
                    <tr>
                    <th>组件</th>
                    <th>规格要求</th>
                    <th>高可用方案</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in deployArch" :key="index">
                    <td>{{ item.component }}</td>
                    <td>{{ item.spec }}</td>
                    <td>{{ item.solution }}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </section>
    

    
    
            <!-- 系统概述增强 -->
            <section id="系统概述" class="manual-section">
            <h1>核心功能概述</h1>
            <div class="overview-grid">
                <div v-for="(feat, index) in features" 
                    :key="index" 
                    class="feature-card">
                <span class="icon">{{ feat.icon }}</span>
                <h3>{{ feat.title }}</h3>
                <p>{{ feat.desc }}</p>
                </div>
    
                <!-- 安全认证增强 -->
                <div class="feature-card security-card">
                <span class="icon">🔒</span>
                <h3>安全认证体系</h3>
                
                <div class="%">
        <!-- 新增详细说明 -->
    <div class="security-details">
        <h4>详细说明</h4>
        <div class="detail-section">
        <h5>1. 多因素认证（MFA）</h5>
        <p>
            系统采用基于时间的一次性密码（TOTP）算法，支持以下认证方式：
            <ul>
            <li>短信验证码：通过运营商通道实时发送</li>
            <li>邮箱验证：支持自定义发件服务器配置</li>
            <li>身份验证器：兼容Google Authenticator等标准协议</li>
            </ul>
        </p>
        </div>

        <div class="detail-section">
        <h5>2. 密码强度检测</h5>
        <p>
            实时密码强度评估算法：
            <pre><code>function checkPasswordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score >= 3; // 需满足至少3个条件
    }</code></pre>
        </p>
        </div>

        <div class="detail-section">
        <h5>3. 风险控制机制</h5>
        <p>
            实时风险评分模型：
            <table class="risk-table">
            <thead>
                <tr>
                <th>风险因素</th>
                <th>权重</th>
                <th>检测方法</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>异地登录</td>
                <td>30%</td>
                <td>IP地理位置分析</td>
                </tr>
                <tr>
                <td>设备变更</td>
                <td>25%</td>
                <td>设备指纹比对</td>
                </tr>
                <tr>
                <td>异常时间</td>
                <td>20%</td>
                <td>用户行为基线</td>
                </tr>
                <tr>
                <td>频繁失败</td>
                <td>25%</td>
                <td>登录尝试计数</td>
                </tr>
            </tbody>
            </table>
        </p>
        </div>

        <div class="detail-section">
        <h5>4. 会话管理</h5>
        <p>
            采用JWT（JSON Web Token）实现无状态认证：
            <ul>
            <li>有效期：默认2小时</li>
            <li>刷新机制：支持静默续期</li>
            <li>安全特性：支持吊销列表（Blacklist）</li>
            </ul>
        </p>
        </div>
    </div>
                    <SecurityFlow />
                </div>
    
                <div class="security-policy">
                    <h4>密码安全策略</h4>
                    <ul>
                    <li v-for="(policy, index) in passwordPolicies" :key="index">
                        {{ policy }}
                    </li>
                    </ul>
                </div>
    
                <div class="auth-levels">
                    <h4>认证层级说明</h4>
                    <table>
                    <thead>
                        <tr>
                        <th>安全层级</th>
                        <th>技术实现</th>
                        <th>触发条件</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(level, index) in authLevels" :key="index">
                        <td>{{ level.name }}</td>
                        <td>{{ level.tech }}</td>
                        <td>{{ level.condition }}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
    
            </section>
    

    
            <!-- 动态内容加载 -->
            <component 
            v-for="(section, index) in dynamicSections"
            :key="index"
            :is="section.component"
            v-bind="section.props"/>
        </div>
        </div>
    </template>
    
    <script>
    const TechStackDiagram = {
        template: `
        <div class="mermaid">
            graph TB
            subgraph 前端
                A[Vue3] --> B[Vite]
                A --> C[Element Plus]
                A --> D[ECharts]
            end
            subgraph 后端
                E[Spring Boot] --> F[MySQL]
                E --> G[Redis]
                E --> H[RabbitMQ]
            end
            A -->|API调用| E
        </div>
        `,
        mounted() {
        if (typeof mermaid !== 'undefined') {
            mermaid.init({}, this.$el)
        }
        }
    }
    
    const UserJourney = {
        template: `
        <div class="mermaid">
            journey
            title 用户参与流程
            section 注册登录
                输入手机号 --> 获取验证码 --> 设置密码 --> 完成注册
            section 参与抽奖
                浏览活动 --> 查看规则 --> 实名认证 --> 提交参与 --> 等待开奖
            section 结果处理
                查看结果 --> 填写收货地址 --> 等待发货 --> 确认收货
        </div>
        `,
        mounted() {
        if (typeof mermaid !== 'undefined') {
            mermaid.init({}, this.$el)
        }
        }
    }
    
    const SecurityFlow = {
        template: `
        <div class="mermaid">
            graph TD
            A[用户注册] --> B[密码强度检测]
            B --> C{符合要求?}
            C -->|是| D[多因素认证]
            C -->|否| E[强制密码重置]
            D --> F[登录成功]
        </div>
        `,
        mounted() {
        if (typeof mermaid !== 'undefined') {
            mermaid.init({}, this.$el)
        }
        }
    }
    
    export default {
        components: {
        TechStackDiagram,
        UserJourney,
        SecurityFlow
        },
        
        data() {
        return {
            warnings: [
        '文件模式最多支持5000人参与',
        '时间修改需在活动开始前1小时完成',
        '每个账号仅可参与1次',
        '推荐使用Chrome/Edge最新版浏览器'
        ],
            architectureImg: '../assets/architecture.png',  
            navLinks: [
            { text: '快速入门', anchor: '快速入门' },
            { text: '操作流程', anchor: '全流程操作指南' },
            { text: '角色权限', anchor: '角色权限说明' },
            { text: '系统架构', anchor: '系统架构' },
            { text: '系统概述', anchor: '系统概述' }
            ],
            deployArch: [
            {component: 'Web服务器', spec: '4核8G/100G SSD', solution: 'Nginx集群+Keepalived'},
            {component: '数据库', spec: '8核16G/500G SSD', solution: 'SQLite主从复制'},
            {component: '缓存服务', spec: '4核8G/50G SSD', solution: 'Redis哨兵模式'},
            {component: '消息队列', spec: '4核8G/100G HDD', solution: 'RabbitMQ镜像队列'}
            ],
            permissions: [
            {name: '创建抽奖', user: '✓', manager: '✓', admin: '✓'},
            {name: '修改规则', user: '✗', manager: '✓', admin: '✓'},
            {name: '查看数据', user: '仅自己', manager: '全部', admin: '全部'},
            {name: '导出结果', user: '✗', manager: '✓', admin: '✓'},
            {name: '系统配置', user: '✗', manager: '✗', admin: '✓'}
            ],
            features: [
            { icon: '📋', title: '多模式创建', desc: '支持名单导入和公开链接两种模式' },
            { icon: '📊', title: '数据可视化', desc: '实时参与数据监控与分析' },
            { icon: '🛡️', title: '安全体系', desc: '多层级认证与反作弊机制' }
            ],
            passwordPolicies: [
            '8位以上字符组合（大小写字母+数字+特殊符号）',
            '密码错误3次后启用图形验证码',
            '支持定期强制更换密码（默认90天）'
            ],
            authLevels: [
            { name: '基础认证', tech: '密码登录', condition: '日常访问' },
            { name: '增强认证', tech: '短信/邮箱验证码', condition: '新设备登录' },
            { name: '高级认证', tech: '生物识别', condition: '敏感操作' }
            ],
            quickSteps: [
            { 
                title: '注册账号', 
                desc: '使用邮箱或第三方登录', 
                action: 'showRegister',
                actionText: '立即注册'
            },
            { 
                title: '创建活动', 
                desc: '配置抽奖规则和奖项', 
                action: 'createLottery',
                actionText: '开始创建'
            }
            ]
        }
        },
        methods: {
        scrollTo(anchor) {
            const el = document.getElementById(anchor)
            if (el) el.scrollIntoView({behavior: 'smooth'})
        },
        handleStepAction(action) {
            switch(action) {
            case 'showRegister':
                this.$emit('show-auth-modal')
                break
            case 'createLottery':
                this.$router.push('/create')
                break
            }
        },
    handleAuthActiontwo(type) {
        this.$emit('show-auth-modal', type);
        this.$router.push('./LoginMain');
    },
    handleAuthActionone(type) {
        this.$emit('show-auth-modal', type);
        this.$router.push('./Register');
    },
    handleCreateAction() {
        this.$router.push('./ManagersMain');
    }
        }
    }
    </script>
    
    <style lang="scss" scoped>
.user-manual {
    max-width: auto;
    margin:auto;
    position: relative;
    /* 顶部导航 */
    .manual-nav {
        position: sticky;
        top: 0;
        padding: 1rem;
        background:linear-gradient(to right,#6565655c 0%,#6565651a);
        box-shadow: 0 -2px 8px rgba(90, 90, 90, 0.547);       
        z-index: 100;   
        /* 顶部导航文字 */
        a {
            margin-right: 2rem;
            cursor: pointer;
            transition: color 0.3s;
            
            &:hover {
            color: #ffffff;
            }
        }
        }
/* 黑色边框按钮样式 */
.black-border-button {
    border: 2px solid #c6c6c6 !important;
    color: #000000ba;
    padding: 12px 24px;
    margin: 1rem 0;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
}
/* 快速入门 */
.manual-section {
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    h1 {
    color: #ffffff;
    border-bottom: 2px solid #acacacc2;
    padding-bottom: 0.5rem;
    }

    h2 {
    color: #ffffff;
    margin-top: 2rem;
    }

    h3 {
    color: #ffffff;
    }
/* 参与流程模块 */
table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
    /* 参与流程文字 */
    th, td {
        padding: 12px;
        border: 1px solid #eee;
        color: white;
        text-align: left;
    }

    th {
        background:linear-gradient(to right,#6565655c 0%,#6565651a);
        font-weight: 600;
        }
}
    /* 实时密码评估预算 */
    pre {
    background: #f8f8f8;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    margin: 1rem 0;}
        }
    /* 核心功能概述 */
        .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
        }
    /* 核心功能概述卡片 */
        .feature-card {
        padding: 1.5rem;
        border: 1px solid #eee;
        border-radius: 8px;
        transition: transform 0.3s;
        color: #ffffffed;
        .quickstart-steps {
    .step-card {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;

        .step-content {
        flex: 1;

        h3 {
            color: #2c3e50;
            margin-bottom: 0.8rem;
        }

        p {
            color: #666;
            line-height: 1.6;
        }
        }
    }
    }

        .icon {
            font-size: 2.5rem;
            display: block;
            margin-bottom: 1rem;
        }
    
        &.security-card {
            grid-column: 1 / -1;
            padding: 2rem;
    
            .mermaid-diagram {
            margin: 1.5rem 0;
            min-height: 300px;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            }
    
            .security-policy {
            margin: 2rem 0;
            padding: 1.5rem;
            background:linear-gradient(to right,#6565655c 0%,#6565651a);
            box-shadow: 0 -2px 8px rgba(255, 255, 255, 0.123);
            border-radius: 8px; 
            color: white;
            h4 {
                margin-bottom: 1rem;
            }
    
            ul {
                padding-left: 1.5rem;
                li {
                margin: 0.8rem 0;
                line-height: 1.6;
                }
            }
            }
    
            .auth-levels {
            table {
                th {
                    background:none
                }
            }
            }
        }
        }
    
        .flow-guides {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(800px, 1fr));
        }
    
        .mermaid-diagram {
        margin: 2rem 0;
        overflow-x: auto;
        background: #ffffff;
        padding: 1rem;
        border-radius: 8px;
    
        .label {
            font-family: inherit !important;
        }
        }
    
        @media (max-width: 768px) {
        .manual-nav {
            overflow-x: auto;
            white-space: nowrap;
        }
    
        .deploy-table,
        .role-matrix,
        .auth-levels table {
            display: block;
            overflow-x: auto;
        }
    
        .feature-card.security-card {
            padding: 1rem;
        }
        }
    }
    .security-card{
        background:linear-gradient(to right,#6565655c 0%,#6565651a);
        box-shadow: 0 -2px 8px rgba(255, 255, 255, 0.123);
        color: white;
    }
    .security-details {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 8px;

    h4 {
        color: white;
        margin-bottom: 1.5rem;
    }

    .detail-section {
        margin-bottom: 2rem;

        h5 {
        color: white;
        margin-bottom: 0.8rem;
        }

        p {
        line-height: 1.8;
        margin-bottom: 1rem;
        }

        ul {
        padding-left: 2rem;
        margin: 1rem 0;

        li {
            margin: 0.5rem 0;
        }
        }

        pre {
        background: #ffffff00;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin: 1rem 0;
        font-size: 16px;
        }

        .risk-table {
        width: 100%;
        margin: 1rem 0;

        th, td {
            padding: 12px;
            border: 1px solid #dee2e6;
            background: none;
        }
        }
    }
    }
    .code-block {
    background: #f6f8fa;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    }

    .process-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    }

    .process-table th,
    .process-table td {
    border: 1px solid #e2e8f0;
    padding: 0.8rem;
    }

    .warning-section {
    background:linear-gradient(to right,#6565655c 0%,#6565651a);
    padding: 1rem;
    border-radius: 4px;
    margin-top: 2rem;
    color: #ffffff;
    }

    .warning-section h2 {
    color: #c53030 !important;
    }
/* 创建抽奖区块样式 */
.creation-section {
    padding: 2rem;
    text-align: center;
    border: 1px dashed #eee;
    background:linear-gradient(to right,#6565655c 0%,#6565651a);
    box-shadow:  2px 3px rgba(0,0,0,0.1);
    border-radius: 8px;
    margin: 2rem 0;
}
.auth-section{
    color: #ffffffba;
}
    </style>