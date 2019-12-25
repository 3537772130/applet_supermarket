// pages/my/set/address/address.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTip:true,
    isChosse: '0', //是否选择： 0关闭   1启用
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
        lon: 0.0000,
        lat: 0.0000,
        label: 1,
        isDefault: true
      },
      {
        id: 2,
        name: '周华虎',
        mobile: '18374254725',
        region: '江苏省无锡市滨湖区',
        address: '经贸路天竺花苑(A区)85栋1903室',
        lon: 0.0000,
        lat: 0.0000,
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
    wx.hideShareMenu()
    this.setData({
      isChosse: options.isChosse
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
    var id = setTimeout(function () {
      that.setData({
        showTip: false
      })
      clearTimeout(id)
    }, 2000)
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
    var that = this
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    wx.showModal({
      title: '温馨提示',
      content: '确定删除收货人为【' + name + '】的地址吗？',
      success(res) {
        if (res.confirm) {
          var list = that.data.list
          var newList = []
          for (var i = 0; i < list.length; i++){
            if (list[i].id === id){
              // 删除地址
            } else {
              newList.push(list[i])
            }
          }
          that.setData({
            list: newList
          })
        }
      }
    })
  },
  chooseAddress: function (event){
    if (this.data.isChosse === '1'){
      var index = event.currentTarget.dataset.index
      var site = this.data.list[index]
      wx.setStorage({
        key: 'choose_site',
        data: site
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})