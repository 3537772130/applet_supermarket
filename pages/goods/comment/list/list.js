// pages/goods/comment/list/list.js
const app = getApp();
var page = 1,
  pageSize = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: '',
    list: [],
    count: 0,
    isNull: true,
    ifMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    page = 1
    pageSize = 10
    this.setData({
      goodsId: options.id,
      isNull: true
    })
    loadList(this)
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
      key: 'del_comment_id',
      success: function(res) {
        var id = res.data
        var list = that.data.list
        var newList = []
        for (var i = 0;i < list.length;i++){
          if (id != list[i].id){
            newList.push(list[i])
          }
        }
        that.setData({
          list: newList
        })
        wx.removeStorage({
          key: 'del_comment_id'
        })
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
    if (this.data.count > (page * pageSize)){
      page++
      loadList(this)
    } else {
      var that = this
      this.setData({
        ifMore: true
      })
      var index = setInterval(function(){
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
  loadDetails: function(event){
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/comment/details/details?id=' + id,
    })
  }
})

var loadList = function(that) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/comment/queryCommentListByPage',
    data: {
      id: parseInt(that.data.goodsId),
      page: page,
      pageSize: pageSize
    },
    header: {
      appletCode: app.globalData.appletCode
    },
    success: function(res) {
      if (res.data.code === '1') {
        var infoList = res.data.data.dataSource
        var count = res.data.data.totalCount
        var list = that.data.list
        for (var i = 0; i < infoList.length; i++) {
          list.push(infoList[i])
        }
        that.setData({
          list: list,
          count: count,
          isNull: !count > 0
        })
      }
    },
    complete: function() {
      app.hideLoading();
    }
  })
}