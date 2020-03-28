// pages/goods/comment/details/details.js
const app = getApp();
var commentId = null,
  sendColor = 'background-color: #f4f4f4;border: 1rpx #cdcdcd solid;color: #cdcdcd;',
  placeholder = '评论',
  ifCancel = true

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    list: [],
    reply: {
      commentId: null,
      aimUserId: null,
      replyContent: ''
    },
    ifEdit: 'none',
    contentPlaceholder: '评论',
    autoFocus: false,
    sendColor: sendColor
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setAppletColor(this)
    wx.hideShareMenu()
    commentId = parseInt(options.id)
    loadDetails(this)
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
  deleteInfo: function() {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '确定删除该评论吗？',
      confirmText: '删除',
      confirmColor: app.globalData.appletInfo.systemColor,
      cancelText: '取消',
      cancelColor: '#bfbfbf',
      success(res) {
        if (res.confirm) {
          deleteCommentInfo(that)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  editReply: function(e) {
    if (app.globalData.bindStatus) {
      // 已绑定手机号用户才可以发表评论
      ifCancel = false
      var aimUserId = e.currentTarget.dataset.id
      var bool = false
      if (aimUserId === '' && this.data.info.commentUserId != this.data.userInfo.userId) {
        bool = true
      } else if (aimUserId != '' && aimUserId != this.data.userInfo.userId) {
        bool = true
      }
      if (bool) {
        var userName = e.currentTarget.dataset.name
        var contentPlaceholder = '回复 ' + userName
        placeholder = contentPlaceholder
        var reply = this.data.reply
        reply.aimUserId = aimUserId
        this.setData({
          ifEdit: 'block',
          autoFocus: true,
          contentPlaceholder: contentPlaceholder,
          reply: reply
        })
      } else {
        this.setData({
          ifEdit: 'none',
          autoFocus: false
        })
      }
    } else {
      app.bindMobileShowModal()
    }
  },
  cancelReply: function() {
    if (ifCancel) {
      this.setData({
        ifEdit: 'none',
        autoFocus: false
      })
    }
    ifCancel = true
  },
  inputContent: function(event) {
    var content = event.detail.value
    var color = 'background-color: ' + this.data.color + ';border: 1rpx ' + this.data.color + ' solid;color: #fff;'
    if (content === '') {
      color = sendColor
      this.setData({
        contentPlaceholder: placeholder
      })
    }
    var reply = this.data.reply
    reply.replyContent = content
    this.setData({
      reply: reply,
      sendColor: color
    })
  },
  sendReply: function() {
    var that = this
    wx.showLoading({
      title: '正在发送',
    })
    wx.request({
      url: app.globalData.path + '/api/applet/comment/replyCommentInfo',
      data: {
        commentId: this.data.reply.commentId,
        aimUserId: this.data.reply.aimUserId,
        replyContent: this.data.reply.replyContent
      },
      header: {
        appletCode: app.globalData.appletCode,
        wxCode: app.globalData.userInfo.wxCode
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code === '1') {
          wx.showToast({
            title: '回复成功',
            dataset: 1500
          })
          var list = that.data.list
          list.push(res.data.data)
          var reply = {
            commentId: that.data.info.id,
            aimUserId: null,
            replyContent: ''
          }
          that.setData({
            ifEdit: 'none',
            autoFocus: false,
            list: list,
            reply: reply
          })
        } else {
          app.showModal(res.data.data)
        }
      },
      fail: function () {
        app.hideLoading();
      }
    })
  }
})

var loadDetails = function(that) {
  wx.showLoading({
    title: '正在加载',
  })
  var url = '/api/applet/comment/queryReplyRecord'
  var wxCode = ''
  if (app.globalData.bindStatus) {
    url = '/api/applet/comment/queryReplyRecordByUser'
    wxCode = app.globalData.userInfo.wxCode
  }
  wx.request({
    url: app.globalData.path + url,
    data: {
      commentId: parseInt(commentId)
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: wxCode
    },
    success: function(res) {
      if (res.data.code === '1') {
        var data = res.data.data
        var reply = that.data.reply
        reply.commentId = parseInt(commentId)
        that.setData({
          list: data.list,
          info: data.info,
          reply: reply
        })
      } else {
        app.showModal(res.data.data)
      }
    },
    complete: function() {
      app.hideLoading();
    }
  })
}

/** 删除评论信息 */
var deleteCommentInfo = function(that) {
  wx.showLoading({
    title: '正在加载',
  })
  wx.request({
    url: app.globalData.path + '/api/applet/comment/deleteCommentInfo',
    data: {
      id: parseInt(that.data.info.id)
    },
    header: {
      appletCode: app.globalData.appletCode,
      wxCode: app.globalData.userInfo.wxCode
    },
    success: function(res) {
      if (res.data.code === '1') {
        wx.setStorage({
          key: 'del_comment_id',
          data: that.data.info.id
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        app.showModal(res.data.data)
      }
    },
    complete: function() {
      app.hideLoading();
    }
  })
}