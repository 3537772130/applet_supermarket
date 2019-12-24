// pages/test/test.js
const {
  $Message
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
    toggle2: false,
    actions2: [{
      name: '删除',
      color: '#ed3f14'
    }],
    actions: [{
        name: '喜欢',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'like',
        background: '#ed3f14'
      },
      {
        name: '返回',
        width: 100,
        color: '#80848f',
        fontsize: '20',
        icon: 'undo'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  handleCancel2() {
    this.setData({
      visible2: false,
      toggle: this.data.toggle ? false : true
    });
    console.log(this.data.toggle, 111111111)
  },
  handleClickItem2() {
    const action = [...this.data.actions2];
    action[0].loading = true;

    this.setData({
      actions2: action
    });

    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions2: action,
        toggle: this.data.toggle ? false : true
      });

    }, 2000);
  },
  handlerCloseButton() {
    this.setData({
      toggle2: this.data.toggle2 ? false : true
    });
  },
  actionsTap() {
    this.setData({
      visible2: true
    });
  },
  handlerButton(){
    console.log('进来啦。。')
  }
})