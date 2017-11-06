import api from './utils/api'
import wxRequest from './es6-promise/utils/wxRequest'

App({
  onLaunch: function () {
    // this.login();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openid: '',
    isGetUserInfo: false,
    isGetOpenid: false
  },
  getToken: function() {
    var url = api.postLogin();
    var data = {
      username: 'tougao',
      password: '^KwunubASjG@*dV&q)8JZSgB'
    }
    var postPostsRequest = wxRequest.postRequest(url, data);
    postPostsRequest.then(res => {
      wx.setStorageSync('token', res.data.token);
    })
  },
  login: function () {
    this.getToken();
  }
})