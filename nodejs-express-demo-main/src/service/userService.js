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
