const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwt_conf = require('config').get('jwtConfig');

const authDao = require('../dao/authDao');

// 用户注册
exports.register = async (userName, password) => {
    // 加密密码
    console.log(userName, password);
    const salt = await bcrypt.genSalt(10); //盐值
    const passwordHash = await bcrypt.hash(password, salt);
    // 保存用户信息
    const result = await authDao.register(userName, passwordHash);
    return result;
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
