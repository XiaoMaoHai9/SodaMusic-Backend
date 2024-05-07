// 导入数据库操作模块
const {db} = require('../db/index')
const mm = require('music-metadata');
const path = require('path');

async function getDuartion(filePath){
    // 解析音频文件的元数据
    const metadata = await mm.parseFile(filePath)
    // 获取音频文件的时长（单位为秒）
    const durationInSeconds = metadata.format.duration;
    // 将小时转换为时、分、秒
    const h = durationInSeconds / 3600 > 0 ? Math.floor(durationInSeconds / 3600) : 0;
    const m = durationInSeconds % 3600 / 60 > 0 ? Math.floor(durationInSeconds % 3600 / 60) : 0;
    const s = durationInSeconds % 60 > 0 ? Math.floor(durationInSeconds % 60) : 0;
    // 格式化为MySQL的时间格式
    const formattedTime = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    return formattedTime;
}

// 上传歌曲
exports.setSongDetail = async (req, res) => {
  const songInfo = req.body
  // 1、生成歌曲编号 sid
  timestamp = Date.now()
  // // 格式化为MySQL的日期时间格式
  songInfo.add_date = new Date(timestamp).toLocaleString()
  songInfo.sid = timestamp
  // 要获取时长的音频文件夹路径
  const filePath = path.join('./', songInfo.file_url).replace(/\\/g, '/');
  try {
    songInfo.duration = await getDuartion(filePath)
  } catch (error) {
    console.error(`解析音频文件时发生错误：${error}`);
    return res.cc('解析音频文件时发生错误 !')
  }

  // 2、歌名查重
  db.query("select * from soda_music_lib where song_name=?", songInfo.song_name, (err, results) => {
    // 数据库操作错误
    if(err) return res.cc(err)
    // 歌曲已存在
    if(results.length > 0) return res.cc('该歌曲已在库中 !')
    // 3、存入数据库
    db.query('insert into soda_music_lib set?', songInfo, (err, results) => {
      if(err) return res.cc(err)
      // 判断影响行数是否为 1
      if(results.affectedRows !== 1) return res.cc('上传失败，请稍后重试！')
      // 4、返回响应结果
      res.cc('歌曲上传成功！', 0, 200)
    })
  })
}

// 获取乐库列表
exports.getSongLib = (req, res) => {
  db.query('select * from soda_music_lib where lid=?', req.query.lid, (err, results) => {
    // 执行 SQL 语句失败
    if(err) return res.cc(err)
    // if(results.length !== 1) return res.cc('获取歌曲列表失败')
    results.forEach(item => {
      item.cover_url =  item.cover_url = 'http://' + path.join(req.headers.host, '/static',item.cover_url.substring(6)).replace(/\\/g, '/')
      item.file_url =  item.file_url = 'http://' + path.join(req.headers.host, '/static',item.file_url.substring(6)).replace(/\\/g, '/')
      item.singer = JSON.parse(item.singer)
      item.style_name = JSON.parse(item.style_name)
    });
    // 将歌曲列表响应给客户端
    res.send({
      status: 0,
      msg: '获取歌曲列表成功',
      code: 200,
      data: results
    })
  })
}

// 获取歌曲详情
exports.getSongDetail = (req, res) => {}

// 修改歌曲详情
exports.modifySongDetail = (req, res) => {
  console.log(req.body);
  // 构造更新语句
  let sql = 'update soda_music_lib set ';
  const updateValues = [];
  if (req.body.song_name) {
    sql += 'song_name = ?, ';
    updateValues.push(req.body.song_name);
  }
  if (req.body.singer) {
    sql += 'singer = ?, ';
    updateValues.push(req.body.singer);
  }
  if (req.body.language) {
    sql += 'language = ?, ';
    updateValues.push(req.body.language);
  }
  if (req.body.style_name) {
    sql += 'style_name = ?, ';
    updateValues.push(req.body.style_name);
  }
  sql = sql.slice(0, -2); // 去除最后一个逗号和空格
  sql += ' where lid = ? and sid = ?'; // 添加更新条件

  // 执行更新操作
  db.query(sql, [...updateValues, req.body.lid, req.body.sid], (err, results) => {
    // 执行 SQL 语句失败
    if(err) return res.cc(err)
    // 将修改结果响应给客户端
    res.send({
      status: 0,
      msg: '详情修改成功 ！',
      code: 200
    })
  });
}

// 删除歌曲
exports.deleteSong = (req, res) => {
  db.query('delete from soda_music_lib where lid = ? and sid = ?', [req.query.lid, req.query.sid], (err, results) => {
    // 执行 SQL 语句失败
    if(err) return res.cc(err)
    // 将修改结果响应给客户端
    res.send({
      status: 0,
      msg: '删除成功 ！',
      code: 200
    })
  })
}