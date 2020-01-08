const app = getApp();
let QQMapWX = require('./qqmap-wx-jssdk.min.js')
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'O3MBZ-73E3F-GCZJU-J3MVE-SAPU7-GOB5J' // YU7BZ-EWRWJ-GXEFP-KILXN-NM7C7-IUF74
})

module.exports = {
  /**
   * 获取用户授权信息，并发起登录请求
   */
  getAuthorization: function(that) {
    wx.login({
      success(res) {
        if (res.code) {
          wx.getUserInfo({
            success(re) {
              const userInfo = re.userInfo;
              var src = '/api/applet/wechant/login'
              var loginCode = res.code
              var wxCode = ''
              if (app.globalData.userInfo){
                loginCode = ''
                wxCode = app.globalData.userInfo.wxCode
                src = '/api/applet/wechant/loadUserInfo'
              }
              var values = {
                loginCode: loginCode,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender == '1' ? true : false
              }
              wx.request({
                url: app.globalData.path + src,
                data: values,
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded', //post
                  appletCode: app.globalData.appletCode,
                  wxCode: wxCode
                },
                success: function(data) {
                  notFound(data.statusCode);
                  var info = data.data
                  if (info.code != '-1') {
                    var userInfo = info.data.userInfo
                    app.globalData.isDealer = info.data.isDealer
                    app.globalData.bindStatus = info.data.bindStatus
                    userInfo.avatarUrl = (info.data.bindStatus ? app.globalData.path + userInfo.avatarUrl : userInfo.avatarUrl)
                    app.globalData.userInfo = userInfo
                    that.setData({
                      userInfo: userInfo,
                      isDealer: info.data.isDealer
                    })
                    if (info.code == '0') {
                      app.bindMobileShowModal()
                    } 
                  } else {
                    wx.navigateTo({
                      url: '/pages/error/error?code=' + info.code + '&msg=' + info.data
                    })
                  }
                },
                complete: function() {
                  wx.hideLoading();
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 上传用户头像
   */
  uploadAvatar:function(that){
    wx.chooseImage({
      success(res) {
        const file = res.tempFiles[0]
        var modal = ''
        if (file['size'] > 3 * 1024 * 1024){
          modal = '上传图片过大，仅支持 3M 以内的图片上传'
        }
        if (modal !== ''){
          app.showModal(modal)
        } else {
          wx.showLoading({
            title: '正在上传',
          })
          wx.uploadFile({
            url: app.globalData.path + '/api/applet/user/uploadUserAvatar',
            filePath: file.path,
            name: 'avatar',
            header: {
              appletCode: app.globalData.appletCode,
              wxCode: app.globalData.userInfo.wxCode
            },
            success(res) {
              var data = JSON.parse(res.data)
              modal = data.data
              if (data.code == '1') {
                modal = '上传成功'
                app.globalData.userInfo.avatarUrl = app.globalData.path + data.data.avatarUrl + app.getTimestamp()
                that.setData({
                  userInfo: app.globalData.userInfo
                })
              }
              wx.showToast({
                title: modal,
                duration: 1500
              })
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      }
    })
  },
  /**
   * 加载地图距离
   */
  loadMapDistance: function (that, lonEnd, latEnd) {
    // 起点经纬度
    let latStart = that.data.appletInfo['lat']
    let lonStart = that.data.appletInfo['lon']

    // 获取两点的距离
    qqmapsdk.calculateDistance({
      to: [{
        latitude: latStart,
        longitude: lonStart
      }, {
        latitude: latEnd,
        longitude: lonEnd
      }],
      success: function (res) {
        console.log('两点之间的距离0：', res.result.elements[0].distance)
        console.log('两点之间的距离1：', res.result.elements[1].distance)
        console.log(res)
        that.setData({
          distance: res.result.elements[1].distance
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 加载地图路线
   */
  loadMapRoute: function (that, lonEnd, latEnd){
    // 起点经纬度
    let latStart = that.data.appletInfo['lat']
    let lonStart = that.data.appletInfo['lon']

    //网络请求设置
    let opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${latStart},${lonStart}&to=${latEnd},${lonEnd}&key=${qqmapsdk.key}`,
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
        let ret = res.data
        if (ret.status != 0) return; //服务异常处理
        let coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来
        that.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      }
    };
    wx.request(opt);
  }
}

var callback = function(code) {
  switch (code) {
    case '1':
      wx.navigateBack({
        delta: 1
      })
      break;
    case '-1':
      wx.switchTab({
        url: 'pages/main/main',
      })
      break;
  }
}

var notFound = function(code) {
  if (code != '200') {
    wx.redirectTo({
      url: '/pages/error/error',
    })
  }
}