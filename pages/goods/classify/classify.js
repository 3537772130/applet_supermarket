// pages/classify/classify.js
const app = getApp();
const utils = require('../../../utils/appletUtil');
var top;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTop: 0,
    element: 'top-part',
    scrollTop: 0,
    topPartHeight: 0,
    typePostion1: 0,
    typePostion2: 0,
    classifyInfo: [],
    distance: 0,
    distanceText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    app.setAppletColor(this)
    // wx.hideShareMenu()
    top = 0
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
    setDistance(this)

    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/goods/loadGoodsClassify',
      header: {
        appletCode: app.globalData.appletCode
      },
      success: function (res) {
        if (res.data.code == '1') {
          that.setData({
            classifyInfo: [{
              typeList: res.data.data.typeList,
              goodsList: res.data.data.infoList
            }],
            couponList: res.data.data.couponList,
            typePostion1: 0,
            typePostion2: 0
          })
          that.setDefaultTypePostion()
          setTopPartHeight(that)
        } else {
          wx.redirectTo({
            url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data,
          })
        }
      },
      complete: function () {
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
  locationElement: function (event){
    var scrollTop = event.detail.scrollTop
    if (scrollTop > top){
      // 向下进行了滚动
      console.info("页面向下进行了滚动..." + event.detail.scrollTop)
      if (scrollTop > 0 && scrollTop < 100) {
        console.info("页面定位至but-part...")
        this.setData({
          // element: 'but-part',
          pageTop: this.data.topPartHeight + 10
        })
      }
    } else if (scrollTop < top) {
      // 向上进行了滚动
      console.info("页面向上进行了滚动..." + event.detail.scrollTop)
      if (scrollTop < this.data.topPartHeight) {
        console.info("页面定位至top-part...")
        this.setData({
          element: 'top-part',
          pageTop: 0,
          scrollTop: 0,
          typePostion1: 0,
          typePostion1: 0
        })
      }
    }
    top = scrollTop
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
    var scrollTop = event.detail.scrollTop + that.data.topPartHeight + 10
    this.setData({
      scrollTop: scrollTop,
      pageTop: this.data.topPartHeight + 10
    })
    if (scrollTop % 2 == 0) {
      var typeList = that.data.classifyInfo[0].typeList
      for (var i = 0; i < typeList.length; i++) {
        wx.createSelectorQuery()
          .select('#goodsType' + i)
          .boundingClientRect(function (rect) {
            if (rect.top == 0) {
              that.setData({
                typePostion1: rect.dataset.index
              })
              return
            }
          }).exec()
      }
    }
  },
  onClickTypePostion: function(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      typePostion1: index,
      typePostion2: index
    })
  },
  onClickGoodsTypePostion: function(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      typePostion1: index
    })
  },
  setDefaultTypePostion: function() {
    var that = this
    if (this.data.classifyInfo[0].typeList) {
      wx.getStorage({
        key: 'type_index',
        success: function(res) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          var index = res.data
          if (index) {
            that.setData({
              typePostion1: index,
              typePostion2: index
            })
          }
          wx.removeStorage({
            key: 'type_index',
            success: function(res) {},
          })
          app.hideLoading();
        }
      })
    }
  },
  loadGoodsDetails: function(event) {
    wx.navigateTo({
      url: '/pages/goods/details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  loadSearch: function() {
    wx.navigateTo({
      url: '/pages/main/search/search',
    })
  },
  gianCoupon: function(event) {
    var id = event.currentTarget.dataset.id
    userGainCoupon(this, id)
  }
})

/**
 * 获取上半部view #top-part的高度
 */
var setTopPartHeight = function(that){
  wx.createSelectorQuery().select('#top-part')
    .boundingClientRect(function (rect) {
      that.setData({
        topPartHeight: rect.height
      })
      console.info('获取到top-part的高度为：' + that.data.topPartHeight)
    }).exec()
}

/**
 * 设置当前位置到店铺的距离
 */
var setDistance = function(that) {
  wx.getLocation({
    type: 'gcj02',
    success: function(res) {
      utils.loadMapDistance(that, res.longitude, res.latitude)
    },
  })
  var index = setInterval(function() {
    if (that.data.distance > 0) {
      var text = '大约距离' + that.data.distance + '米'
      if (that.data.distance >= 1000) {
        var val = that.data.distance / 1000
        text = '大约距离' + val.toFixed(2) + '公里'
      }
      that.setData({
        distanceText: text
      })
      clearInterval(index)
    }
  }, 2 * 1000)
}

/**
 * 
 * 领取优惠券
 * 
 */
var userGainCoupon = function(that, id) {
  if (app.globalData.bindStatus) {
    wx.showLoading({
      title: '领取中',
      mask: true
    })
    //加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/user/coupon/userGainCoupon',
      data: {
        couponId: parseInt(id)
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function(res) {
        app.showModal(res.data.data)
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  } else {
    app.bindMobileShowModal()
  }
}