const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
});

// 重写 toJSON 方法
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // 将 _id 转换为 id
        delete returnedObject._id; // 删除 _id
        delete returnedObject.__v; // 删除 __v
    },
});

module.exports = mongoose.model('Blog', blogSchema);
