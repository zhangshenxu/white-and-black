var MaskLayer = cc.Layer.extend({
  _popSprite: null,
  _startRunSprite: null,
  _closeSprite: null,

  ctor:function(){
    this._super();
    var size = cc.winSize;

    this._popSprite = new cc.Sprite(res.pop_png);
    this._popSprite.attr({
      x: size.width / 2,
      y: size.height / 2,
    });
    this.addChild(this._popSprite);

    this._startRunSprite = new cc.Sprite(res.start_run_png);
    this._startRunSprite.attr({
      x: size.width / 2,
      y: 500,
    });
    this.addChild(this._startRunSprite);

    this._closeSprite = new cc.Sprite(res.close_png);
    this._closeSprite.attr({
      x: 670,
      y: 820,
    });
    this.addChild(this._closeSprite);

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
        
        return true;
      },
      onTouchEnded: function(touch, event) {
        var target = event.getCurrentTarget();
        target.parent.removeFromParent();
      }
    });
    var listener1 = cc.EventListener.create({
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
        
        return true;
      },
      onTouchEnded: function(touch, event) {
        var target = event.getCurrentTarget();
        target.parent.removeFromParent();
      }
    });
    cc.eventManager.addListener(listener, this._startRunSprite);
    cc.eventManager.addListener(listener1, this._closeSprite);




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
    //var target = event.getCurrentTarget();
    //target.removeFromParent();
  }
});