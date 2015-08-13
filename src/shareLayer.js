var ShareLayer = cc.Layer.extend({
  _shareSprite: null,

  ctor:function(){
    this._super();
    var size = cc.winSize;

    this._shareSprite = new cc.Sprite(res.share_png);
    this._shareSprite.attr({
      x: size.width / 2,
      y: size.height / 2,
    });
    this.addChild(this._shareSprite);

    var touchListener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchEnded: this.onTouchEnded
    });
    cc.eventManager.addListener(touchListener, this);
  },
  onTouchBegan:function(touch, event) {
    var target = event.getCurrentTarget();
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    var size = target.getContentSize();
    var rect = cc.rect(0, 0, size.width, size.height);
    if (!cc.rectContainsPoint(rect, locationInNode)) {
      return false;
    }
    return true;
  },
  onTouchEnded: function(touch, event) {
    var target = event.getCurrentTarget();
    target.removeFromParent();
  }
});