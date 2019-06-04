var docCookies = {
  getItem: function(sKey) {
    if (!sKey) {
      return null;
    }
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  },
  setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '');
    return true;
  },
  removeItem: function(sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '');
    return true;
  },
  hasItem: function(sKey) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    return new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
        '\\s*\\='
    ).test(document.cookie);
  },
  keys: function() {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
};
/**
 *
 * @param {CACHE SETTING} options
 * options
 *  type
 *    session SESSION STORAGE
 *    local   LOCAL STORAGE
 *    cookie  COOKIE STOREAGE
 *  vEnd COOKIE STORATE END DATE
 *  sPath COOKIE STORAGE PATH
 *  sDomain COOKIE STORATE DOMAIN
 *  bSecure COOKIE STORAGE SECURE
 *  isTemporary IS TEMPLATE STORAGE， USE SESSION STORAGE
 */
var JsCache = function(options) {
  var localOption = options;
  var storage = buildStorage();
  function buildStorage() {
    if (localOption.type) {
      if (localOption.type === 'session') {
        if (window.sessionStorage) {
          return window.sessionStorage;
        } else {
          throw Error('浏览器不支持session storage');
        }
      } else if (localOption.type === 'local') {
        if (window.localStorage) {
          return window.localStorage;
        } else {
          throw Error('浏览器不支持local storage');
        }
      } else {
        docCookies.isCookie = true;
        docCookies.options = localOption;
        docCookies.options.cookieOption = {
          vEnd: options.vEnd,
          sPath: options.sPath,
          sDomain: options.sDomain,
          bSecure: options.bSecure
        };
        return docCookies;
      }
    } else {
      if (localOption.isTemporary && window.sessionStorage) {
        return window.sessionStorage;
      }
      if (!localOption.isTemporary && window.localStorage) {
        return window.localStorage;
      }
      docCookies.isCookie = true;
      docCookies.options = localOption;
      docCookies.options.cookieOption = {
        vEnd: options.vEnd,
        sPath: options.sPath,
        sDomain: options.sDomain,
        bSecure: options.bSecure
      };
      return storage;
    }
  }
  return {
    get: function(key) {
      if (storage.isCookie) {
        if (storage.hasItem(key)) {
          return JSON.parse(storage.getItem(key));
        }
        return null;
      } else {
        if (storage && storage[key]) {
          return JSON.parse(storage[key]);
        }
        return null;
      }
    },
    set: function(key, value) {
      try {
        if (storage.isCookie) {
          var cookieOption = storage.options.cookieOption;
          return storage.setItem(
            key,
            JSON.stringify(value),
            cookieOption.vEnd,
            cookieOption.sPath,
            cookieOption.sDomain,
            cookieOption.bSecure
          );
        }
        if (storage) {
          storage[key] = JSON.stringify(value);
          return true;
        }
        return false;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    delete: function(key) {
      try {
        if (storage.isCookie) {
          var cookieOption = storage.options.cookieOption;
          return storage.removeItem(
            key,
            cookieOption.sPath,
            cookieOption.sDomain
          );
        }
        if (storage && storage[key]) {
          delete storage[key];
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    keys: function() {
      if (storage.isCookie) {
        return storage.keys();
      }
      if (storage) {
        return storage.keys;
      }
      return null;
    },
    hasItem: function(key) {
      if (storage.isCookie) {
        return storage.hasItem(key);
      }
      if (storage) {
        return storage.getItem(key) === null;
      }
      return false;
    },
    setOption: function(options) {
      localOption = options;
      storage = buildStorage();
    }
  };
};
