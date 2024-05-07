const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// 导入账户路由处理函数的对应模块
const upload_handler = require('../router_handler/upload')

// 设置存储位置和文件名
const avatar_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/db/images/avatar'); // 存储位置
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件名
  }
});
const audio_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/db/audios'); // 存储位置
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件名
  }
});
const cover_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/db/images/cover'); // 存储位置
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件名
  }
});

// 初始化multer中间件
const upload_avatar = multer({ storage: avatar_storage });
const upload_audio = multer({ storage: audio_storage });
const upload_cover = multer({ storage: cover_storage });

// 上传头像
router.post('/avatar', upload_avatar.single('avatar'), upload_handler.uploadUserAvatar)
// 上传音频文件
router.post('/songfile', upload_audio.single('audio'), upload_handler.uploadAudio)
// 上传音频封面
router.post('/cover', upload_cover.single('cover'), upload_handler.uploadAudioCover)

module.exports = router