export default {
  formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day]
      .map(formatNumber)
      .join('/') + ' ' + [hour, minute, second]
      .map(formatNumber)
      .join(':')
  },

  formatNumber(n) {
    n = n.toString()
    return n[1]
      ? n
      : '0' + n
  },

  obj2uri(obj) {
    return Object
      .keys(obj)
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
      })
      .join('&');
  },

  getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var year = day * 365;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      //非法操作
      return '数据出错';
    }
    var yearC = diffValue / year;
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (yearC >= 1) {
      result = parseInt(yearC) + '年以前';
    } else if (monthC >= 1) {
      result = parseInt(monthC) + '个月前';
    } else if (weekC >= 1) {
      result = parseInt(weekC) + '星期前';
    } else if (dayC >= 1) {
      result = parseInt(dayC) + '天前';
    } else if (hourC >= 1) {
      result = parseInt(hourC) + '小时前';
    } else if (minC >= 5) {
      result = parseInt(minC) + '分钟前';
    } else {
      result = '刚刚发表';
    }
    return result;
  },

  cutstr(str, len, flag) {
    var str_length = 0;
    var str_len = 0;
    var str_cut = new String();
    var str_len = str.length;
    for (var i = 0; i < str_len; i++) {
      var a = str.charAt(i);
      str_length++;
      if (escape(a).length > 4) {
        //中文字符的长度经编码之后大于4
        str_length++;
      }
      str_cut = str_cut.concat(a);
      if (str_length >= len) {
        if (flag == 0) {
          str_cut = str_cut.concat("...");

        }

        return str_cut;
      }

    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
      return str;
    }
  },

  removeHTML(s) {
    var str = s.replace(/<\/?.+?>/g, "");
    return str.replace(/ /g, "");
  },

  formatDateTime(s) {
    return s.replace("T", " ");
  },

  compare(prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (val1 > val2) {
        return -1;
      } else if (val1 < val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },

  checkImgType(filePath) {
    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
      return false;
    } else {
      return true;
    }
  },

  isEmptyObject(e) {
    var t;
    for (t in e) 
      return !1;
    return !0
  },

  CheckImgExists(imgurl) {
    var ImgObj = new Image(); //判断图片是否存在
    ImgObj.src = imgurl;
    //没有图片，则返回-1
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
      return true;
    } else {
      return false;
    }
  },

  GetUrlFileName(url, domain) {
    var filename = url.substring(url.lastIndexOf("/") + 1);
    if (filename == domain || filename == '') {
      filename = "index";
    } else {
      filename = filename.substring(0, filename.lastIndexOf("."));
    }

    return filename;
  },

  json2Form(json) {
    var str = [];
    for (var p in json) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
  },

  getWaterCode() {
    var date = new Date();
    var time = date
      .getFullYear()
      .toString() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()
    return time + parseInt(Math.random() * 100000)
  }
}
