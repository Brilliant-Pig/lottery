//数据访问层Dao，用于和数据库对接，进行数据的交换，拿数据，用SQL语言交互
const db = require(`../utils/dbConnPool/db`);

exports.getUserList = async () => {
    //驼峰命名法：有几个单词组成，除了第一个单词首字母小写，其他单词首字母大写，如：getUserList
    const sql = `
        SELECT
            *
        FROM
            lottery
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
            lottery
    `; //AS代表将前面的命名改为后面的别名
    const res = await db.query(sql, []);
    console.log(res);
    return res;
};

exports.getUserId = async (userId) => {
    const sql = `
        SELECT
            *
        FROM
            lottery
        WHERE
            user_name = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userId];
    return await db.query(sql, sqlParams); //用于筛选的
};

exports.getUserByName = async (userName) => {
    const sql = `
        SELECT
            *
        FROM
            lottery
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
            lottery
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userName];
    return await db.query(sql, sqlParams); //用于筛选的
};

//用活动id来获取活动信息
exports.getActivityNameByUrl = async (activityUrl) => {
    const sql = `
        SELECT
            activity_name AS activityName
        FROM
            lottery
        WHERE
            activity_url = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityUrl];
    return await db.query(sql, sqlParams); //用于筛选的
};

exports.getActivityEndTimeByUrl = async (activityUrl) => {
    const sql = `
        SELECT
            end_time AS activityEndTime
        FROM
            lottery
        WHERE
            activity_url = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityUrl];
    return await db.query(sql, sqlParams); //用于筛选的
};
exports.getUserAvatar = async (userName) => {
    const sql = `
        SELECT
            user_portrait AS avatarUrl
        FROM
            lottery
        WHERE
            user_name = ?
    `;
    const sqlParams = [userName];
    return await db.query(sql, sqlParams);
};

exports.uploadAvatar = async (userName, avatarUrl) => {
    const sql = `
        UPDATE lottery
        SET user_portrait = ?
        WHERE user_name = ?
    `;
    const sqlParams = [avatarUrl, userName];
    return await db.query(sql, sqlParams);
};

//用活动id来获取活动剩余人数
exports.getActivityRemainsByUrl = async (activityUrl) => {
    const sql = `
        SELECT
            remain_people AS activityRemainPeople
        FROM
            lottery
        WHERE
            activity_url = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityUrl];
    return await db.query(sql, sqlParams); //用于筛选的
};


//用活动id来获取活动开展状态
exports.getActivityActiveByUrl = async (activityUrl) => {
    const sql = `
        SELECT
            activity_name AS activityName
        FROM
            lottery
        WHERE
            activity_url = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityUrl];
    return await db.query(sql, sqlParams); //用于筛选的

// 获取用户创建的抽奖活动
exports.getCreatedActivities = async (userName) => {
    const sql = `
        SELECT 
            user_name AS id,
            activity_name AS title,
            create_time AS createTime,
            status
        FROM 
            lottery
        WHERE 
            user_name = ?
    `;
    return await db.query(sql, [userName]);
};

// 获取用户参与的抽奖活动
exports.getParticipatedActivities = async (userName) => {
    const sql = `
        SELECT 
            user_name AS id,
            activity_name AS title,
            join_time AS joinTime,
            status
        FROM 
            lottery
        WHERE 
            user_name = ?
    `;
    return await db.query(sql, [userName]);
};

// 获取用户中奖结果
exports.getWinningResults = async (userName) => {
    const sql = `
        SELECT 
            user_name AS id,
            activity_name AS prizeName,
            join_time AS winTime,
            activity_result AS activityResult
        FROM 
            lottery
        WHERE 
            user_name = ?
    `;
    return await db.query(sql, [userName]);
};
