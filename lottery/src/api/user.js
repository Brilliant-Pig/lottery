import request from '@/utils/request';

const moduleUrl = 'api/user';

const user = {
    // 查询用户个人信息
    getUserInfo(data) {
        return request.get(`${moduleUrl}/getUserInfo`, data);
    },
    // 修改用户个人信息
    updateUserInfo(data) {
        return request.put(`${moduleUrl}/updateUserInfo`, data);
    },
    // 修改用户密码
    updatePassword(data) {
        return request.put(`${moduleUrl}/updatePassword`, data);
    },
    // 通过用户姓名获取学号
    getUserIdByName(data) {
        return request.get(`${moduleUrl}/getUserIdByName`, data); //“/getUserIdByName”指对应后端控制器的接口
    },
    //通过向后端发送id返还活动数据
    getActivityEndTime(data){
        return request.get(`${moduleUrl}/getActivityEndTimeByUrl`,data);
    },
    //通过向后端发送id返还活动剩余人数
    getActivityRemainsByUrl(data){
        return request.get(`${moduleUrl}/getActivityRemainsByUrl`,data);
    },
    //通过向后端发送id返还活动开展状态
    getActivityActiveByUrl(data){
        return request.get(`${moduleUrl}/getActivityActiveByUrl`,data);
    }
};

export default user;
