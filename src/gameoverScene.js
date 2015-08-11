var GameoverLayer = cc.Layer.extend({
  _scoreLabel: null,
  _score: 0,
  ctor: function(score) {
    this._super();
    this._score = score;
    var size = cc.winSize;

    var bg = new cc.LayerColor(cc.color('#f05654'));
    this.addChild(bg, 0);

    this._scoreLabel = new cc.LabelTTF('' + score , 'Arial', 128);
    this._scoreLabel.setPosition(size.width / 2, cc.winSize.height / 2);
    this._scoreLabel.setColor(cc.color.WHITE);
    this.addChild(this._scoreLabel, 10);

    // 菜单
    var againLabel = new cc.LabelTTF('再玩一次', 'Arial', 48);
    var againMenuItem = new cc.MenuItemLabel(againLabel, function(){
        var scene = new PlayScene(false);
        cc.director.runScene(scene);
    }, this);

    var menu = new cc.Menu(againMenuItem);
    this.addChild(menu);
    menu.setPosition(size.width / 2, size.height / 3);
    menu.alignItemsHorizontallyWithPadding(30);
    
    return true;
  }


});

var GameoverScene = cc.Scene.extend({
  _score: 0,
  ctor: function(score){
    this._super();
    this._score = score;
  },
  onEnter: function() {
    this._super();
    var layer = new GameoverLayer(this._score);
    this.addChild(layer);
  }
});

