const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwt_conf = require('config').get('jwtConfig');

const authDao = require('../dao/authDao');

// 检查用户名是否可用
exports.checkUsername = async (userName) => {
    try {
        const user = await authDao.checkUsername(userName);
        return !user || user.length === 0; // 返回true表示用户名可用
    } catch (error) {
        console.error('检查用户名失败:', error);
        throw new Error('检查用户名失败');
    }
};

// 用户注册
exports.register = async (userName, password) => {
    try {
        // 1. 检查用户名是否已存在
        const available = await this.checkUsername(userName);
        if (!available) {
            throw new Error('用户名已存在');
        }

        // 2. 加密密码
        const salt = await bcrypt.genSalt(10); //盐值
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. 保存用户信息
        const result = await authDao.register(userName, passwordHash);

        // 4. 生成并返回token
        const token = jwt.sign({ userName }, jwt_conf.secret, { expiresIn: jwt_conf.expiresIn });
        return token;
    } catch (error) {
        console.error('注册失败:', error);
        if (error.message.includes('唯一约束') || error.message.includes('已存在')) {
            throw new Error('用户名已存在');
        }
        throw new Error('注册失败');
    }
};

// 用户登录
exports.login = async (userName, passWord) => {
    // 获取用户实体
    const user = await authDao.login(userName);
    if (!user || user.length === 0) {
        return;
    }
    // 验证密码
    const match = await bcrypt.compare(passWord, user[0].passWordHash);
    if (!match) {
        console.log('密码错误');
        return;
    }
    // 生成 token
    const token = jwt.sign(
        {
            userName: user[0].userName
        },
        jwt_conf.secret,
        {
            expiresIn: jwt_conf.expiresIn
        }
    );
    console.log('token:', token);
    return token;
};

// 凭证校验
exports.tokenVerify = async (token) => {
    try {
        return await jwt.verify(token, jwt_conf.secret);
    } catch (err) {
        return;
    }
};
