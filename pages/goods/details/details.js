// pages/goods/details/details.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselIndex: 1,
    showModalStatus: false,
    specs: {},
    chooseSpecsIndex: 0,
    specsNumber: 1,
    countPrice: 0.00,
    remark: '',
    visible1: false,
    actions1: [{
        name: '分享到好物圈',
        icon: 'share'
      },
      {
        name: '发送给朋友',
        openType: 'share'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    this.setData({
      path: app.globalData.path
    })
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //加载小程序信息
    wx.request({
      url: app.globalData.path + '/api/applet/goods/loadGoodsDetails',
      data: {
        appletCode: app.globalData.appletCode,
        goodsId: options.id
      },
      success: function(res) {
        if (res.data.code == '1') {
          that.setData({
            info: res.data.data.info,
            fileList: res.data.data.fileList,
            specsList: res.data.data.specsList,
            specs: res.data.data.specsList[0],
            countPrice: res.data.data.specsList[0].sellPrice
          })
          wx.setNavigationBarTitle({
            title: res.data.data.info.goodsName //页面标题为路由参数
          })
          wx.showShareMenu({
            withShareTicket: true
          })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.setAppletColor(this)
    var that = this
    setInterval(function() {
      that.setData({
        timestamp: app.getTimestamp()
      })
    }, 180 * 1000)
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
    var that = this;
    var shareObj = {
      title: this.data.info.goodsName,
      path: '/pages/goods/details/details?id=' + this.data.info.id,
      imgUrl: this.data.path + this.data.info.coverSrc,
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success'
          });
        }
      },
      fail: function(res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          console.info("用户取消分享...")
        } else if (res.errMsg == 'shareAppMessage:fail') {
          console.info("用户分享失败...", res)
        }
      }
    }
    return shareObj;
  },
  shareHWQ: function() {
    if (wx.openBusinessView) {
      var fileList = this.data.fileList
      var srcList = []
      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i]
        if (file.fileType == 1 && file.fileSrc != null) {
          srcList.push(file.fileSrc)
        }
      }
      wx.openBusinessView({
        businessType: 'friendGoodsRecommend',
        extraData: {
          product: {
            item_code: this.data.info.id, //物品id 唯一
            title: this.data.info.goodsName, // 物品名称
            image_list: srcList
          }
        },
        success: function(res) {
          if (res.errCode === 1) {
            wx.showToast({
              title: '推荐成功'
            });
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '推荐失败',
            icon: 'none'
          });
        }
      })
    }
  },
  carouselChage: function(e) {
    this.setData({
      carouselIndex: parseInt(e.detail.current) + 1
    })
  },
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function(currentStatu) {
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
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  chooseSpecsData: function(event) {
    var index = event.currentTarget.dataset.index
    var specs = this.data.specsList[index]
    this.setData({
      specs: specs,
      chooseSpecsIndex: index,
      countPrice: specs.actualPrice * this.data.specsNumber
    })
  },
  addSpecsNumber: function() {
    var specsNumber = this.data.specsNumber + 1
    specsNumber = specsNumber > 99 ? 99 : specsNumber
    this.setData({
      specsNumber: specsNumber,
      countPrice: this.data.specs.sellPrice * specsNumber
    })
  },
  reduceSpecsNumber: function() {
    var specsNumber = this.data.specsNumber - 1
    specsNumber = specsNumber < 1 ? 1 : specsNumber
    this.setData({
      specsNumber: specsNumber,
      countPrice: this.data.specs.sellPrice * specsNumber
    })
  },
  inputRemark: function(event) {
    this.setData({
      remark: event.detail.value
    })
  },
  loadCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  handleOpen1() {
    this.setData({
      visible1: true
    });
  },
  handleCancel1() {
    this.setData({
      visible1: false
    });
  },
  handleClickItem1({
    detail
  }) {
    const index = detail.index;
    switch (index) {
      case 0:
        this.shareHWQ()
        break;
      case 1:
        this.onShareAppMessage();
        break;
    }
  },
  addCart: function() {
    var goods = {
      id: this.data.info.id,
      name: this.data.info.goodsName,
      amount: this.data.specsNumber,
      remark: this.data.remark,
      ifSelected: false,
      specs: {
        id: this.data.specs.id,
        specsText: this.data.specs.specsText,
        specsSrc: this.data.specs.specsSrc,
        actualPrice: this.data.specs.sellPrice
      }
    }
    var bool = true
    var list = []
    var goodsList = app.globalData.cartGoodsList
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].id == goods.id) {
        bool = false
        list.push(goods)
      } else {
        list.push(goodsList[i])
      }
    }
    if (bool) {
      list.push(goods)
    }
    app.globalData.cartGoodsList = list
    this.setData({
      specs: this.data.specsList[0],
      countPrice: this.data.specsList[0].sellPrice,
      specsNumber: 1,
      chooseSpecsIndex: 0,
      remark: ''
    })
    wx.showToast({
      title: '加入成功',
      icon: 'success'
    });
  }
})