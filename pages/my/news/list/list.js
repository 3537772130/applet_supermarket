// pages/my/news/list/list.js
const app = getApp();
var page = 1,
  pageSize = 10,
  ifGoods = true

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    totalCount: 0,
    isNull: true,
    ifMore: false,
    type: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    page = 1
    pageSize = 10
    ifGoods = true
    this.setData({
      type: parseInt(options.type)
    })
    loadNewsList(this)
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
    if (this.data.totalCount > (page * pageSize)) {
      page++
      loadNewsList(this)
    } else {
      var that = this
      this.setData({
        ifMore: true
      })
      var index = setInterval(function () {
        clearInterval(index)
        that.setData({
          ifMore: false
        })
      }, 3000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loadSystemDetails: function(e){
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    var info = list[index]
    info.relationStatus = 1
    this.setData({
      list: list
    })
    wx.navigateTo({
      url: '/pages/my/news/details/details?id=' + info.id,
    })
  },
  loadCommentDetails: function(e){
    if (ifGoods){
      var index = e.currentTarget.dataset.index
      var list = this.data.list
      var newList = []
      var info = list[index]
      for (var i = 0; i < list.length; i++){
        if (i != index){
          newList.push(list[i])
        }
      }
      this.setData({
        list: newList
      })
      wx.navigateTo({
        url: '/pages/goods/comment/details/details?id=' + info.relationId,
      })
    }
    ifGoods = true
  },
  loadGoodsDetails: function(e){
    ifGoods = false
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + id,
    })
  }
})

var loadNewsList = function(that){
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/user/loadNewByPage',
    data: {
      type: parseInt(that.data.type),
      page: page,
      pageSize: pageSize
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function (res) {
      if (res.data.code == '1') {
        var totalCount = res.data.data.totalCount
        if (totalCount > 0) {
          var list = that.data.list
          var dataSource = res.data.data.dataSource
          for (var i = 0; i < dataSource.length; i++) {
            list.push(dataSource[i])
          }
          that.setData({
            totalCount: totalCount,
            list: list,
            isNull: false
          })
        }
      } else {
        that.setData({
          isNull: true
        })
      }
    },
    complete: function () {
      app.hideLoading()
    }
  })
}