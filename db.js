const mongoose = require('mongoose');

// 定义一个异步函数来连接数据库
const connectDB = async () => {
  try {
    // 这是连接本地 MongoDB 的字符串，数据库名为 tinkerers_blog_local
    const MONGO_URI = 'mongodb://localhost:27017/tinkerers_blog_local';
    
    // Mongoose 连接（新版本已无需额外选项）
    const conn = await mongoose.connect(MONGO_URI);

    // 如果连接成功，在控制台打印成功信息
    console.log(`本地 MongoDB 已连接: ${conn.connection.host}`);
  } catch (error) {
    // 如果连接失败，打印错误信息并退出程序
    console.error(`数据库连接错误: ${error.message}`);
    process.exit(1);
  }
};

// 导出这个连接函数，以便在 server.js 中使用
module.exports = connectDB;