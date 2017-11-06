import util from './util';

module.exports = {
  // 检测授权状态
  checkSettingStatu: function () {
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          //返回是否授权
          return authSetting['scope.userInfo'];
        }
      }
    });
  }
}