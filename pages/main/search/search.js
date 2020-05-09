// pages/main/search/search.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    goodsName: '',
    placeholder: '请输入商品名称...',
    historyList: [],
    recommendGoodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    // wx.hideShareMenu()
    var that = this
    wx.request({
      url: app.globalData.path + '/api/applet/goods/loadRecommendGoodsList',
      header: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          that.setData({
            recommendGoodsList: res.data.data
          })
        }
      }
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
    var that = this
    wx.getStorage({
      key: 'history-list',
      success: function(res) {
        that.setData({
          historyList: res.data
        })
      },
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
  inputGoodsName: function(e) {
    var goodsName = e.detail.value
    var placeholder = goodsName === '' ? '请输入商品名称...' : ''
    this.setData({
      goodsName: goodsName,
      placeholder: placeholder
    })
  },
  searchGoodsName: function() {
    var goodsName = this.data.goodsName
    this.loadGoodsList(goodsName)
  },
  clearGoodaName: function(){
    this.setData({
      goodsName: '',
      placeholder: '请输入商品名称...',
      list: []
    })
  },
  loadGoodsList: function (goodsName) {
    if (goodsName) {
      var that = this
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.path + '/api/applet/goods/queryGoodsName',
        data: {
          goodsName: goodsName
        },
        header: {
          appletCode: app.globalData.appletCode
        },
        success: function (res) {
          if (res.data.code == '1') {
            var data = res.data.data
            that.setData({
              scrollTop: 0,
              list: data.list,
              recommendGoodsList: data.recommendGoodsList
            })
            updateStorage(that, goodsName)
          } else {
            wx.showToast({
              title: '未找到相关商品 >_<',
              icon: 'none',
              duration: 2000
            })
          }
        },
        complete: function () {
          wx.hideLoading();
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

var updateStorage = function(that, name){
  wx.getStorage({
    key: 'history-list',
    success: function(res) {
      var list = res.data
      var list1 = []
      list1.push(name)
      var length = list.length >= 6 ? 5 : list.length
      for (var i = 0; i < length; i++){
        list1.push(list[i])
      }
      that.setData({
        historyList: list
      })
      wx.setStorage({
        key: 'history-list',
        data: list,
      })
    },
    fail: function(){
      var list = []
      list.push(name)
      that.setData({
        historyList: list
      })
      wx.setStorage({
        key: 'history-list',
        data: list,
      })
    }
  })
}