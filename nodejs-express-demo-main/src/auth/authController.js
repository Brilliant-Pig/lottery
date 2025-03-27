// authController.js
const jwt = require('jsonwebtoken');

// 登录接口 - 签发JWT
router.post('/login', (req, res) => {
    // 1. 验证用户名密码
    const user = authenticateUser(req.body);

    // 2. 签发Token (必须后端实现)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ code: 0, data: token });
});

// 认证中间件 - 验证JWT
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ code: 1, message: '未提供Token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // 将解码信息附加到请求
        next();
    } catch (err) {
        res.status(401).json({ code: 1, message: '无效的Token' });
    }
};
