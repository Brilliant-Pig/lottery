//数据访问层Dao，用于和数据库对接，进行数据的交换，拿数据，用SQL语言交互
const db = require(`../utils/dbConnPool/db`);

exports.getUserList = async () => {
    //驼峰命名法：有几个单词组成，除了第一个单词首字母小写，其他单词首字母大写，如：getUserList
    const sql = `
        SELECT
            *
        FROM
            users
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
            activities
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
            users
        WHERE
            username = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userName];
    return await db.query(sql, sqlParams);
};

exports.getUserName = async (userName) => {
    const sql = `
        SELECT
            username AS userName
        FROM
            users
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [userName];
    return await db.query(sql, sqlParams); //用于筛选的
};

//用活动id来获取活动信息
exports.getActivityNameByUrl = async (activityUrl) => {
    const sql = `
        SELECT
            activity_name AS title,
        FROM
            activities
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
            activities
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
            users
        WHERE
            username = ?
    `;
    const sqlParams = [userName];
    return await db.query(sql, sqlParams);
};

exports.uploadAvatar = async (userName, avatarUrl) => {
    const sql = `
        UPDATE users
        SET user_portrait = ?
        WHERE username = ?
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
            activities
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
            activity_name AS title,
            status AS activityStatus
        FROM
            activities
        WHERE
            activity_url = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityUrl];
    return await db.query(sql, sqlParams); //用于筛选的
};

// 获取用户创建的抽奖活动
exports.getCreatedActivities = async (userName) => {
    const sql = `
        SELECT 
            username AS id,
            activity_name AS title,
            create_time AS createTime,
            status
        FROM 
            activities
        WHERE 
            username = ?
    `;
    return await db.query(sql, [userName]);
};

// 获取用户参与的抽奖活动
exports.getParticipatedActivities = async (userName) => {
    const sql = `
        SELECT 
            username AS id,
            activity_name AS title,
            participation_time AS joinTime,
            end_time AS endTime,
            status
        FROM 
            participations
        WHERE 
            username = ?
    `;
    return await db.query(sql, [userName]);
};

// 获取用户中奖结果
exports.getWinningResults = async (userName) => {
    const sql = `
        SELECT 
            username AS id,
            activity_name AS title,
            activity_result AS result,
            win_time AS winTime,
            participation_time AS joinTime
        FROM 
            activity_results
        WHERE 
            username = ?
    `;
    return await db.query(sql, [userName]);
};

//用活动id来获取活动开始时间
exports.getActivityStartTimeByUrl = async (activityUrl) => {
    const sql = `
        SELECT
            start_time AS startTime
        FROM
            activities
        WHERE
            activity_url = ?
    `; //where条件中使用问号，代表参数，参数值将在后面传入，参数代表筛选条件
    const sqlParams = [activityUrl];
    return await db.query(sql, sqlParams); //用于筛选的
};

// 根据用户名和活动URL获取用户抽奖资格
exports.checkUserEligibility = async (userName, activityUrl) => {
    const sql = `
        SELECT 
            COUNT(*) AS eligible
        FROM 
            participations
        WHERE 
            username = ? 
            AND activity_name = (
                SELECT activity_name FROM activities WHERE activity_url = ?
            )
            AND has_participated = 0
    `;
    const result = await db.query(sql, [userName, activityUrl]);
    return result[0].eligible > 0;
};

// 标记用户已参与抽奖
exports.markUserParticipated = async (userName, activityUrl) => {
    const sql = `
        UPDATE participations
        SET has_participated = 1,
            participation_time = CURRENT_TIMESTAMP
        WHERE 
            username = ? 
            AND activity_name = (
                SELECT activity_name FROM activities WHERE activity_url = ?
            )
    `;
    return await db.query(sql, [userName, activityUrl]);
};

// 根据用户名和活动URL获取奖品配置
exports.getPrizeConfigByUser = async (userName, activityUrl) => {
    const sql = `
        SELECT 
            p.prize_name AS prizeName,
            p.prize_probability AS probability,
            p.prize_quantity AS quantity
        FROM 
            prizes p
        JOIN activities a ON p.activity_url = a.activity_url
        JOIN participations part ON a.activity_name = part.activity_name
        WHERE 
            part.username = ?
            AND p.activity_url = ?
            AND part.has_participated = 0
    `;
    return await db.query(sql, [userName, activityUrl]);
};

// 记录抽奖结果（基于用户名）
exports.recordUserLotteryResult = async (userName, activityUrl, prizeName) => {
    const sql = `
        INSERT INTO activity_results 
        (activity_name, username, activity_result, win_time, participation_time)
        VALUES (
            (SELECT activity_name FROM activities WHERE activity_url = ?),
            ?,
            ?,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
    `;
    return await db.query(sql, [activityUrl, userName, prizeName]);
};

// 更新奖品剩余数量（基于用户名）
exports.updatePrizeQuantityForUser = async (userName, activityUrl, prizeName) => {
    const sql = `
        UPDATE prizes 
        SET prize_quantity = prize_quantity - 1 
        WHERE activity_url = ? 
        AND prize_name = ? 
        AND prize_quantity > 0
        AND EXISTS (
            SELECT 1 FROM participations 
            WHERE username = ? 
            AND activity_name = (
                SELECT activity_name FROM activities WHERE activity_url = ?
            )
            AND has_participated = 0
        )
    `;
    return await db.query(sql, [activityUrl, prizeName, userName, activityUrl]);
};
