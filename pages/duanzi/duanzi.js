import api from '../../utils/api'
import util from '../../utils/util'
import config from '../../utils/config'
import wxApi from '../../es6-promise/utils/wxApi'
import wxRequest from '../../es6-promise/utils/wxRequest'
import wxParse from '../../wxParse/wxParse'

Page({
    data: {
        postsList: [],
        isLastPage: false,
        page: 1,
        search: '',
        categories: 0,
        showCategoryName: "",
        categoryName: "",
        showerror: false,
        showallDisplay: true,
        displayHeader: false,
        displaySwiper: false,
        floatDisplay: false
    },
    onShareAppMessage: function () {
        return {
            title: config.getWebsiteName + '的内涵段子',
            path: 'pages/duanzi/duanzi',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    onPullDownRefresh: function () {
        var self = this;
        self.setData({showerror: false, displaySwiper: false, floatDisplay: false, isLastPage: false, page: 1});
        self.fetchPostsData();
    },
    onReachBottom: function () {
        var self = this;
        if (!self.data.isLastPage) {
            self.setData({
                page: self.data.page + 1
            });
            self.fetchPostsData(self.data);
        } else {
            wx.showToast({title: '没有更多内容', mask: false, duration: 1000});
        }
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
        if (!data.search) 
            data.search = '';
        if (data.page === 1) {
            self.setData({postsList: []});
        };
        wx.showLoading({title: '正在加载', mask: true});
        var getPostsRequest = wxRequest.getRequest(api.getDuanzi(data));
        getPostsRequest.then(response => {
            if (response.statusCode === 200) {
                if (response.data.length < 6) {
                    self.setData({isLastPage: true});
                } else {
                    self.setData({
                        floatDisplay: true,
                        postsList: self
                            .data
                            .postsList
                            .concat(response.data.map(function (item) {
                                var strdate = item.date
                                item.date = util.cutstr(strdate, 10, 1);
                                item.content.rendered = item
                                    .content
                                    .rendered
                                    .replace(/<\/p>/ig, '\r\n')
                                    .replace(/<p>/ig, '\r\n')
                                    .replace(/<br \/>/ig, '\r\n');
                                return item;
                            }))
                    });
                }
            } else {
                if (response.data.code == "rest_post_invalid_page_number") {
                    self.setData({isLastPage: true});
                    wx.showToast({title: '没有更多内容', mask: false, duration: 1500});
                } else {
                    wx.showToast({title: response.data.message, duration: 1500})
                    }
                }

            })
            .catch(function (response) {
                if (data.page == 1) {
                    self.setData({showerror: true, floatDisplay: false});
                } else {
                    wx.showModal({title: '加载失败', content: '加载数据失败,请重试.', showCancel: false});
                    self.setData({
                        page: data.page - 1
                    });
                }
            })
            .finally(function (response) {
                wx.hideLoading();
                wx.hideNavigationBarLoading()
            });
    },
    // 跳转至查看文章详情
    redictDetail: function (e) {
        // console.log('查看文章');
        var id = e.currentTarget.id,
            url = '../dzdetail/dzdetail?id=' + id;
        wx.navigateTo({url: url})
    },
    //返回首页
    redictHome: function (e) {
        //console.log('查看某类别下的文章');
        var id = e.currentTarget.dataset.id,
            url = '/pages/index/index';
        wx.switchTab({url: url});
    }
})
