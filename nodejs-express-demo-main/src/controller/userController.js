//控制器的作用：处理请求，返回响应，相当于后端的一个入口处理器
const multer = require('multer');
const path = require('path');
const router = require('express').Router();
module.exports = router;

const userService = require('../service/userService');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/'); // 保存路径
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 限制2MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('请上传图片文件'), false);
        }
    }
});
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

router.get('/getUserByName', async (req, res, next) => {
    const { userName } = req.query; //从请求参数中获取userName
    const result = await userService.getUserByName(userName);
    res.ResultVO(0, '成功', result);
});

router.get('/getUserName', async (req, res, next) => {
    const { userName } = req.query; //从请求参数中获取userName
    const result = await userService.getUserName(userName);
    res.ResultVO(0, '成功', result);
});

router.get('/getActivity', async (req, res, next) => {
    const { activityUrl } = req.query; //从请求参数中获取userUrl
    const result = await userService.getActivityNameByUrl(activityUrl);
    res.ResultVO(0, '成功', result);
});

router.get('/getActivityEndTimeByUrl', async (req, res, next) => {
    const { activityUrl } = req.query;
    const result = await userService.getActivityEndTimeByUrl(activityUrl);
    res.ResultVO(0, '成功', result);
});

// 获取用户头像
router.get('/getUserAvatar', async (req, res, next) => {
    try {
        const { userName } = req.query;
        const result = await userService.getUserAvatar(userName);
        res.ResultVO(0, '成功', result);
    } catch (err) {
        res.ResultVO(1, '失败', err);
    }
});

// 上传用户头像
router.post('/uploadAvatar', upload.single('avatar'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.ResultVO(1, '请选择要上传的文件');
        }
        const userName = req.body.userName;
        const avatarUrl = `/avatars/${req.file.filename}`; // 生成访问URL

        const result = await userService.uploadAvatar(userName, avatarUrl);
        res.ResultVO(0, '头像上传成功', { avatarUrl });
    } catch (err) {
        res.ResultVO(1, err.message || '头像上传失败', err);
    }
});

//获取活动剩余人数
router.get('/getActivityRemainsByUrl', async (req, res, next) => {
    const { activityUrl } = req.query;
    const result = await userService.getActivityRemainsByUrl(activityUrl);
    res.ResultVO(0, '成功', result);
});

router.get('/getCreatedActivities', async (req, res, next) => {
    const { userName } = req.query;
    const result = await userService.getCreatedActivities(userName);
    res.ResultVO(0, '成功', result);
});

router.get('/getParticipatedActivities', async (req, res, next) => {
    const { userName } = req.query;
    const result = await userService.getParticipatedActivities(userName);
    res.ResultVO(0, '成功', result);
});

router.get('/getWinningResults', async (req, res, next) => {
    const { userName } = req.query;
    const result = await userService.getWinningResults(userName);
    res.ResultVO(0, '成功', result);
});

//获取活动开展状态
router.get('/getActivityActiveByUrl', async (req, res, next) => {
    const { activityUrl } = req.query; //从请求参数中获取userId
    const result = await userService.getActivityActiveByUrl(activityUrl);
    res.ResultVO(0, '成功', result);
});
//获取活动开始时间
router.get('/getActivityStartTimeByUrl', async (req, res, next) => {
    const { activityUrl } = req.query; //从请求参数中获取userId
    const result = await userService.getActivityStartTimeByUrl(activityUrl);
    res.ResultVO(0, '成功', result);
});

// 添加基于用户名的抽奖接口
router.post('/drawLotteryByUser', async (req, res, next) => {
    try {
        const { activityUrl, userName } = req.body;
        if (!userName || !activityUrl) {
            return res.status(400).json({
                code: 1,
                message: '缺少必要参数',
                details: {
                    required: ['userName', 'activityUrl'],
                    received: req.body
                }
            });
        }

        const result = await userService.drawLotteryByUser(userName, activityUrl);
        res.json({
            code: 0,
            message: '抽奖成功',
            data: result
        });
    } catch (err) {
        console.error('控制器错误详情:', {
            error: err.message,
            stack: err.stack,
            body: req.body
        });

        res.status(500).json({
            code: 1,
            message: err.message || '抽奖失败'
        });
    }
});
// 添加记录用户参与活动的接口
router.post('/recordParticipation', async (req, res, next) => {
    try {
        const { activityUrl, userName } = req.body;

        // 参数验证
        if (!userName || !activityUrl) {
            return res.status(400).json({
                code: 1,
                message: '缺少必要参数',
                details: {
                    required: ['userName', 'activityUrl'],
                    received: req.body
                }
            });
        }

        // 调用服务层方法
        const result = await userService.recordParticipation(userName, activityUrl);

        // 返回成功响应
        res.json({
            code: 0,
            message: '参与记录成功',
            data: result
        });
    } catch (err) {
        console.error('记录参与失败:', err);
        res.status(500).json({
            code: 1,
            message: err.message || '记录参与失败'
        });
    }
});
// 获取用户历史抽奖记录
router.get('/getUserLotteryHistory', async (req, res, next) => {
    try {
        const { userName } = req.query;
        if (!userName) {
            return res.status(400).json({
                code: 1,
                message: '缺少userName参数'
            });
        }
        const result = await userService.getUserLotteryHistory(userName);
        res.json(result);
    } catch (err) {
        console.error('获取历史记录失败:', err);
        res.status(500).json({
            code: 1,
            message: '获取历史记录失败'
        });
    }
});
// 创建抽奖活动
router.post('/createLottery', async (req, res) => {
    try {
        const { lotteryData } = req.body;

        // 基本验证
        if (!lotteryData || !lotteryData.username) {
            return res.status(400).json({
                code: 1,
                message: '缺少用户名或抽奖数据'
            });
        }

        const result = await userService.createLotteryActivity(lotteryData);
        res.json(result);
    } catch (error) {
        console.error('创建抽奖活动控制器错误:', error);
        res.status(500).json({
            code: 1,
            message: error.message || '创建抽奖活动失败'
        });
    }
});
