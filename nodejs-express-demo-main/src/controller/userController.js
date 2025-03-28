//控制器的作用：处理请求，返回响应，相当于后端的一个入口处理器
const router = require('express').Router();
module.exports = router;

const userService = require('../service/userService');

router.get('/getUserList', async (req, res, next) => {
    try {
        const result = await userService.getUserList();
        res.ResultVO(0, '成功', result);
    } catch (err) {
        res.ResultVO(1, '失败', err);
    }
});

router.get('/getUserId', async (req, res, next) => {
    const { userId } = req.query; //从请求参数中获取userId，用于前端传输数据
    const result = await userService.getUserId(userId);
    res.ResultVO(0, '成功', result);
});
//只选取某个用户信息

router.get('/getUserPortraitByName', async (req, res, next) => {
    const { userName } = req.query; //从请求参数中获取userName
    const result = await userService.getUserPortraitByName(userName);
    res.ResultVO(0, '成功', result);
});

router.get('/getUserName', async (req, res, next) => {
    const { userName } = req.query; //从请求参数中获取userName
    const result = await userService.getUserName(userName);
    res.ResultVO(0, '成功', result);
});

router.get('/getActivity', async (req, res, next) => {
    const { activityId } = req.query; //从请求参数中获取userId
    const result = await userService.getActivityNameById(activityId);
    res.ResultVO(0, '成功', result);
});

router.get('/getActivityEndTime', async (req, res, next) => {
    const { activityId } = req.query; //从请求参数中获取userId
    const result = await userService.getActivityEndTimeById(activityId);
    res.ResultVO(0, '成功', result);
});

// 获取用户头像
router.get('/getUserAvatar', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const result = await userService.getUserAvatar(userId);
        res.ResultVO(0, '成功', result);
    } catch (err) {
        res.ResultVO(1, '失败', err);
    }
});

// 上传用户头像
router.post('/uploadAvatar', async (req, res, next) => {
    try {
        // 注意：实际文件上传需要使用multer等中间件处理
        // 这里简化处理，实际项目中应该处理文件上传
        const { userId, avatarUrl } = req.body;
        const result = await userService.uploadAvatar(userId, avatarUrl);
        res.ResultVO(0, '头像上传成功', result);
    } catch (err) {
        res.ResultVO(1, '头像上传失败', err);
    }
});

//获取活动剩余人数
router.get('/getActivityRemainsById', async (req, res, next) => {
    const { activityId } = req.query; //从请求参数中获取userId
    const result = await userService.getActivityRemainsById(activityId);
    res.ResultVO(0, '成功', result);
});
