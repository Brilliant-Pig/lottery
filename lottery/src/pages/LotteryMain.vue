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
    
            <!-- 全流程操作指南 -->
            <section id="全流程操作指南" class="manual-section">
            <h1>操作流程图解</h1>
            <div class="flow-guides">
                <div class="user-flow">
                <h2>终端用户流程</h2>
                <div class="mermaid-diagram">
                    <img src="../assets/终端用户流程.png" alt="用户流程图" />
                    <UserJourney />
                </div>
                </div>
                
                <div class="admin-flow">
                <h2>管理员流程</h2>
                <div class="mermaid-diagram">
                    <img src="../assets/管理员流程.png" alt="管理员流程图" />
                    <AdminSequence />
                </div>
                </div>
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
                
                <div class="mermaid-diagram">
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
    
            <!-- 快速入门 -->
            <section id="快速入门" class="manual-section">
            <h1>快速入门指南</h1>
            <div class="quickstart-steps">
                <div v-for="(step, index) in quickSteps" 
                    :key="index" 
                    class="step-card">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.desc }}</p>
                    <button v-if="step.action" 
                            @click="handleStepAction(step.action)">
                    {{ step.actionText }}
                    </button>
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
    
            <!-- 其他模块... -->
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
            architectureImg: '../assets/architecture.png',  
            navLinks: [
            { text: '系统架构', anchor: '系统架构' },
            { text: '角色权限', anchor: '角色权限说明' },
            { text: '操作流程', anchor: '全流程操作指南' },
            { text: '系统概述', anchor: '系统概述' },
            { text: '快速入门', anchor: '快速入门' }
            ],
            deployArch: [
            {component: 'Web服务器', spec: '4核8G/100G SSD', solution: 'Nginx集群+Keepalived'},
            {component: '数据库', spec: '8核16G/500G SSD', solution: 'MySQL主从复制'},
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
        }
        }
    }
    </script>
    
    <style lang="scss" scoped>
    .user-manual {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
    
        .manual-nav {
        position: sticky;
        top: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 100;
        
        a {
            margin-right: 2rem;
            cursor: pointer;
            transition: color 0.3s;
            
            &:hover {
            color: #42b983;
            }
        }
        }
    
        .manual-section {
        margin: 2rem 0;
        padding: 2rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
        h1, h2, h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }
    
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
    
            th, td {
            padding: 12px;
            border: 1px solid #eee;
            text-align: left;
            }
    
            th {
            background-color: #f8f9fa;
            font-weight: 600;
            }
        }
    
        pre {
            background: #f8f8f8;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-family: 'Fira Code', monospace;
        }
        }
    
        .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
        }
    
        .feature-card {
        padding: 1.5rem;
        border: 1px solid #eee;
        border-radius: 8px;
        transition: transform 0.3s;
    
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
            background: #f8f9fa;
            border-radius: 8px;
    
            h4 {
                color: #2c3e50;
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
                background-color: #f5f5f5;
                }
            }
            }
        }
        }
    
        .flow-guides {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }
    
        .mermaid-diagram {
        margin: 2rem 0;
        overflow-x: auto;
        background: #f8f9fa;
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
    </style>