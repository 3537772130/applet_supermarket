const app = getApp();

module.exports = {
  //获取用户授权信息
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
                      userInfo: userInfo
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