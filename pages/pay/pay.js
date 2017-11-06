import api from '../../utils/api'
import util from '../../utils/util'
import auth from '../../utils/auth'
import wxParse from '../../wxParse/wxParse'
import wxApi from '../../es6-promise/utils/wxApi'
import wxRequest from '../../es6-promise/utils/wxRequest'

var app = getApp();
Page({
  data: {
    prices: [
      1,
      6,
      8,
      18,
      66,
      88
    ],
    openid: '',
    postid: '',
    total_fee: ''
  },

  /**
   * 进入页面
   */
  onLoad: function (options) {

    var that = this;

    var openid = options.openid;
    var postid = options.postid;

    that.setData({openid: openid, postid: postid});

  },
  cancel: function () {
    wx.navigateBack({delta: 1})
  },

  /**
   * 选中赞赏金额
   */
  selectItem: function (event) {
    var total_fee = event.currentTarget.dataset.item;
    total_fee = total_fee * 100;
    var that = this;
    var url = api.postPraiseUrl();
    var data = {
      openid: that.data.openid,
      total_fee: total_fee
    }
    var postLikeRequest = wxRequest.getRequest(url, data);
    postLikeRequest.then(response => {
      if (response.data) {
        var temp = response.data;
        wx.requestPayment({
          'timeStamp': response.data.timeStamp,
          'nonceStr': response.data.nonceStr,
          'package': response.data.package,
          'signType': 'MD5',
          'paySign': response.data.paySign,
          'success': function (res) {

            var url = api.updatePraiseUrl();

            var data = {
              openid: app.globalData.openid,
              postid: that.data.postid,
              orderid: response.data.nonceStr,
              money: total_fee
            }
            var updatePraiseRequest = wxRequest.postRequest(url, data); //更新赞赏数据
            updatePraiseRequest.then(response => {
              console.log(response.data.message);
            }).then(res => {
              wx.showToast({title: '谢谢赞赏！', uration: 2000, success: function () {}});
            })

          },
          'fail': function (res) {
            wx.showToast({title: res.errMsg, icon: 'success'});
          },
          complete: function (res) {

            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({title: '取消赞赏', icon: 'success'});
            }

          }
        });
      } else {
        console.log(response.data.message);

      }
    })
  }
})
