const db = require(`../utils/dbConnPool/db`);
const { uuidv7 } = require('uuidv7');

// 用户注册
exports.register = async (userName, passwordHash) => {
    const sql = `
        INSERT INTO users 
            (userName,passwordHash,create_time)
        VALUES
            (?,?,datetime('now'))
    `;
    const sqlParams = [userName, passwordHash];
    try {
        const result = await db.query(sql, sqlParams);
        return result;
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('userName')) {
            throw new Error('USERNAME_EXISTS');
        }
        throw error;
    }
};

// 用户登录
exports.login = async (userName) => {
    const sql = `
    SELECT 
        username AS userName, 
        passwordHash AS passWordHash
    FROM 
        users
    WHERE 
        userName = ?
    `;
    const sqlParams = [userName];
    const result = await db.query(sql, sqlParams);
    return result;
};

// 检查用户名是否存在
exports.checkUsername = async (userName) => {
    const sql = `
    SELECT 
        userName
    FROM 
        users
    WHERE 
        userName = ?
    `;
    const sqlParams = [userName];
    const result = await db.query(sql, sqlParams);
    return result;
};
