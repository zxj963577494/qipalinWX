import api from '../../utils/api'
import util from '../../utils/util'
import wxParse from '../../wxParse/wxParse'
import wxApi from '../../es6-promise/utils/wxApi'
import config from '../../utils/config'
import wxRequest from '../../es6-promise/utils/wxRequest'

Page({
  data: {
    postsList: [],
    isLastPage: false,
    page: 1,
    showerror: false,
    showallDisplay: false,
    displaySwiper: true,
    floatDisplay: false
  },
  onShareAppMessage: function () {
    var title = config.getWebsiteName + '的奇闻趣事';
    var path = "pages/list/list"
    return {title: title, path: path, success: function (res) {
        // 转发成功
      }, fail: function (res) {
        // 转发失败
      }}
  },
  onLoad: function (options) {
    this.fetchPostsData({});
  },
  //获取文章列表数据
  fetchPostsData: function (data) {
    var self = this;
    if (!data) 
      data = {};
    if (!data.page) 
      data.page = 1;
    if (!data.categories) 
      data.categories = 0;
    if (data.page === 1) {
      self.setData({postsList: []});
    };

    wx.showLoading({title: '正在加载', mask: true});

    wxRequest
      .getRequest(api.getPosts(data))
      .then(response => {
        if (response.statusCode === 200) {
          if (response.data.length < 6) {
            self.setData({isLastPage: true});
          }
          self.setData({
            floatDisplay: true,
            showallDisplay: true,
            postsList: self
              .data
              .postsList
              .concat(response.data.map(function (item) {
                item.date = util.cutstr(item.date, 10, 1);
                if (item.thumbnail) {
                  if (item.thumbnail.indexOf('www.qipalin.com') > 0) {
                      item.thumbnail = config.getDomain + '/wp-content/themes/begin/timthumb.php?src=' + item.thumbnail
                  } else {
                      item.thumbnail + '?imageView2/0/w/100/h/75';
                  }
                } else {
                    item.thumbnail = '../../images/logo-100x75.png';
                }
                return item;
              }))
          })
        } else {
          if (response.data.code == "rest_post_invalid_page_number") {
            self.setData({isLastPage: true});
          } else {
            wx.showToast({title: response.data.message, duration: 1500})
          }
        }
      })
      .catch(function () {
        if (data.page == 1) {
          self.setData({showerror: true, floatDisplay: false});
        } else {
          wx.showModal({title: '加载失败', content: '加载数据失败,请重试.', showCancel: false});
          self.setData({
            page: data.page - 1
          });
        }
      })
      .finally(function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading()
      })
  },
  onPullDownRefresh: function () {
    this.setData({page: 1, isLastPage: false, showerror: false, displaySwiper: true, floatDisplay: false});
    this.fetchPostsData({});
  },
  onReachBottom: function (e) {
    var self = this;
    if (!self.data.isLastPage) {
      self.setData({
        page: self.data.page + 1
      });
      this.fetchPostsData(self.data);
    } else {
      wx.showToast({title: '没有更多内容', mask: false, duration: 1000});
    }
  },
  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({url: url})
  }
})
