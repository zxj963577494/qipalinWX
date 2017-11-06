import api from '../../utils/api'
import util from '../../utils/util'
import wxApi from '../../es6-promise/utils/wxApi'
import wxRequest from '../../es6-promise/utils/wxRequest'
import qiniu from '../../utils/qiniu'
import config from '../../utils/config'

var app = getApp();

Page({
  data: {
    imgUrls: ['../../images/placeholder.png'],
    title: '',
    content: ''
  },
  onShareAppMessage: function () {
    var title =  config.getWebsiteName + '欢迎投稿';
    var path = "pages/deliver/deliver"
    return {title: title, path: path, success: function (res) {
        // 转发成功
      }, fail: function (res) {
        // 转发失败
      }}
  },
  onLoad: function (options) {
    
  },
  bindTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindContent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  didPressChooseImage: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        qiniu.upload(filePath, (res) => {
          var list = new Array('//' + res.imageURL).concat(that.data.imgUrls);
          that.setData({'imgUrls': list});
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          domain: config.getQiniuDomain,
          key: util.getWaterCode() + '.jpg',
          uptokenURL: config.getQiuniuTokenUrl
        });
      }
    })
  },
  formSubmit: function (e) {
    if(this.data.title > 4 && this.data.content.length > 4) {
        if (app.globalData.isGetUserInfo) {
        var name = app.globalData.userInfo.nickName;
        var title = this.data.title;
        var imgs = "";
        if (this.data.imgUrls.length > 1) {
          this.data.imgUrls.pop();
          this.data.imgUrls.map((item) => {
            imgs += '<img src="' + item + '"/>';
          })
        }
        var content = this.data.content + imgs;
        var data = {
          author: 3,
          title: title + ' author:' + name,
          content: content,
          categories: 65
        };
        var self = this;
        var url = api.postPosts(); 
        var postPostsRequest = wxRequest.postRequestAuth(url, data);
        postPostsRequest.then(res => {
          if (res.statusCode == 201 || res.statusCode == 200) {
            wx.showToast({
              title: '投稿成功',
              icon: 'success',
              duration: 2000
            })
            self.setData({
              imgUrls: ['../../images/placeholder.png'],
              title: '',
              content: '',
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '投稿失败，非常抱歉，请重新登录小程序后进行尝试',
              showCancel: false,
              success: function(res) {
                return false;
              }
            })
          }
        })
      } else {
        this.userAuthorization();
      }
    }
    else {
      wx.showModal({
        title: '提示',
        content: '标题和内容至少都需要5个字符',
        showCancel: false,
        success: function(res) {
          return false;
        }
      })
    }
  },
  userAuthorization: function () {
    var self = this;
    wx.showModal({
      title: '未授权',
      content: '如需正常使用评论、点赞、赞赏等功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
      showCancel: true,
      cancelColor: '#296fd0',
      confirmColor: '#296fd0',
      confirmText: '设置权限',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function success(res) {
              var scopeUserInfo = res.authSetting["scope.userInfo"];
              if (scopeUserInfo) {
                self.getUsreInfo();
              }
            }
          });
        }
      }
    })
  },
  //获取用户信息和openid
  getUsreInfo: function () {
    var self = this;
    var wxLogin = wxApi.wxLogin();
    var jscode = '';
    wxLogin().then(response => {
      jscode = response.code
      var wxGetUserInfo = wxApi.wxGetUserInfo()
      return wxGetUserInfo()
    }).
    //获取用户信息
    then(response => {
      app.globalData.userInfo = response.userInfo;
      app.globalData.isGetUserInfo = true;
    })
  },
})