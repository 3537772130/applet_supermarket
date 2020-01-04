// pages/test/test.js
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'O3MBZ-73E3F-GCZJU-J3MVE-SAPU7-GOB5J' // YU7BZ-EWRWJ-GXEFP-KILXN-NM7C7-IUF74
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openNav: true,
    site: {
      'lon': 120.275495927,
      'lat': 31.525915299
    },
    appletInfo: {
      'lon': 120.2753334,
      'lat': 31.527484388
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadMapDistance()
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
  loadMapDistance: function() {
    var that = this
    // 起点经纬度
    let latStart = this.data.site['lat']
    let lonStart = this.data.site['lon']
    // 终点经纬度
    let latEnd = this.data.appletInfo['lat']
    let lonEnd = this.data.appletInfo['lon']
    this.setData({
      latitude: latStart,
      longitude: lonStart,
      scale: 16,
      markers: [{
          id: 0,
          latitude: latStart,
          longitude: lonStart,
          iconPath: '/images/location.png'
        },
        {
          id: 1,
          latitude: latEnd,
          longitude: lonEnd,
          iconPath: '/images/location.png'
        }
      ]
    })

    // 获取两点的距离
    qqmapsdk.calculateDistance({
      to: [{
        latitude: latStart,
        longitude: lonStart
      }, {
        latitude: latEnd,
        longitude: lonEnd
      }],
      success: function(res) {
        console.log('两点之间的距离0：', res.result.elements[0].distance);
        console.log('两点之间的距离1：', res.result.elements[1].distance);
        console.log(res);
        that.setData({
          resultDistance: res.result.elements[1].distance + '米'
        });
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });

    //网络请求设置
    let opt = {
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
    };
    wx.request(opt);
  }
})