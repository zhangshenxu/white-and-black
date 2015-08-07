var TileType = {};
TileType.START_LINE = 0;
TileType.TOUCH      = 1;
TileType.DONT_TOUCH = 2;


var TileSprite = cc.Sprite.extend({
  _type: TileType.DONT_TOUCH,
  //_touchListener: null,
  _callBackFunc: null,
  _isTouched: false,
  ctor: function(size, callBackFunc) {
    this._super();
    this.loadInit(size, callBackFunc);
    return true;
  },
  loadInit: function(size, callBackFunc) {
    this._callBackFunc = callBackFunc;

    this.setTextureRect(cc.rect(0, 0, size.width, size.height));
    this.setColor(cc.color.WHITE); 
  },
  setType: function(type) {
    switch(type) {
      case TileType.START_LINE:
        this.setColor(cc.color.YELLOW);
        break;
      case TileType.TOUCH:
        this.setColor(cc.color.BLACK);
        break;
      case TileType.DONT_TOUCH:
        break;
    }
    this._type = type;
  },
  loadListener: function() {
    var listener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowtouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded
    });
    cc.eventManager.addListener(listener, this);
  },
  onTouchBegan: function(touch, event) {
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
  onTouchMoved: function(touch, event) {

  },
  onTouchEnded: function(touch, event) {
    cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
    var target = event.getCurrentTarget();
    target.onTouchDispose();
    cc.log('removeListeners');
  },
  onTouchDispose: function() {
    cc.log('begin to deal with touch event');
    var self = this;
    var callFun = cc.callFunc(function(){
      var isGameOver = self._type == TileType.DONT_TOUCH ? true : false;
      //cc.log(isGameOver);
      (self._callBackFunc && typeof(self._callBackFunc) === "function") && self._callBackFunc(isGameOver);
    });
    if(this._type == TileType.DONT_TOUCH){
      var isGameOver = true;
      var touchAction = cc.sequence(cc.blink(0.4, 4), callFun);

      var subTile = new cc.Sprite();
      this.addChild(subTile);
      subTile.setPosition(this.width / 2, this.height / 2);
      subTile.setTextureRect(cc.rect(0, 0, this.width, this.height));
      subTile.color = cc.color.RED;
      subTile.runAction(touchAction);

      var unschedule = this.parent.parent;
      //cc.log(aa);
      unschedule.unscheduleUpdate();
    }
    else{
      this.color = cc.color.GRAY;
      this._isTouched = true;
      var isGameOver = false;
      this._callBackFunc(isGameOver);
    }
  }

});















