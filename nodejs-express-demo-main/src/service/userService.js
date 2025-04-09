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
