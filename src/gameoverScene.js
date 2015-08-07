var GameoverLayer = cc.Layer.extend({
  _scoreLabel: null,
  ctor: function() {
    this._super();
    var size = cc.winSize;

    this.bgSprite = new cc.Sprite(res.BackGround_png);
    this.bgSprite.attr({
      x: size.width / 2,
      y: size.height / 2,
    });
    this.addChild(this.bgSprite, 0);

    this._scoreLabel = new cc.LabelTTF('score: ' , 'Arial', 32);
    this._scoreLabel.setPosition(cc.winSize.width / 2, cc.winSize.height - this._scoreLabel.height);
    this._scoreLabel.setColor(cc.color.RED);
    this.addChild(this._scoreLabel, 10);


    return true;
  }


});

var GameoverScene = cc.Scene.extend({
  onEnter: function() {
    cc.log('bb');
    this._super();
    var layer = new GameoverLayer();
    this.addChild(layer);
  }
});

