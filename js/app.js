var cache = new JsCache({ type: 'cookie' });
window.onload = function() {
  var btnAdd = document.getElementById('btn_add');
  if (btnAdd) {
    cache.delete('test');
    btnAdd.onclick = function() {
      cache.set('test', { name: 'tom1' });
    };
  }
  var btnSetOption = document.getElementById('btn_set_options');
  if (btnSetOption) {
    btnSetOption.onclick = function() {
      var option = {
        type: 'local'
      };
      cache.setOption(option);
    };
  }
  var btnGet = document.getElementById('btn_get');
  if (btnGet) {
    btnGet.onclick = function() {
      var val = cache.get('test');
      console.log(val);
    };
  }
};
