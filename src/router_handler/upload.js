const {db} = require('../db/index')
const querystring = require('querystring')

const currentDirectory = __dirname;

exports.uploadAudioCover = (req, res) => {
  // 将音频封面存储地址响应给客户端
  res.send({
    status: 0,
    msg: '封面上传成功',
    code: 200,
    data: {
      cover_url: req.file.path
    }
  })
}

exports.uploadAudio = (req, res) => {
  // 将音频封面存储地址响应给客户端
  res.send({
    status: 0,
    msg: '音频上传成功',
    code: 200,
    data: {
      audio_url: req.file.path
    }
  })
}

exports.uploadUserAvatar = (req, res) => {
  // 将头像存储地址响应给客户端
  res.send({
    status: 0,
    msg: '头像上传成功',
    code: 200,
    data: {
      avatar_url: req.file.path
    }
  })
}