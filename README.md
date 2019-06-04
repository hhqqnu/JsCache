# JsCache

JsCache 提供浏览器缓存，如COOKIES,LOCAL STORAGE,SESSION STORAGE

使用方法：

``` javascript
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
var cache = new JsCache({ type: 'cookie' }) // 初始化
cache.set('test', { name: 'tom1' }); // 设置
var val = cache.get('test'); //获取

// 临时调整缓存存储方式
var option = {
     type: 'local'
};
cache.setOption(option);

```

