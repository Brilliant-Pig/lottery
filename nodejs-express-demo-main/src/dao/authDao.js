const db = require(`../utils/dbConnPool/db`);
const { uuidv7 } = require('uuidv7');

// 用户注册
exports.register = async (userName, passwordHash) => {
    const id = uuidv7();
    const sql = `
        INSERT INTO users 
            (userName,passwordHash,create_time)
        VALUES
            (?,?,datetime('now'))
    `;
    const sqlParams = [userName, passwordHash];
    const result = await db.query(sql, sqlParams);
    return result;
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
