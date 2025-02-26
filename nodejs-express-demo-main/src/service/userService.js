const userDao = require('../dao/userDao');

exports.getUserList = async () => {
    const userList = await userDao.getUserList();
    return userList;
};

exports.getUserInfo = async (userId) => {
    const userInfo = await userDao.getUserInfo(userId);
    return userInfo;
};

exports.getUserIdByName = async (userName) => {
    const userInfo = await userDao.getUserIdByName(userName);
    return userInfo;
};
