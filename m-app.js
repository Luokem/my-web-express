var createError = require('http-errors');
var express = require('express');

var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
var cookieParser = require('cookie-parser')
// var apiRouter = express.Router()
var fs = require('fs')
var nodeJson = require('./public/javascripts/mock/nodeJson.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(function(req, res,next){
   res.header("Access-Control-Allow-Origin", req.headers.origin || '*');//指定可以http://localhost:8080,不能单单是*
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header('Access-Control-Allow-Credentials','true')
  if(req.method == 'OPTIONS') {

    //让options请求快速返回

    res.sendStatus(200);

} else {

    next();

}
}) 

app.use(cookieParser())

// apiServer.route('/')
// .get((req, res) => {
//   if(req.cookie.isFirst) {
//     console.log(req.cookie.isFirst)
//   }
//   else {
//     res.cookie('isFirst',1, {maxAge: 60 * 1000})
//   }
// })

app.route('/st-edit') 
.post((req, res) => {
  res.json({err: '0',tip: 'success'})
})

/*
  --处理图片上传
*/ 
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/pictures");
    },
    filename: function (req, file, callback) {
    	console.log(111,file.fieldname)
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("imgUpload", 3); //Field name and max count


app.route('/imgUpload')
.post((req,res) => {
 

  upload(req, res, function (err) {
    console.log(req.files)//正常这里打印不出来，因为是数组对象，有错误又可以打印出来
        if (err) {
             res.json({err:'1', tip: 'file uploader error'});
        }else {
         res.json({err: '0', tip: "file uploaded sucessfully!",data: req.files});//req.files[0].path 保存在服务器路径
        }
    });
})

/*
  编辑内容,假设用户身份为username1,
*/ 
app.route('/editContent')
.post((req, res) => {
  nodeJson.createUserInformation(req.body)
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.json(err)
  })
})

/*
  前端内容展示
*/
app.route('/qianduan')
.post((req, res) => {
  var ret = nodeJson.showQianduan(req.body)
  ret.then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.json(err)
  })
})

app.get('/public/pictures/*', function (req, res) {
    res.sendFile( __dirname + "/" + req.url );
    console.log("Request for " + req.url + " received.");
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
