// pages/main/main.js
const app = getApp();
const utils = require('../../utils/appletUtil');
const loadLength = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLogo: 'MAIN',
    scrollTop: 0,
    mainList: [],
    showList: [],
    showLength: loadLength,
    recommendGoodsList: [],
    recommendGoodsIndex: 0,
    recommendShow: false,
    ifSupport: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.setAppletColor(this)
    wx.setNavigationBarTitle({
      title: app.globalData.appletInfo.appletName //页面标题为路由参数
    })
    app.getClientIp()
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
    var biColor = '';
    switch (this.data.appletInfo.systemColor) {
      case '#1afa29':
        biColor = 'top, #7CCD7C, #1afa29, #C1FFC1'
        break;
      case '#1296db':
        biColor = 'top, #6495ED, #1296db, #87CEFA'
        break;
      case '#fd8403':
        biColor = 'top, #bfbfbf, #fd8403, #FFFACD'
        break;
      case '#ff6347':
        biColor = 'top, #FF0000, #FF6347, #FFD39B'
        break;
      case '#8470FF':
        biColor = 'top, #8470FF, #9198e5, #7EC0EE'
        break;
      case '#FF6EC7':
        biColor = 'top, #FF6EC7, #EE799F, #EE82EE'
        break;
    }
    this.setData({
      biColor: biColor
    })
    loadPageInfo(this)
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
  scrollToLower: function() {
    var mainList = this.data.mainList
    var showList = this.data.showList
    var showLength = this.data.showLength
    if (mainList.length > showLength) {
      // 计算页面元素能够加载的集合长度
      var length = 0
      var ifSupport = false
      if ((mainList.length - showLength) > loadLength) {
        length = showLength + loadLength
      } else {
        length = mainList.length + 1
        ifSupport = true
      }
      for (var i = showLength; i < length; i++) {
        showList.push(mainList[i])
      }
      this.setData({
        showList: showList,
        showLength: length,
        ifSupport: ifSupport
      })
    }
  },
  loadSearch: function() {
    wx.navigateTo({
      url: '/pages/main/search/search',
    })
  },
  // loadGoodsDetails: function(event) {
  //   var goodsId = event.currentTarget.dataset.id;
  //   console.log("获取到商品编号：", goodsId);
  // },
  loadGoodsType: function(event) {
    wx.setStorage({
      key: 'type_index',
      data: event.currentTarget.dataset.index
    })
    wx.switchTab({
      url: '/pages/goods/classify/classify'
    })
  },
  loadGoodsDetails: function(event) {
    try{
      var index = event.currentTarget.dataset.index
      if (index >= 0) {
        closeRecommend(this, index)
      }
    } catch(e){

    }
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  closeRecommend: function(event) {
    var index = event.currentTarget.dataset.index
    closeRecommend(this, index)
  }
})

var loadPageInfo = function(that) {
  //获取当前页面信息
  wx.request({
    url: app.globalData.path + '/api/applet/page/queryAppletPageInfo',
    data: {
      pageLogo: that.data.pageLogo
    },
    header: {
      appletCode: app.globalData.appletCode
    },
    success: function(res) {
      if (res.data.code == '1') {
        var data = res.data.data
        var mainList = JSON.parse(data.contentJson)
        var showList = []
        var showLength = loadLength
        for (var i = 0; i < showLength; i++) {
          showList.push(mainList[i])
        }
        that.setData({
          mainList: mainList,
          showList: showList,
          showLength: showLength,
          scrollTop: 0
        })
        if (app.globalData.recommendShow) {
          that.setData({
            recommendGoodsList: app.globalData.recommendGoodsList,
            recommendShow: true
          })
        }
      } else {
        wx.navigateTo({
          url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data
        })
      }
    },
    complete: function() {
      app.hideLoading();
    }
  })
}

var closeRecommend = function(that, index) {
  var recommendGoodsList = that.data.recommendGoodsList
  if (recommendGoodsList.length > 1) {
    that.setData({
      recommendGoodsIndex: index + 1
    })
  } else {
    app.globalData.recommendShow = false
    that.setData({
      recommendShow: false
    })
  }
}