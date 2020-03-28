// pages/my/order/store-order/map/map.js
const app = getApp();
let QQMapWX = require('../../../../../utils/qqmap-wx-jssdk.min')
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'O3MBZ-73E3F-GCZJU-J3MVE-SAPU7-GOB5J' // YU7BZ-EWRWJ-GXEFP-KILXN-NM7C7-IUF74
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    var that = this
    wx.getStorage({
      key: 'map_list_data',
      success: function(res) {
        that.setData({
          siteList: res.data
        })
        loadMapRoute(that)
      },
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
    wx.removeStorage({
      key: 'map_list_data',
      success: function(res) {},
    })
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
  startNavigation: function() {
    var siteList = this.data.siteList
    var site = siteList[siteList.length - 1]
    wx.openLocation({
      latitude: site.latitude,
      longitude: site.longitude,
      name: site.callout.content
    })
  }
})

var loadMapRoute = function(that) {
  var siteList = that.data.siteList
  // 起点经纬度
  let lonStart = siteList[0].longitude
  let latStart = siteList[0].latitude

  var markers = []
  var points = []
  for (var i = 0; i < siteList.length; i++) {
    var marker = siteList[i]
    markers.push(marker)
    var point = {
      longitude: siteList[i].longitude,
      latitude: siteList[i].latitude
    }
    points.push(point)
  }

  // 终点的经纬度
  let lonEnd = siteList[siteList.length - 1].longitude
  let latEnd = siteList[siteList.length - 1].latitude

  that.setData({
    longitude: lonStart,
    latitude: latStart,
    scale: 18,
    markers: markers,
    points: points
  })


  //网络请求设置
  wx.request({
    //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
    url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${latStart},${lonStart}&to=${latEnd},${lonEnd}&key=${qqmapsdk.key}`,
    method: 'GET',
    dataType: 'json',
    //请求成功回调
    success: function(res) {
      let ret = res.data
      if (ret.status != 0) return; //服务异常处理
      let coors = ret.result.routes[0].polyline,
        pl = [];
      //坐标解压（返回的点串坐标，通过前向差分进行压缩）
      let kr = 1000000;
      for (let i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
      }
      //将解压后的坐标放入点串数组pl中
      for (let i = 0; i < coors.length; i += 2) {
        pl.push({
          latitude: coors[i],
          longitude: coors[i + 1]
        })
      }
      //设置polyline属性，将路线显示出来
      that.setData({
        polyline: [{
          points: pl,
          color: '#FF0000DD',
          width: 4
        }]
      })
    }
  });
}