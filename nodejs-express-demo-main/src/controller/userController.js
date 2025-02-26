//控制器的作用：处理请求，返回响应，相当于后端的一个入口处理器
const router = require('express').Router();
module.exports = router;

const userService = require('../service/userService');

router.get('/getUserList', async (req, res, next) => {
    const result = await userService.getUserList();
    res.ResultVO(0, '成功', result);
});

router.get('/getUserInfo', async (req, res, next) => {
    const { userId } = req.query; //从请求参数中获取userId
    const result = await userService.getUserInfo(userId);
    res.ResultVO(0, '成功', result);
});
//只选取某个用户信息

router.get('/getUserIdByName', async (req, res, next) => {
    const { userName } = req.query; //从请求参数中获取userName
    const result = await userService.getUserIdByName(userName);
    res.ResultVO(0, '成功', result);
});
