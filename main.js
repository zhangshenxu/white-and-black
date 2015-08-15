/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
  "project_type": "javascript",
  // "project_type" indicate the program language of your project, you can ignore this field

  "debugMode"     : 1,
  // "debugMode" possible values :
  //      0 - No message will be printed.
  //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
  //      2 - cc.error, cc.assert, cc.warn will print in console.
  //      3 - cc.error, cc.assert will print in console.
  //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
  //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
  //      6 - cc.error, cc.assert will print on canvas, available only on web.

  "showFPS"       : true,
  // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

  "frameRate"     : 60,
  // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

  "id"            : "gameCanvas",
  // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

  "renderMode"    : 0,
  // "renderMode" sets the renderer type, only useful on web :
  //      0 - Automatically chosen by engine
  //      1 - Forced to use canvas renderer
  //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

  "engineDir"     : "frameworks/cocos2d-html5/",
  // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
  // but if you are using a single engine file, you can ignore it.

  "modules"       : ["cocos2d"],
  // "modules" defines which modules you will need in your game, it's useful only on web,
  // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
  // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

  "jsList"        : [
  ]
  // "jsList" sets the list of js files in your game.
 }
 *
 */
var wechat = function(debug) {
  reqwest({
    url: 'http://activityapi.dudumeijia.com/weixin/jsconfig',
    method: 'post',
    data: {
      url: location.href.split('#')[0],
    },
  }).then(function(res){
    res.debug = debug;
    wx.config(res);
  });
}

var sharing = function(config) {
 console.log('wx.sharing', wx);
  if (wx) {
    wx.ready(function(){
      console.log('wx.ready')
      wx.onMenuShareTimeline(config);
      wx.onMenuShareAppMessage(config);
      wx.onMenuShareQQ(config);
    });
  }
}
var sharingConfig ={
  title: '奔跑吧牛郎，迎娶织女走上人生巅峰！',
  desc: '据说全世界只有7%的人能跑过77步，不服来战！更有神秘大红包在等你！',
  link: 'http://dudumeijia.com/static/games/qixi',
  imgUrl: 'http://dudumeijia.com/static/games/qixi/icon.png',
}
wechat(true);
sharing(sharingConfig);


cc.game.onStart = function(){
  cc.view.adjustViewPort(true);
  cc.view.setDesignResolutionSize(750, 1206, cc.ResolutionPolicy.SHOW_ALL);
  //cc.view.resizeWithBrowserSize(true);
  //load resources
  cc.LoaderScene.preload(g_resources, function () {
    cc.director.runScene(new StartScene());
  }, this);
};
cc.game.run();
