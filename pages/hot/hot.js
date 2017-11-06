import api from '../../utils/api'
import util from '../../utils/util'
import config from '../../utils/config'
import wxApi from '../../es6-promise/utils/wxApi'
import wxRequest from '../../es6-promise/utils/wxRequest'

Page({
  data: {
    title: '文章列表',
    postsList: {},
    pagesList: {},
    categoriesList: {},
    postsShowSwiperList: {},
    isLastPage: false,
    page: 1,
    search: '',
    categories: 0,
    categoriesName: '',
    categoriesImage: "",
    showerror: false,
    isCategoryPage: false,
    isSearchPage: false,
    showallDisplay: true,
    displaySwiper: true,
    floatDisplay: false,
    searchKey: "",
    topBarItems: [
      // id name selected 选中状态
      {
        id: '1',
        name: '本周最受欢迎',
        selected: true
      }, {
        id: '2',
        name: '本月最受欢迎',
        selected: false
      }, {
        id: '3',
        name: '最受欢迎总排行',
        selected: false
      }
    ],
    tab: '1'
  },
  formSubmit: function (e) {
    var url = '../list/list'
    if (e.detail.value.input != '') {
      url = url + '?search=' + e.detail.value.input;
    }
    wx.navigateTo({url: url})
  },
  onShareAppMessage: function () {

    var title = "分享“" + config.getWebsiteName + "”的热点文章。";
    var path = "pages/hot/hot";
    return {title: title, path: path, success: function (res) {
        // 转发成功
      }, fail: function (res) {
        // 转发失败
      }}
  },
  reload: function (e) {
    var self = this;

    self.fetchPostsData(self.data);
  },

  onTapTag: function (e) {
    var self = this;
    var tab = e.currentTarget.id;
    var topBarItems = self.data.topBarItems;
    // 切换topBarItem
    for (var i = 0; i < topBarItems.length; i++) {
      if (tab == topBarItems[i].id) {
        topBarItems[i].selected = true;
      } else {
        topBarItems[i].selected = false;
      }
    }
    self.setData({topBarItems: topBarItems, tab: tab})
    if (tab !== 0) {
      this.fetchPostsData(tab);
    } else {
      this.fetchPostsData("1");
    }
  },

  onLoad: function (options) {
    var self = this;
    this.fetchPostsData("1");
  },
  //获取文章列表数据
  fetchPostsData: function (tab) {
    var self = this;
    self.setData({postsList: []});

    wx.showLoading({title: '正在加载', mask: true});
    var getTopHotPostsRequest = wxRequest.getRequest(api.getTopHotPosts(tab));

    getTopHotPostsRequest.then(response => {
      wx.hideLoading()
      if (response.statusCode === 201) {
        self.setData({
          showallDisplay: true,
          postsList: self
            .data
            .postsList
            .concat(response.data.map(function (item) {
              var strdate = item.date
              if (item.thumbnail) {
                if (item.thumbnail.indexOf('www.qipalin.com') > 0) {
                    item.thumbnail = config.getDomain + '/wp-content/themes/begin/timthumb.php?src=' + item.thumbnail
                } else {
                    item.thumbnail + '?imageView2/0/w/100/h/75';
                }
              } else {
                  item.thumbnail = '../../images/logo-100x75.jpg';
              }
              item.date = util.cutstr(strdate, 10, 1);
              return item;
            }))
        });
      } else if (response.statusCode === 404) {
        wx.showModal({title: '加载失败', content: '加载数据失败,可能没有文章评论。', showCancel: false});
        }
      })
      .catch(function () {
        wx.hideLoading();
        if (data.page == 1) {
          self.setData({showerror: true, floatDisplay: false});
        } else {
          wx.showModal({title: '加载失败', content: '加载数据失败,请重试.', showCancel: false});
        }
      })
      . finally(function () {
        setTimeout(function () {
          wx.hideLoading();
        }, 1500);
      });
  },
  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({url: url})
  }
})
