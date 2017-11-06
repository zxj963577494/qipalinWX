# WordPress版微信小程序

![wordpress微信小程序](https://i.loli.net/2017/11/06/5a001d255e507.png)
![wordpress微信小程序](https://i.loli.net/2017/11/06/5a001d253c3d7.png)
![wordpress微信小程序](https://i.loli.net/2017/11/06/5a001d24988b5.png)
![wordpress微信小程序](https://i.loli.net/2017/11/06/5a001d2484a58.png)

## 小程序访问微信二维码：

![wordpress微信小程序](https://i.loli.net/2017/11/06/5a001aff2ef9f.jpg?imageView2/2/h/300)

## 功能清单

1.缩略图的方式显示文章列表（首页，分类文章），包括显示文章分类和发布时间，加载分页。

2.在首页用轮播方式显示置顶文章。

3.显示文章分类（专题），包括显示分类的封面图片。

4.显示文章内容页，包括文章站内链接跳转，站外链接复制到剪切板，显示猜你喜欢的相关文章。

5.显示文章评论，提交评论和回复评论，加载评论分页，显示微信用户评论者的头像。

6.显示热点文章。

7.显示wordpress“页面”类文字（关于页面）。

8.对文章内容的全文搜索。

9.文章页面的分享、转发，复制。

10.WordPress 插件的配套功能。

11.文章浏览数显示及更新。

12.文章微信用户点赞及点赞的微信用户头像显示。

13.通过微信支付对文章赞赏。

## 使用之前

必须安装配套插件使用：

[wp-rest-api](https://github.com/zxj963577494/wp-rest-api)

## 微信小程序"匿名"投稿功能：

一、新建投稿专用的『分类目录』，记下id

二、新建用户—选择投稿者身份，记下id

三、安装『User Role Editor』插件—选择投稿者—勾上『create_posts』、『edit_others_posts』和『edit_posts』

四、安装『JWT Authentication for WP-API』插件，具体使用见[https://github.com/Tmeister/wp-api-jwt-auth](https://github.com/Tmeister/wp-api-jwt-auth)

五、在wordpress根目录wp-config.php添加如下代码：

``` php
define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key');
```

六、启动小程序时，登录该投稿者用户账号，保存token，见 /app.js

``` javascript
getToken: function() {
    var url = api.postLogin();
    var data = {
      username: 'tougao',
      password: 'Zm!69bgeLqNaH^9&ze)nWYol'
    }
    var postPostsRequest = wxRequest.postRequest(url, data);
    postPostsRequest.then(res => {
      wx.setStorageSync('token', res.data.token);
    })
  },
```

七、新建投稿，见/deliver/deliver.js

``` javascript
var data = {
    author: 3, // 创建的投稿者id
    title: title + ' author:' + name,
    content: content,
    categories: 65 // 该id为第一步创建投稿专用的分类目录ID
};
var url = api.postPosts();
var postPostsRequest = wxRequest.postRequestAuth(url, data);
```

## PC站点和小程序点赞数、浏览量同步

### 点赞数

需要[知更鸟Begin主题](http://zmingcx.com/begin.html)配套使用

高级使用见：[wp-rest-api](https://github.com/zxj963577494/wp-rest-api)

### 浏览量

需要安装『WP-PostViews』插件配套使用

## 缩略图

本小程序使用的缩略图优先使用『thumbnail』字段，该字段是与[知更鸟Begin主题](http://zmingcx.com/begin.html)，具体为文章编辑页的手动缩略图，配套使用的，如果没有改字段优先选用文章中第一张图片，最后才是默认图片，具体见代码。
