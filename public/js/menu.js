var Menu = (function () {
  var that = {}

  function init () {
    initUI();
    initList();
  }

  function initUI () {
    $('.button-collapse').sideNav();
  }

  function initList () {
    var options = {
      valueNames: [ 'name', 'description', 'price' ]
    };

    var menuList = new List('menu', options);
  }

  that.init = init;
  return that;
}());
