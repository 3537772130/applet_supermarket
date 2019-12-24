// pages/my/set/info/info.js
const app = getApp()
const utils = require('../../../../utils/appletUtil');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    this.setData({
      sexItems: [{
          name: '男',
          value: 1,
          checked: app.globalData.userInfo.gender == '1'
        },
        {
          name: '女',
          value: '0',
          checked: app.globalData.userInfo.gender == '0'
        }
      ],
      gender: app.globalData.userInfo.gender,
      birthday: app.globalData.userInfo.birthday
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
  uploadImage: function() {
    utils.uploadAvatar(this)
  },
  radioChange: function(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  formSubmitInfo: function(e) {
    var info = e.detail.value
    var result = verifyForm(info)
    if (result.code == 0) {
      app.showModal(result.data)
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      var that = this
      wx.request({
        url: app.globalData.path + '/api/applet/wechat/updateUserInfo',
        data: {
          appletCode: app.globalData.appletCode,
          wxCode: app.globalData.userInfo.wxCode,
          nickName: info.nickName,
          gender: that.data.gender,
          birthday: that.data.birthday,
          email: info.email
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

var verifyForm = function(info) {
  if (info.nickName) {
    if (info.nickName.length < 1 || info.nickName.length > 20) {
      return {
        code: 0,
        data: '昵称长度为6-20个字符'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入昵称'
    }
  }
  if (info.email) {
    if (info.email.length < 6 || info.email.length > 30) {
      return {
        code: 0,
        data: '邮箱格式不正确'
      }
    }
  }
  return {
    code: 1,
    data: ''
  }
}