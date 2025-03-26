//数据访问层Dao，用于和数据库对接，进行数据的交换，拿数据，用SQL语言交互
const db = require(`../utils/dbConnPool/db`);

exports.getUserList = async () => {
    //驼峰命名法：有几个单词组成，除了第一个单词首字母小写，其他单词首字母大写，如：getUserList
    const sql = `
        SELECT
            *
        FROM
            lottery_user
    `; //AS代表将前面的命名改为后面的别名
    const res = await db.query(sql, []);
    console.log(res);
    return res;
};

exports.getActivityTable = async () => {
    //驼峰命名法：有几个单词组成，除了第一个单词首字母小写，其他单词首字母大写，如：getUserList
    const sql = `
        SELECT
            *
        FROM
            Activity_Table
    `; //AS代表将前面的命名改为后面的别名
    const res = await db.query(sql, []);
    console.log(res);
    return res;
};

exports.getUserId = async (userId) => {
    const sql = `
        SELECT
            user_id AS userId,
            user_name AS userName
        FROM
            lottery_user
        WHERE
            user_id = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userId];
    return await db.query(sql, sqlParams); //用于筛选的
};

exports.getUserPortraitByName = async (userName) => {
    const sql = `
        SELECT
            user_portrait AS userPortrait,
            user_name AS userName
        FROM
            lottery_user
        WHERE
            user_name = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userName];
    return await db.query(sql, sqlParams);
};

exports.getUserName = async (userName) => {
    const sql = `
        SELECT
            user_name AS userName
        FROM
            lottery_user
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userName];
    return await db.query(sql, sqlParams); //用于筛选的
};

exports.getActivityNameById = async (activityId) => {
    const sql = `
        SELECT
            Activity_Name AS activityName
        FROM
            Activity_Table
        WHERE
            Activity_ID = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityId];
    return await db.query(sql, sqlParams); //用于筛选的
};

exports.getActivityEndTimeById = async (activityId) => {
    const sql = `
        SELECT
            End_Time AS activityEndTime
        FROM
            Activity_Table
        WHERE
            Activity_ID = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityId];
    return await db.query(sql, sqlParams); //用于筛选的
};
