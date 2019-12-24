// pages/classify/classify.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    typePostion1: 0,
    typePostion2: 0,
    classifyInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    app.setAppletColor(this)
    this.setData({
      path: app.globalData.path,
      height: app.globalData.height
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
    app.setAppletColor(this)
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/goods/loadGoodsClassify',
      data: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          that.setData({
            classifyInfo: [{
              id: 1,
              typeList: res.data.data.typeList,
              goodsList: res.data.data.infoList
            }],
            typePostion1: res.data.data.typeList[0].id,
            typePostion2: res.data.data.typeList[0].id
          })
          that.setDefaultTypePostion()
        } else {
          wx.redirectTo({
            url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data,
          })
        }
        app.hideLoading();
      }
    })
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
  //页面滚动执行方式
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
  },
  //goods scroll-view滚动执行方式
  onChangeScroll(event) {
    var that = this;
    var scrollTop = event.detail.scrollTop;
    that.setData({
      scrollTop: scrollTop
    })
    if (scrollTop % 2 == 0) {
      var typeList = this.data.classifyInfo[0].typeList;
      for (var i = 0; i < typeList.length; i++) {
        var typeIndex;
        wx.createSelectorQuery().select('#goodsType' + typeList[i].id).boundingClientRect(function(rect) {
          if (rect.top == 0) {
            that.setData({
              typePostion1: rect.dataset.id
            })
          }
        }).exec()
      }
    }
  },
  onClickTypePostion: function(event) {
    var typeId = event.currentTarget.dataset.id;
    this.setData({
      typePostion1: typeId,
      typePostion2: typeId
    })
  },
  onClickGoodsTypePostion: function(event) {
    var typeId = event.currentTarget.dataset.id;
    this.setData({
      typePostion1: typeId
    })
  },
  onClickType: function(event) {
    var typeId = event.currentTarget.dataset.id;
    this.setData({
      typeId: typeId
    })
  },
  setDefaultTypePostion: function() {
    var that = this
    if (this.data.classifyInfo[0].typeList){
      wx.getStorage({
        key: 'typeId',
        success: function (res) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          var typeId = res.data
          if (typeId) {
            that.setData({
              typePostion1: typeId,
              typePostion2: typeId
            })
          }
          wx.removeStorage({
            key: 'typeId',
            success: function (res) { },
          })
          app.hideLoading();
        }
      })
    }
  },
  loadGoodsDetails: function (event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  }
})