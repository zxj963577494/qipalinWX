import api from '../../utils/api'
import util from '../../utils/util'
import wxApi from '../../es6-promise/utils/wxApi'
import wxRequest from '../../es6-promise/utils/wxRequest'

Page({
  data: {
    categoriesList: [],
    floatDisplay: false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.fetchCategoriesData();
  },
  //获取分类列表
  fetchCategoriesData: function () {
    var self = this;
    var getCategoriesRequest = wxRequest.getRequest(api.getCategories());
    getCategoriesRequest.then(response => {
        wx.hideLoading()
        self.setData({
          floatDisplay: true,
          categoriesList: self.data.categoriesList.concat(response.data.map(function (item) {
            if (typeof (item.category_thumbnail_image) == "undefined" || item.category_thumbnail_image == "") {
              item.category_thumbnail_image = "../../images/website.png";
            }
            return item;
          })).filter((item)=>{
            return (item.name.indexOf('投稿') == -1)
          }),
        });
      })
      .finally(function () {
        setTimeout(function () {
          wx.hideLoading();
        }, 900)
        wx.hideNavigationBarLoading();;
      });
  },

  onShareAppMessage: function () {
    return {
      title: '分享“奇葩林”小程序的专题栏目.',
      path: 'pages/topic/topic',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //跳转至某分类下的文章列表
  redictIndex: function (e) {
    //console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.item;
    var url = '../list/list?categoryID=' + id;
    wx.navigateTo({
      url: url
    });
  }
})