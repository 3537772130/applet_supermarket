// pages/classify/classify.js
const app = getApp()
const utils = require('../../../utils/appletUtil')
var ifPostion = true
var top

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLogo: 'CLASSIFY',
    pageTop: 0,
    showModalStatus: false,
    element: 'top-part',
    scrollTop: 0,
    topPartHeight: 0,
    typePostion1: 0,
    typePostion2: 0,
    classifyInfo: [],
    distance: 0,
    distanceText: '',
    couponIdList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.setAppletColor(this)
    // wx.hideShareMenu()
    top = 0
    wx.setNavigationBarTitle({
      title: app.globalData.appletInfo.appletSimple //页面标题为路由参数
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
    setDistance(this)
    var that = this
    this.setData({
      showModalStatus: false
    })
    wx.getStorage({
      key: 'coupon_id_list',
      success: function(res) {
        that.setData({
          couponIdList: res.data
        })
      },
    })
    //加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/page/loadGoodsClassify',
      header: {
        appletCode: app.globalData.appletCode
      },
      success: function(res) {
        if (res.data.code == '1') {
          that.setData({
            classifyInfo: [{
              typeList: res.data.data.typeList,
              goodsList: res.data.data.infoList
            }],
            couponList: res.data.data.couponList,
          })
          updateCouponStatus(that)
          that.setDefaultTypePostion()
          setTopPartHeight(that)
        } else {
          wx.redirectTo({
            url: '/pages/error/error?code=' + res.data.code + '&msg=' + res.data.data,
          })
        }
      },
      complete: function() {
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
  locationElement: function(event) {
    var scrollTop = event.detail.scrollTop
    // console.info("当前页面滚动高度为：" + event.detail.scrollTop)
    if (scrollTop > top) {
      // 向下进行了滚动
      // console.info("页面向下进行了滚动...")
      if (scrollTop > 0 && scrollTop < this.data.topPartHeight) {
        this.setData({
          pageTop: this.data.height + 35,
          element: 'bottom-part'
        })
      }
    } else if (scrollTop < top) {
      // 向上进行了滚动
      // console.info("页面向上进行了滚动...")
      if (scrollTop < this.data.topPartHeight) {
        this.setData({
          element: 'top-part',
          scrollTop: 0
        })
      }
    }
    top = scrollTop
  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },
  //goods scroll-view滚动执行方式
  onChangeScroll(event) {
    var that = this;
    var scrollTop = event.detail.scrollTop + that.data.topPartHeight + 5
    // this.setData({
    //   scrollTop: scrollTop,
    //   pageTop: this.data.topPartHeight
    // })
    if (event.detail.scrollTop === 0) {
      this.setData({
        scrollTop: scrollTop,
        element: 'top-part'
      })
    } else {
      this.setData({
        scrollTop: scrollTop,
        element: 'bottom-part'
      })
    }
    // console.info("当前商品滚动高度为：" + event.detail.scrollTop)
    var typeList = that.data.classifyInfo[0].typeList
    for (var i = 0; i < typeList.length; i++) {
      wx.createSelectorQuery()
        .select('#goodsType' + i)
        .boundingClientRect(function (rect) {
          // console.info(i + "当前分类index" + rect.dataset.index + "的top为：" + rect.top)
          if (rect.top === 0) {
            // console.info("选择分类index为：" + rect.dataset.index)
            that.setData({
              typePostion1: rect.dataset.index
            })
          }
        }).exec()
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
        },
        fail: function() {
          that.setData({
            typePostion1: 0,
            typePostion2: 0
          })
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
    var index = event.currentTarget.dataset.index
    userGainCoupon(this, id, index)
  },
  powerDrawer: function(e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.util(currentStatus)
  },
  util: function(currentStatus) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatus == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatus == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  }
})

/**
 * 获取上半部view #top-part的高度
 */
var setTopPartHeight = function(that) {
  wx.createSelectorQuery().select('#top-part')
    .boundingClientRect(function(rect) {
      that.setData({
        topPartHeight: rect.height
      })
      console.info('获取到top-part的高度为：' + rect.height)
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
      var text = '距离约' + that.data.distance + '米'
      if (that.data.distance >= 1000) {
        var val = that.data.distance / 1000
        text = '距离约' + val.toFixed(2) + '公里'
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
var userGainCoupon = function(that, id, index) {
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
        if (res.data.code !== '-1') {
          var couponIdList = that.data.couponIdList
          couponIdList.push(that.data.couponList[index].id)
          wx.setStorage({
            key: 'coupon_id_list',
            data: couponIdList,
          })
          updateCouponStatus(that)
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  } else {
    app.bindMobileShowModal()
  }
}

var updateCouponStatus = function(that) {
  var couponList = that.data.couponList
  var couponIdList = that.data.couponIdList
  for (var i = 0; i < couponList.length; i++) {
    for (var k = 0; k < couponIdList.length; k++) {
      if (couponList[i].id === couponIdList[k]) {
        couponList[i].status = 2
        break
      }
    }
  }
  that.setData({
    couponList: couponList
  })
}