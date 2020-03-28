// pages/my/set/mobile/mobile.js
const app = getApp()
var MCAP = require('../../../../utils/mcaptcha.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobileStatus: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    var ifBind = false
    var userInfo = app.globalData.userInfo
    if (userInfo.mobile) {
      ifBind = true
    } else {
      this.initDraw()
    }
    this.setData({
      mobile: userInfo.mobile,
      ifBind: ifBind
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
  showBingMobile: function() {
    this.setData({
      ifBind: false
    })
    this.initDraw()
  },
  changeMobile: function(event) {
    this.setData({
      mobile: event.detail.value
    })
    var that = this
    if (event.detail.value.length == 11) {
      wx.showLoading({
        title: '正在检测',
      })
      wx.request({
        url: app.globalData.path + '/api/applet/user/checkMobile',
        data: {
          mobile: event.detail.value
        },
        header: {
          appletCode: app.globalData.appletCode
        },
        success: function(res) {
          that.setData({
            mobileStatus: res.data.code
          })
          if (res.data.code == '-1') {
            app.showModal(res.data.data)
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    } else {
      that.setData({
        mobileStatus: '-1'
      })
    }
  },
  changeFigureCode: function(event) {
    this.setData({
      figureCode: event.detail.value
    })
  },
  sendVerifyCode: function() {
    if (this.data.figureCode != this.data.codeStr) {
      app.showModal('图形码输入有误')
    } else if (this.data.mobile.length != 11) {
      app.showModal('手机号码输入有误')
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      var that = this
      wx.request({
        url: app.globalData.path + '/api/applet/wechant/sendBindAppletCode',
        data: {
          mobile: this.data.mobile
        },
        header: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode
        },
        success: function(res) {
          app.showModal(res.data.data)
        },
        complete: function() {
          wx.hideLoading();
        }
      })
    }
  },
  formSubmit: function(e) {
    var info = e.detail.value
    var result = verifyMobileForm(info)
    if (result.code == 0) {
      app.showModal(result.data)
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      var that = this
      wx.request({
        url: app.globalData.path + '/api/applet/wechant/bindApplet',
        data: {
          mobile: info.mobile,
          code: info.verifyCode,
          rmdMobile: info.rmdMobile
        },
        header: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode
        },
        success: function(res) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.data,
            confirmText: '确定',
            confirmColor: that.data.color,
            showCancel: false,
            success() {
              if (res.data.code == '1') {
                wx.navigateBack({
                  delta: 2
                })
              }
            }
          })
        },
        complete: function() {
          wx.hideLoading();
        }
      })
    }
  }
})


var verifyMobileForm = function(info) {
  if (info.mobile) {
    if (info.mobile.length != 11) {
      return {
        code: 0,
        data: '手机号码输入错误'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入手机号码'
    }
  }
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
  if (info.rmdMobile) {
    if (info.rmdMobile.length != 11) {
      return {
        code: 0,
        data: '推荐号码输入错误'
      }
    }
  } else {
    info['rmdMobile'] = ''
  }
  return {
    code: 1,
    data: ''
  }
}