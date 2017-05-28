var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    title: String,
    doctor: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    // meta 创建和更新数据的时间记录
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//每次存储数据之前都先调用这个方法
movieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// movieSchema 模式的静态方法
movieSchema.statics = {
    // 取出所有数据
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt') //按照更新时间排序
            .exec(cb)
    },
    // 查询单条数据
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

// 导出movieSchema模式
module.exports = movieSchema;