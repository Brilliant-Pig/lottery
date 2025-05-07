const express = require('express');
const router = express.Router();
module.exports = router;

const authService = require('../service/authService');

/**
 * @name login 用户登录
 * @description POST /auth/login
 * @body {string} userId 用户ID
 * @body {string} password 用户密码
 * @response {string} token 登录凭证
 **/
router.post('/login', async (req, res, next) => {
    const { userName, passWord } = req.body;
    const token = await authService.login(userName, passWord);
    if (token) {
        res.ResultVO(0, '登录成功', token);
    } else {
        res.ResultVO(1, '登录失败');
    }
});

/**
 * @name register 用户注册
 * @description POST /auth/register
 * @body {string} userId 用户ID
 * @body {string} password 用户密码
 * @response {string} token 登录凭证
 */
router.post('/register', async (req, res, next) => {
    const { userName, passWord } = req.body;
    const token = await authService.register(userName, passWord);
    if (token) {
        res.ResultVO(0, '注册成功', token);
    } else {
        res.ResultVO(1, '注册失败');
    }
});

/**
 * @name tokenVerify 凭证校验
 * @description POST /auth/tokenVerify
 * @header {string} Authorization 用户凭证
 * @response {Object} payload 凭证负载
 * @response {string} payload.userId 用户ID
 * @response {string} payload.userName 用户名称
 */
router.post('/tokenVerify', async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const payload = await authService.tokenVerify(token);
    if (payload) {
        res.ResultVO(0, '凭证有效', payload);
    } else {
        res.ResultVO(1, '凭证无效');
    }
});
