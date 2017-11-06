import api from '../../utils/api'
import config from '../../utils/config'
import wxRequest from '../../es6-promise/utils/wxRequest'

Page({
  data: {
    list: [],
    leftHeight: 0,
    rightHeight: 0,
    length: 10,
    page: 1,
    floatDisplay: false,
    isLastPage: false
  },
  onLoad: function () {
    this.fetchPictures();
  },
  onShareAppMessage: function () {
    var title = config.getWebsiteName + '的爆笑囧图';
    var path = "pages/pictures/pictures"
    return {title: title, path: path, success: function (res) {
        // 转发成功
      }, fail: function (res) {
        // 转发失败
      }}
  },
  fetchPictures: function (data) {
    var self = this;
    if (!data) {
      data = {};
    }
    if (!data.page) {
      data.page = 1;
    }
    if (data.page === 1) {
      self.setData({list: []});
    };
    wx.showLoading({title: '正在加载', mask: true});
    var getPicturesRequest = wxRequest.getRequest(api.getPictures(data));
    getPicturesRequest.then(response => {
      if (response.statusCode === 200) {
        if (response.data.length < 10) {
          self.setData({isLastPage: true});
        }
        self.setData({
          floatDisplay: true,
          list: self.data.list.concat(response.data.map(function (item) {
              var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
              var img = item.content.rendered.match(srcReg)[1];
              if (img) {
                if (img.indexOf('www.qipalin.com') > 0) {
                    item.url = config.getDomain + '/wp-content/themes/begin/timthumb.php?src=' + img
                } else {
                    item.url = img + '?imageView2/0/w/200';
                }
              } else {
                  item.url = '../../images/logo-128.jpg';
              }
              item.name = item.title.rendered;
              item.id = item.id;
              return item;
            }))
        })
      }
    });
  },
  loadImage: function (e) {
    var vm = this;
    var windowWidth = wx
      .getSystemInfoSync()
      .windowWidth;
    var index = e.currentTarget.dataset.index;
    vm.data.list[index].height = windowWidth / 2 / e.detail.width * e.detail.height;
    var count = 0;
    for (var i = (vm.data.page - 1) * vm.data.length; i < vm.data.list.length; i++) {
      if (vm.data.list[i].height) {
        count++;
      }
    }
    if (count == (vm.data.list.length - (vm.data.page - 1) * vm.data.length)) {
      for (var i = (vm.data.page - 1) * vm.data.length; i < vm.data.list.length; i++) {
        if (vm.data.leftHeight <= vm.data.rightHeight) {
          vm.data.list[i].top = vm.data.leftHeight;
          vm.data.list[i].left = windowWidth * 0.005;
          vm.setData({
            leftHeight: vm.data.leftHeight + vm.data.list[i].height
          });
        } else {
          vm.data.list[i].top = vm.data.rightHeight;
          vm.data.list[i].left = windowWidth / 2 - windowWidth * 0.005;
          vm.setData({
            rightHeight: vm.data.rightHeight + vm.data.list[i].height
          });
        }
      }
      vm.setData({list: vm.data.list});
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    }
  },
  onPullDownRefresh: function () {
    this.setData({
        page: 1,
        leftHeight: 0,
        rightHeight: 0,
        isLastPage: false,
    });
    this.fetchPictures(this.data);
  },
  onReachBottom: function (e) {
    var self = this;
    if (!self.data.isLastPage) {
      self.setData({
        page: self.data.page + 1
      });
      this.fetchPictures(self.data);
    } else {
      wx.showToast({title: '没有更多内容', mask: false, duration: 1000});
    }
  },
  redictDetail: function (e) {
    var id = e.currentTarget.id,
        url = '../picdetail/picdetail?id=' + id;
    wx.navigateTo({url: url})
  },
})