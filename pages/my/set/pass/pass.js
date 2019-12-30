// pages/my/set/pass/pass.js
const app = getApp()
var MCAP = require('../../../../utils/mcaptcha.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    current: '',
    imgNum: 0,
    figureCode: '',
    codeStr: '', //生成的验证码
    code: '', //输入的验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    this.setData({
      mobile: app.globalData.userInfo.mobile,
      current: 'tab1'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
    if (detail.key == 'tab2') {
      this.initDraw()
    }
  },
  initDraw() {
    var codes = '';
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        codes += chars.charAt(Math.random() * 48 - 1);
      }
    }
    this.setData({
      codeStr: codes //生成的验证码
    })
    new MCAP({
      el: 'canvas',
      width: 80,
      height: 25,
      code: codes
    });
  },
  formSubmitPass: function (e) {
    var info = e.detail.value
    var result = verifyPassForm(info)
    if (result.code == 0) {
      app.showModal(result.data)
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      var that = this
      wx.request({
        url: app.globalData.path + '/api/applet/user/updateUserPassToPass',
        data: {
          oldPass: info.oldPass,
          newPass: info.newPass
        },
        header: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode
        },
        success: function (res) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.data,
            confirmText: '确定',
            confirmColor: that.data.color,
            showCancel: false,
            success() {
              if (res.data.code == '1') {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  },
  changeFigureCode: function (event) {
    this.setData({
      figureCode: event.detail.value
    })
  },
  sendVerifyCode: function () {
    if (this.data.figureCode != this.data.codeStr) {
      app.showModal('图形码输入有误')
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      var that = this
      wx.request({
        url: app.globalData.path + '/api/applet/user/sendUpdatePassVerifyCode',
        header: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode
        },
        success: function (res) {
          app.showModal(res.data.data)
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  },
  formCodeSubmit: function (e) {
    var info = e.detail.value
    var result = verifyCodeForm(info)
    if (result.code == 0) {
      app.showModal(result.data)
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      var that = this
      wx.request({
        url: app.globalData.path + '/api/applet/user/updateUserPassToCode',
        data: {
          pass: info.pass,
          code: info.verifyCode
        },
        header: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode
        },
        success: function (res) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.data,
            confirmText: '确定',
            confirmColor: that.data.color,
            showCancel: false,
            success() {
              if (res.data.code == '1') {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  }
})

var verifyPassForm = function (info) {
  if (info.oldPass) {
    if (info.oldPass.length < 6 || info.oldPass.length > 20) {
      return {
        code: 0,
        data: '旧密码长度为6-20'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入旧密码'
    }
  }
  if (info.newPass) {
    if (info.newPass.length < 6 || info.newPass.length > 20) {
      return {
        code: 0,
        data: '新密码长度为6-20'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入新密码'
    }
  }
  if (info.confirmPass) {
    if (info.confirmPass.length < 6 || info.confirmPass.length > 20) {
      return {
        code: 0,
        data: '确认密码长度为6-20'
      }
    } else if (info.confirmPass != info.newPass) {
      return {
        code: 0,
        data: '确认密码输入不一致'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入确认密码'
    }
  }
  return {
    code: 1,
    data: ''
  }
}

var verifyCodeForm = function (info) {
  if (info.verifyCode) {
    if (info.verifyCode.length != 6) {
      return {
        code: 0,
        data: '验证码输入错误'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入验证码'
    }
  }
  if (info.pass) {
    if (info.pass.length < 6 || info.pass.length > 20) {
      return {
        code: 0,
        data: '新密码长度为6-20'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入新密码'
    }
  }
  return {
    code: 1,
    data: ''
  }
}