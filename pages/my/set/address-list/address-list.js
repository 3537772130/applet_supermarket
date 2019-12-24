// pages/my/set/address/address.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTip:true,
    actions: [{
      name: '删除',
      color: '#fff',
      fontsize: '20',
      width: 100,
      icon: 'trash',
      background: '#ed3f14'
    }],
    list: [
      {
        id: 1,
        name: '周华虎啊哈',
        mobile: '17601301913',
        region: '上海市上海市松江区',
        address: '虬泾路899弄象屿都城48栋702室',
        label: 1,
        isDefault: true
      },
      {
        id: 2,
        name: '周华虎',
        mobile: '18374254725',
        region: '江苏省无锡市滨湖区',
        address: '经贸路天竺花苑(A区)85栋1903室',
        label: 2,
        isDefault: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    var that = this
    var id = setTimeout(function () {
      that.setData({
        showTip: false
      })
      clearTimeout(id)
    }, 3000);
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
  loadAddress: function(event) {
    var index = parseInt(event.currentTarget.dataset.index)
    var info = index >= 0 ? JSON.stringify(this.data.list[index]) : null
    wx.navigateTo({
      url: '/pages/my/set/address-list/address/address?info=' + info,
    })
  },
  deleteAddress:function(event){
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
  }
})