import config from 'config.js'

const domain = config.getDomain;
const HOST_URI = domain + '/wp-json/wp/v2/';
const HOST_URI_JWT = domain + '/wp-json/jwt-auth/v1/';
const HOST_URI_WATCH_LIFE_JSON = domain + '/wp-json/qipalin/v1/';

export default {
  // 获取文章列表数据
  getPosts(obj) {
    let url = HOST_URI + 'posts?per_page=6&orderby=date&order=desc&categories_exclude=2&page=' + obj.page;
    if (obj.categories != 0) {
      url += '&categories=' + obj.categories;
    }
    return url;
  },

  // 获取置顶的文章
  getStickyPosts() {
    return HOST_URI + 'posts?sticky=true&per_page=5&page=1';
  },

  // 获取tag相关的文章列表
  getPostsByTags(id, tags) {
    return HOST_URI + 'posts?per_page=5&&page=1&exclude=' + id + "&tags=" + tags;
  },

  // 获取特定id的文章列表
  getPostsByIDs(obj) {
    return HOST_URI + 'posts?include=' + obj;
  },

  // 获取特定slug的文章内容
  getPostBySlug(obj) {
    return HOST_URI + 'posts?slug=' + obj;
  },

  // 获取内容页数据
  getPostByID(id) {
    return HOST_URI + 'posts/' + id;
  },

  // 获取页面列表数据
  getPages() {
    return HOST_URI + 'pages';
  },

  getDuanzi(obj) {
    let url = HOST_URI + 'posts?per_page=6&orderby=date&order=desc&categories=2&page=' + obj.page;
    return url;
  },

  // 获取图片类别列表
  getPictures(obj) {
    return HOST_URI + 'picture?orderby=date&order=desc&page=' + obj.page;
  },

    // 获取图片内容页数据
  getPictureByID(id) {
    return HOST_URI + 'picture/' + id;
  },

  // 获取页面列表数据
  getPageByID(id, obj) {
    return HOST_URI + 'pages/' + id;
  },

  //获取分类列表
  getCategories() {
    return HOST_URI + 'categories?orderby=id';
  },

  //获取某个分类信息
  getCategoryByID(id) {
    return HOST_URI + 'categories/' + id;
  },

  //获取评论
  getComments(obj) {
    return HOST_URI + 'comments?parent=0&per_page=100&orderby=date&order=desc&post=' + obj.postID + '&page=' + obj.page
  },

  //获取回复
  getChildrenComments(obj) {
    return HOST_URI + 'comments?parent_exclude=0&per_page=100&orderby=date&order=desc&post=' + obj.postID
  },

  //获取最近的30个评论
  getRecentfiftyComments() {
    return HOST_URI + 'comments?per_page=30&orderby=date&order=desc'
  },

  //提交评论
  postComment() {
    return HOST_URI + 'comments'
  },

  // 提交投稿文章
  postPosts() {
    return HOST_URI + 'posts'
  },

  // 登录
  postLogin() {
    return HOST_URI_JWT + 'token'
  },

  //获取文章的第一个图片地址,如果没有给出默认图片
  getContentFirstImage(content) {
    let regex = /<img.*?src=[\'"](.*?)[\'"].*?>/i;
    let arrReg = regex.exec(content);
    let src = "../../images/logo-128.png";
    if (arrReg) {
      src = arrReg[1];
    }
    return src;
  },

  //获取热点文章
  getTopHotPosts(flag) {
    let url = HOST_URI_WATCH_LIFE_JSON;
    if (flag == 1) {
      url += "hotpostthisweek"
    } else if (flag == 2) {
      url += "hotpostthismonth"
    } else if (flag == 3) {
      url += "hotpost"
    }
    return url;
  },

  //更新文章浏览数
  updatePageviews(id) {
    return HOST_URI_WATCH_LIFE_JSON + "addpageview/" + id;
  },

  //获取用户openid
  getOpenidUrl(id) {
    return HOST_URI_WATCH_LIFE_JSON + "weixin/getopenid";
  },

  //点赞
  postLikeUrl() {
    return HOST_URI_WATCH_LIFE_JSON + "like";
  },

  //判断当前用户是否点赞
  postIsLikeUrl() {
    return HOST_URI_WATCH_LIFE_JSON + "islike";
  },

  //赞赏,获取支付密钥
  postPraiseUrl() {
    return 'https://' + domain + "/wp-wxpay/pay/app.php";
  },

  //更新赞赏数据
  updatePraiseUrl() {
    return HOST_URI_WATCH_LIFE_JSON + "praise";
  }
};