const mongoose = require('mongoose');

// 定义文章的数据结构 (Schema)
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // 标题是必填项
  },
  date: {
    type: String, 
  },
  excerpt: {
    type: String,
  },
  content: {
    type: String,
    required: true, // 内容也是必填项
  },
}, {
  timestamps: true // 这个选项会自动为每条数据添加 createdAt 和 updatedAt 两个时间戳字段
});

// 基于这个 Schema 创建一个模型，并导出它
// Mongoose 会自动把模型名 'Post' 变成小写复数 'posts' 作为数据库中的集合(collection)名
module.exports = mongoose.model('Post', PostSchema);