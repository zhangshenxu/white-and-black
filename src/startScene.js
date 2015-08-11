var StartLayer = cc.Layer.extend({
  _bgSprite: null,
  _fontsSprite: null,
  _zhinvSprite: null,
  _startBtnSprite: null,
  ctor:function () {
    this._super();
    var size = cc.winSize;
    
    // 背景图
    this._bgSprite = new cc.Sprite(res.start_bg_jpg);
    this._bgSprite.attr({
      x: size.width / 2,
      y: size.height / 2,
    });
    this.addChild(this._bgSprite, 0);

    // 动效文字
    this._fontsSprite = new cc.Sprite(res.fonts_png);
    this._fontsSprite.attr({
      x: -300,
      y: 782,
    });
    this.addChild(this._fontsSprite, 1);
    
    var action = cc.moveTo(0.5, cc.p(345, 782));
    action.easing(cc.easeIn(3.0));
    this._fontsSprite.runAction(action);

    // 动效织女
    this._zhinvSprite = new cc.Sprite(res.zhinv_png);
    this._zhinvSprite.attr({
      x: 900,
      y: 715,
    });
    this.addChild(this._zhinvSprite, 1);
    
    var action = cc.moveTo(0.5, cc.p(665, 715));
    action.easing(cc.easeIn(3.0));
    this._zhinvSprite.runAction(action);

    // ready go 动效
    this._startBtnSprite = new cc.Sprite(res.start_btn_png);
    this._startBtnSprite.attr({
      x: size.width / 2 - 10,
      y: 245,
    });
    this.addChild(this._startBtnSprite, 1);

    var listener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowtouches: true,
      onTouchBegan: function(touch, event){
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        if (!cc.rectContainsPoint(rect, locationInNode)) {
          return false;
        }
        cc.log('click ');
        cc.director.runScene(new PlayScene(true));
        return true;
      }
    });
    cc.eventManager.addListener(listener, this._startBtnSprite);
  
    var rightAction = cc.moveBy(0.5, cc.p(20, 0));
    var leftAction = cc.moveBy(0.5, cc.p(-20, 0));
    //rightAction.easing(cc.easeIn(2.0));
    //leftAction.easing(cc.easeIn(2.0));
    var moveAction = cc.sequence(rightAction, leftAction);
    var rep = new cc.RepeatForever(moveAction);
    this._startBtnSprite.runAction(rep);

    return true;
  }
});

var StartScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new StartLayer();
    this.addChild(layer);
  }
});