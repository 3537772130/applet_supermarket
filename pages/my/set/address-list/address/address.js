// pages/my/set/address-list/address/address.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    if (options.info !== '') {
      var info = JSON.parse(options.info)
      this.setData({
        info: info
      })
    } else {
      this.setData({
        info: {
          id: 0
        }
      })
    }
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
  inputName: function(e){
    var info = this.data.info
    info['name'] = e.detail.value
    this.setData({
      info: info
    })
  },
  inputMobile: function(e){
    var info = this.data.info
    info['mobile'] = e.detail.value
    this.setData({
      info: info
    })
  },
  loadLocation: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          success: function(re) {
            var info = that.data.info
            info['region'] = re.address
            info['address'] = re.name
            info['lat'] = re.latitude
            info['lon'] = re.longitude
            that.setData({
              info: info
            })
          },
        })
      }
    })
  },
  inputAddress: function(e){
    var info = this.data.info
    info['address'] = e.detail.value
    this.setData({
      info: info
    })
  },
  chooseLabel: function(event) {
    var label = parseInt(event.currentTarget.dataset.label)
    var info = this.data.info
    info['label'] = parseInt(label)
    this.setData({
      info: info
    })
  },
  switch1Change: function() {
    var info = this.data.info
    info['isDefault'] = !info.isDefault
    this.setData({
      info: info
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
        url: app.globalData.path + '/api/applet/user/addReceiveAddress',
        data: {
          id: parseInt(info.id),
          name: info.name,
          mobile: info.mobile,
          region: info.region,
          address: info.address,
          lon: info.lon,
          lat: info.lat,
          label: parseInt(info.label),
          isDefault: info.isDefault
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
                  delta: 1
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
  if (info.name) {
    if (info.name.length < 1 || info.name.length > 20) {
      return {
        code: 0,
        data: '收货人长度为1-20个字符'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入收货人'
    }
  }
  if (info.mobile) {
    if (info.mobile.length !== 11) {
      return {
        code: 0,
        data: '联系号码格式不正确'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入联系号码'
    }
  }
  if (info.region) {} else {
    return {
      code: 0,
      data: '请选择地区'
    }
  }
  if (info.address) {
    if (info.address.length < 1 || info.address.length > 50) {
      return {
        code: 0,
        data: '详细地址长度为1-50个字符'
      }
    }
  } else {
    return {
      code: 0,
      data: '请输入详细地址'
    }
  }
  if (info.label) {} else {
    return {
      code: 0,
      data: '请选择标签'
    }
  }
  return {
    code: 1,
    data: ''
  }
}