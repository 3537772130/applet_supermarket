// pages/goods/comment/comment.js
const app = getApp()
var commentImg = null, imageId = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    goodsName: '',
    ifSub: false,
    visible1: false,
    actions1: [{
        name: '预览'
      },
      {
        name: '从相册选择'
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
      info: {
        orderId: options.orderId,
        goodsId: options.goodsId,
        commentContent: '',
        commentImg1: '',
        commentImg2: '',
        commentImg3: ''
      },
      goodsName: options.goodsName,
      ifSub: false
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
    commentImg = null
    imageId = null
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
  inputContent: function(e){
    var info = this.data.info
    var ifSub = e.detail.value != ''
    info.commentContent = e.detail.value
    this.setData({
      info: info,
      ifSub: ifSub
    })
  },
  operationImage: function(event) {
    imageId = parseInt(event.currentTarget.dataset.id)
    var info = this.data.info
    switch (imageId) {
      case 1:
        commentImg = info.commentImg1
        break;
      case 2:
        commentImg = info.commentImg2
        break;
      case 3:
        commentImg = info.commentImg3
        break
    }
    if (commentImg === '') {
      uploadImage(this, commentImg, imageId)
    } else {
      this.handleOpen1()
    }
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
    this.setData({
      visible1: false
    });
    const index = detail.index
    switch (index) {
      case 0:
        this.loadPreviewImage()
        break;
      case 1:
        uploadImage(this, commentImg, imageId)
        break;
    }
  },
  loadPreviewImage: function(){
    var info = this.data.info
    var imageList = []
    var index = 0
    if (info.commentImg1 != '') {
      index = imageList.length - 1 < 0 ? 0 : imageList.length
      imageList[index] = this.data.path + info.commentImg1 + app.getTimestamp()
    }
    if (info.commentImg2 != '') {
      index = imageList.length - 1 < 0 ? 0 : imageList.length
      imageList[index] = this.data.path + info.commentImg2 + app.getTimestamp()
    }
    if (info.commentImg3 != '') {
      index = imageList.length - 1 < 0 ? 0 : imageList.length
      imageList[index] = this.data.path + info.commentImg3 + app.getTimestamp()
    }
    wx.previewImage({
      current: imageList[index], //当前预览的图片
      urls: imageList, //所有要预览的图片
    })
  },
  submitInfo(){
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.path + '/api/applet/comment/publishCommentInfo',
      data: this.data.info,
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        wx.showToast({
          title: res.data.data,
          duration: 1500
        })
        if (res.data.code === '1') {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function () {
        app.hideLoading();
      }
    })
  }
})

/**
 * 上传评论图片
 */
var uploadImage = function (that, commentImg, imageId) {
  wx.chooseImage({
    success(res) {
      const file = res.tempFiles[0]
      var modal = ''
      if (file['size'] > 3 * 1024 * 1024) {
        modal = '上传图片过大，仅支持 3M 以内的图片上传'
      }
      if (modal !== '') {
        app.showModal(modal)
      } else {
        wx.showLoading({
          title: '正在上传',
        })
        wx.uploadFile({
          url: app.globalData.path + '/api/applet/comment/uploadCommentImage',
          name: 'commentImage',
          filePath: file.path,
          formData: {
            oldPath: commentImg === null ? '' : commentImg
          },
          header: {
            appletCode: app.globalData.appletCode,
            wxCode: app.globalData.userInfo.wxCode
          },
          success(res) {
            var data = JSON.parse(res.data)
            var modal = data.data
            if (data.code === '1') {
              modal = '上传成功'
              var info = that.data.info
              switch (imageId) {
                case 1:
                  info.commentImg1 = data.data
                  break;
                case 2:
                  info.commentImg2 = data.data
                  break;
                case 3:
                  info.commentImg3 = data.data
                  break
              }
              that.setData({
                info: info,
                timestamp: app.getTimestamp()
              })
            }
            wx.showToast({
              title: modal,
              duration: 1500
            })
          },
          fail: function() {
            wx.hideLoading();
          }
        })
      }
    }
  })
}