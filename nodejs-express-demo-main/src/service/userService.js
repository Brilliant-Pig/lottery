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

exports.getUserPortraitByName = async (userName) => {
    const userPortrait = await userDao.getUserPortraitByName(userName);
    return userPortrait;
};

exports.getUserName = async (userName) => {
    const user = await userDao.getUserName(userName);
    return user;
};

exports.getActivityNameById = async (activityId) => {
    const Activity = await userDao.getActivityNameById(activityId);
    return Activity;
};

exports.getActivityEndTimeById = async (activityId) => {
    const ActivityET = await userDao.getActivityEndTimeById(activityId);
    return ActivityET;
};

exports.getUserAvatar = async (userId) => {
    const avatarInfo = await userDao.getUserAvatar(userId);
    return avatarInfo;
};

exports.uploadAvatar = async (userId, avatarUrl) => {
    const result = await userDao.uploadAvatar(userId, avatarUrl);
    return result;
};

exports.getActivityRemainsById = async (activityId) => {
    const result = await userDao.getActivityRemainsById(activityId);
    return result;
};

exports.getActivityActiveById = async (activityId) => {
    const result = await userDao.getActivityActiveById(activityId);
    return result;
};
