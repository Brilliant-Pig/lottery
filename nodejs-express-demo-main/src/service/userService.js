//数据逻辑层Service对数据的处理，计算就在这里解决。
const userDao = require('../dao/userDao');

exports.getUserList = async () => {
    const userList = await userDao.getUserList();
    return userList;
};

exports.getUserId = async (userId) => {
    const userInfo = await userDao.getUserId(userId);
    return userInfo;
};

exports.getUserByName = async (userName) => {
    const userinfo = await userDao.getUserByName(userName);
    return userinfo;
};

exports.getUserName = async (userName) => {
    const user = await userDao.getUserName(userName);
    return user;
};

exports.getActivityNameByUrl = async (activityUrl) => {
    const Activity = await userDao.getActivityNameByUrl(activityUrl);
    return Activity;
};

exports.getActivityEndTimeByUrl = async (activityUrl) => {
    const ActivityET = await userDao.getActivityEndTimeByUrl(activityUrl);
    return ActivityET;
};

exports.getUserAvatar = async (userName) => {
    const avatarInfo = await userDao.getUserAvatar(userName);
    return avatarInfo;
};

exports.uploadAvatar = async (userName, avatarUrl) => {
    const result = await userDao.uploadAvatar(userName, avatarUrl);
    return result;
};

exports.getActivityRemainsByUrl = async (activityUrl) => {
    const result = await userDao.getActivityRemainsByUrl(activityUrl);
    return result;
};

exports.getCreatedActivities = async (username) => {
    const result = await userDao.getCreatedActivities(username);
    return result;
};

exports.getWinningResults = async (username) => {
    const result = await userDao.getWinningResults(username);
    return result;
};

exports.getParticipatedActivities = async (username) => {
    const result = await userDao.getParticipatedActivities(username);
    return result;
};

exports.getActivityActiveByUrl = async (activityUrl) => {
    const result = await userDao.getActivityActiveByUrl(activityUrl);
    return result;
};

// 执行基于用户名的抽奖逻辑
exports.drawLotteryByUser = async (userName, activityUrl) => {
    try {
        console.log(`开始处理抽奖请求，用户: ${userName}, 活动URL: ${activityUrl}`);

        // 1. 获取活动信息
        const activity = await userDao.getActivityActiveByUrl(activityUrl);
        if (!activity) {
            throw new Error('活动不存在、未开始或已结束');
        }

        // 2. 检查用户资格
        const isEligible = await userDao.checkUserEligibility(userName, activityUrl);
        if (!isEligible) {
            throw new Error('用户没有抽奖资格或已参与过抽奖');
        }

        // 3. 获取奖品配置
        const prizes = await userDao.getPrizeConfigByUser(userName, activityUrl);
        if (!prizes || prizes.length === 0) {
            throw new Error('活动尚未配置奖品');
        }

        // 计算总概率
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

        // 生成随机数
        const random = Math.random() * totalProbability;

        let accumulatedProbability = 0;
        let selectedPrize = null;

        // 根据概率选择奖品
        for (const prize of prizes) {
            accumulatedProbability += prize.probability;
            if (random <= accumulatedProbability && prize.quantity > 0) {
                selectedPrize = prize;
                break;
            }
        }

        // 如果没有可用的奖品，则返回未中奖
        if (!selectedPrize) {
            selectedPrize = { prizeName: '很遗憾，您未中奖', probability: 0, quantity: 0 };
        } else {
            // 更新奖品数量
            await userDao.updatePrizeQuantityForUser(userName, activityUrl, selectedPrize.prizeName);
        }

        // 标记用户已参与抽奖
        await userDao.markUserParticipated(userName, activityUrl);

        // 记录抽奖结果
        await userDao.recordUserLotteryResult(userName, activityUrl, selectedPrize.prizeName);

        return {
            code: 0,
            message: '抽奖成功',
            data: {
                prize: selectedPrize.prizeName,
                activityUrl,
                activityName: activity.activityName
            }
        };
    } catch (err) {
        console.error('抽奖服务错误:', {
            error: err.message,
            stack: err.stack,
            userName,
            activityUrl
        });
        return {
            code: 1,
            message: err.message
        };
    }
};

exports.getActivityStartTimeByUrl = async (activityUrl) => {
    const result = await userDao.getActivityStartTimeByUrl(activityUrl);
    return result;
};
exports.recordParticipation = async (userName, activityUrl) => {
    try {
        // 检查是否已参与
        const exists = await userDao.checkParticipationExists(userName, activityUrl);
        if (exists) {
            throw new Error('你已经参与抽奖，不能重复参与');
        }

        // 检查活动是否存在
        const activity = await userDao.getActivityActiveByUrl(activityUrl);
        if (!activity) {
            throw new Error('活动不存在');
        }

        // 插入参与记录
        const result = await userDao.insertParticipation(userName, activityUrl);
        return {
            code: 0,
            message: '参与记录成功',
            data: result
        };
    } catch (err) {
        // 检查是否是唯一性约束错误
        if (err.message.includes('UNIQUE constraint failed')) {
            throw new Error('你已经参与抽奖，不能重复参与');
        }
        console.error('记录参与失败:', err);
        throw err; // 其他错误继续抛出
    }
};
// 获取用户历史抽奖记录
exports.getUserLotteryHistory = async (userName) => {
    try {
        const history = await userDao.getUserLotteryHistory(userName);
        return {
            code: 0,
            message: '获取历史记录成功',
            data: history
        };
    } catch (err) {
        console.error('获取历史记录失败:', err);
        return {
            code: 1,
            message: '获取历史记录失败'
        };
    }
};
// 获取创建者的抽奖历史记录
exports.getCreatorLotteryHistory = async (userName) => {
    try {
        const history = await userDao.getCreatorLotteryHistory(userName);
        return {
            code: 0,
            message: '获取创建者历史记录成功',
            data: history
        };
    } catch (err) {
        console.error('获取创建者历史记录失败:', err);
        return {
            code: 1,
            message: '获取创建者历史记录失败'
        };
    }
};
// 创建抽奖活动
exports.createLotteryActivity = async (lotteryData) => {
    try {
        // 生成唯一的抽奖码
        const uniqueCode = 'L' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8).toUpperCase();
        lotteryData.lotteryCode = uniqueCode;

        // 插入活动信息
        const activityInsertData = {
            name: lotteryData.lotteryInfo.name,
            url: uniqueCode,
            startTime: lotteryData.timeSettings.startTime,
            endTime: lotteryData.timeSettings.endTime,
            username: lotteryData.username
        };

        await userDao.insertActivity(activityInsertData);

        // 准备奖品数据
        const prizesInsertData = lotteryData.prizes.map((prize) => ({
            activityName: lotteryData.lotteryInfo.name,
            activityUrl: uniqueCode,
            prizeName: prize.name,
            probability: prize.weight / 100,
            quantity: prize.quantity
        }));

        // 插入奖品信息
        await userDao.insertPrizes(prizesInsertData);

        return {
            code: 0,
            message: '抽奖活动创建成功',
            data: {
                activityUrl: uniqueCode,
                lotteryCode: uniqueCode
            }
        };
    } catch (error) {
        console.error('创建抽奖活动失败:', error);
        throw error;
    }
};
