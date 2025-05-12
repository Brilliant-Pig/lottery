import authentication from '@/utils/authentication';
const moduleUrl = 'api/auth';

const auth = {
    // 用户登录
    login(data) {
        return authentication.login(data);
    },
    // 用户注册
    register(data) {
        return authentication.register(data);
    },
    // 修改用户密码
    checkUsername(data) {
        return request.put(`${moduleUrl}/checkUsername`, data);
    },
};

export default auth;
