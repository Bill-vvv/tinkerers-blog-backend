// 导入所需模块
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 引入 mongoose 以便使用 ObjectId.isValid
const connectDB = require('./db.js'); // 导入数据库连接函数
const Post = require('./models/Post.js'); // 导入 Post 模型

// 执行数据库连接
connectDB();

const app = express();
const PORT = 5000;

// 配置中间件 (必须在路由之前)
app.use(cors());          // 允许跨域
app.use(express.json());  // 解析 JSON 请求体

// === API 路由定义 ===

// GET: 获取所有文章
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GET /api/posts 错误:", err.message);
    res.status(500).send('服务器错误');
  }
});

// GET: 根据 ID 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 检查 ID 是否为有效的 ObjectId 格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("无效的 ID 格式:", id);
      return res.status(404).json({ msg: '文章未找到 (无效ID)' });
    }

    const post = await Post.findById(id);

    if (!post) {
      console.log("数据库中未找到 ID:", id);
      return res.status(404).json({ msg: '文章未找到' });
    }
    res.json(post);
  } catch (err) {
    console.error(`GET /api/posts/${req.params.id} 错误:`, err.message);
    res.status(500).send('服务器错误');
  }
});

// POST: 创建一篇文章
app.post('/api/posts', async (req, res) => {
  try {
    const { title, date, excerpt, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ msg: '标题和内容是必填项' });
    }
    const newPost = new Post({ title, date, excerpt, content });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("POST /api/posts 错误:", err.message);
    res.status(500).send('服务器错误');
  }
});

// PUT: 更新一篇文章 (已加固)
app.put('/api/posts/:id', async (req, res) => {
  try {
    // 明确地只从 req.body 中提取允许更新的字段，忽略任何其他字段(如 url)
    const { title, date, excerpt, content } = req.body;
    const updatedFields = { title, date, excerpt, content };

    const post = await Post.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    
    if (!post) {
      return res.status(404).json({ msg: '文章未找到' });
    }
    res.json(post);
  } catch (err) {
    console.error(`PUT /api/posts/${req.params.id} 错误:`, err.message);
    res.status(500).send('服务器错误');
  }
});

// DELETE: 删除一篇文章
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: '文章未找到' });
    }
    res.json({ msg: '文章已删除' });
  } catch (err) {
    console.error(`DELETE /api/posts/${req.params.id} 错误:`, err.message);
    res.status(500).send('服务器错误');
  }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`后端服务器已启动，正在 http://localhost:${PORT} 上运行`);
});