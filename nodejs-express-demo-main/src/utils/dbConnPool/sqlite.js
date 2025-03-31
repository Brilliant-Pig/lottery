// 导入数据库配置
const db_conf = require('config').get('dbConfig');
const sqlite = require('better-sqlite3');
const logger = console;

// 预编译语句缓存
const stmtCache = new Map();

// 数据库连接池
class SQLitePool {
    constructor() {
        this.db = null;
        this.isConnected = false;
        this.init();
    }

    init() {
        try {
            this.db = new sqlite(db_conf.filename, {
                readonly: false,
                fileMustExist: false,
                verbose: (sql) => logger.debug('SQL:', sql)
            });
            this.isConnected = true;
            logger.info('SQLite database connected successfully');
        } catch (err) {
            logger.error('Failed to connect to SQLite database:', err);
            throw err;
        }
    }

    // 检查连接状态并尝试重连
    checkConnection() {
        if (!this.isConnected) {
            logger.warn('Database connection lost, attempting to reconnect...');
            this.init();
        }
    }

    // 获取预编译语句
    getStatement(sql) {
        this.checkConnection();
        let stmt = stmtCache.get(sql);
        if (!stmt) {
            stmt = this.db.prepare(sql);
            stmtCache.set(sql, stmt);
        }
        return stmt;
    }

    // 开始事务
    beginTransaction() {
        this.checkConnection();
        return this.db.prepare('BEGIN').run();
    }

    // 提交事务
    commit() {
        this.checkConnection();
        return this.db.prepare('COMMIT').run();
    }

    // 回滚事务
    rollback() {
        this.checkConnection();
        return this.db.prepare('ROLLBACK').run();
    }
}

// 创建连接池实例
const pool = new SQLitePool();

// 事务执行器
async function withTransaction(callback) {
    try {
        pool.beginTransaction();
        const result = await callback();
        pool.commit();
        return result;
    } catch (err) {
        pool.rollback();
        throw err;
    }
}

// 封装 SQL 执行的方法
exports.query = async (sql, sqlParams) => {
    try {
        if (!sql || !sql.trim()) {
            throw new Error('SQL statement cannot be empty');
        }

        const stmt = pool.getStatement(sql);
        // 改进SQL类型提取逻辑，处理多行SQL和前导空格
        const sqlType = sql.trim().toUpperCase().replace(/\s+/g, ' ').split(' ')[0];

        switch (sqlType) {
            case 'INSERT':
            case 'UPDATE':
            case 'DELETE':
                const result = sqlParams ? stmt.run(sqlParams) : stmt.run();
                return {
                    changes: result.changes,
                    lastInsertRowid: result.lastInsertRowid
                };
            case 'SELECT':
                return sqlParams ? stmt.all(sqlParams) : stmt.all();
            default:
                throw new Error(`Unsupported SQL operation: ${sqlType}`);
        }
    } catch (err) {
        logger.error('Database error:', err);
        if (err.message.includes('no such table')) {
            throw new Error('Table not found in database');
        }
        throw err;
    }
};

// 导出事务执行器
exports.withTransaction = withTransaction;

// 导出连接池实例
exports.pool = pool;
