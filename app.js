var express = require('express'); // 加载express模块（需要安装）
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // 加载mongoose模块（需要安装）
var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段（需要安装）
var movie = require('./models/movie.js'); // 载入mongoose编译后的模型movie

var app = express();

app.locals.moment = require('moment'); // 载入moment模块，格式化日期

var port = process.env.PORT || 3000;  //设置在3000端口
app.listen(port);  //监听3000端口
console.log('start on ' + port);  //控制台端口显示

// 所有通过 express.static 访问的文件都存放在一个“虚拟（virtual）”目录（即目录根本不存在）下面，
// 可以通过为静态资源目录指定一个挂载路径的方式来实现
// head中配置加/static前缀
app.use('/static', express.static('public'));

// 表单操作需要
app.use(bodyParser.urlencoded({extended: true}));

// 设置视图默认的文件路径，和模版引擎
app.set('views', './views/pages');
app.set('view engine', 'jade');

mongoose.Promise = global.Promise; //会让迷之警告消失
mongoose.connect('mongodb://localhost:27017/imovie'); // 连接mongodb本地数据库imovie
console.log('connection success');

app.get('/', function (req, res) {
    movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies
        })
    })
});

// 详情页
app.get('/movie/:id', function (req, res) {
    var id = req.params.id; //通过这个方法拿到id
    movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'movie  ',
            movie: movie
        })
    })
});

// 后台录入页
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

// 后台更新页
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
});

// 后台录入提交
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if (id !== 'undefined') { // 已经存在的电影数据
        movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _underscore.extend(movie, movieObj); // 用新对象里的字段替换老的字段
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {  // 新加的电影数据
        _movie = new movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        })
    }
});

// list列表页
app.get('/admin/list', function (req, res) {
    movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '列表页',
            movies: movies
        })
    })
});

// 列表页删除电影
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        })
    }
});