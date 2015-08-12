var PlayLayer = cc.Layer.extend({
  _tileLayer: null,
  _tiles: null,
  _tileSize: cc.size(0, 0),

  _scoreLabel: null,
  _score: 0,

  _row: 4,
  _col: 4,

  _speed: 10,
  _time : 0,
  _isMoveing: false,
  _count: 1, // 需要添加监听事件在数组中的位置
  _num: 0, // 已经点击的次数，用来确定添加新块在layer中的位置

  _bannerSprite: null,
  _startTileSprite: null,

  _isFirstTime: true,
  ctor: function(isFirstTime) {
    this._super();
    this._isFirstTime = isFirstTime;
    this.loadInit(this._isFirstTime);
    this.addNextLineListener();
    return true;
  },
  loadInit: function(isFirstTime) {
    var size = cc.winSize;
    if(isFirstTime){
      var maskLayer = new MaskLayer();
      this.addChild(maskLayer, 100);
    }
    
    // banner图
    this._bannerSprite = new cc.Sprite(res.banner_png);
    this._bannerSprite.attr({
      x: size.width / 2,
      y: size.height - 45,
    });
    this.addChild(this._bannerSprite, 5);

    // 初始化黑白块数组
    this._tiles = new Array();

    // 初始化黑白块大小
    var width  = (size.width - 2 * this._col ) / this._col;
    var height = (size.height - 2 * this._row ) / this._row;
    this._tileSize = cc.size(width, height);

    // 添加黑白块层
    this._tileLayer = new cc.Layer();
    this.addChild(this._tileLayer, 0);

    // 添加分数label
    this._scoreLabel = new cc.LabelTTF('00', 'Arial', 48);
    this._scoreLabel.setPosition(size.width / 2, size.height - this._scoreLabel.height);
    this._scoreLabel.setColor(cc.color('#ff7999'));
    this.addChild(this._scoreLabel, 10);

    // 添加初始黑白块
    for(var i = 0; i < this._row + 2 ; i++){
      this._tiles[i] = new Array();
      var num = Math.floor(Math.random() * this._col);
      for(var j = 0; j < this._col; j++){
        var type = TileType.DONT_TOUCH;
        var touchEnabled = false;
        if(i == 1){
          touchEnabled = true;
        }
        if(i == 0){
          type = TileType.START_LINE;
        }
        else if(num == j){
          type = TileType.TOUCH;
        }
        var x = j * (this._tileSize.width + 2) + this._tileSize.width / 2;
        var y = i * (this._tileSize.height + 2) + this._tileSize.height / 2;
        var tile = this.createTileSprite(x, y, type);
        this._tileLayer.addChild(tile);
        this._tiles[i].push(tile);
      }
    }

    // 初始化开始图标
    this._startTileSprite = new cc.Sprite(res.start_tile_png);
    this._startTileSprite.attr({
      x: this._tileSize.width / 2,
      y: this._tileSize.height /2,
    });
    for(var i = 0; i < this._col; i++){
      if(this._tiles[1][i]._type == TileType.TOUCH){
        this._tiles[1][i].addChild(this._startTileSprite, 10);
        return;
      }
    }
  },
  createTileSprite: function(x, y, type) {
    var tile = new TileSprite(this._tileSize, this.onTileCallBack);
    tile.setPosition(x, y);
    tile.setType(type);
    return tile;
  },
  onTileCallBack: function(isGameOver){
    var self = this.parent.parent;
    if(isGameOver){
      self.gameOver();
    }
    else{
      if(!self._isMoveing){
        self.scheduleUpdate();
        self._isMoveing = true;
      }
      // 增加新行
      self._num++;
      self.addTile();
      // 下一行开始触摸
      self._count++;
      self.addNextLineListener();
      // 更新分数
      self._score++;
      if(self._score < 10){
        self._scoreLabel.setString('0' + self._score);
      }
      else{
        self._scoreLabel.setString('' + self._score);
      }
    }
  },
  addNextLineListener: function() {
    for(var i = 0; i < this._col; i++){
      this._tiles[this._count][i].loadListener();
      cc.log('add listener ok' );
    }
  },
  addTile: function() {
    this._tiles[this._tiles.length] = new Array();
    var num = Math.floor(Math.random() * this._col);
    for(var i = 0; i < this._col; i++){
      var type = TileType.DONT_TOUCH;
      if(num == i){
        type = TileType.TOUCH;
      }
      var x = i * (this._tileSize.width + 2 ) + this._tileSize.width / 2;
      var y = (this._num + 5) * (this._tileSize.height + 2) + this._tileSize.height / 2;
      
      var tile = this.createTileSprite(x, y, type);
      this._tileLayer.addChild(tile);
      this._tiles[this._tiles.length - 1].push(tile);
    }
  },
  update: function() {
    // 根据速度开始移动黑白块层
    this._time++;
    if(this._time > 200){
      this._speed += 1;
      this._time = 0;
    }
    var action = cc.moveBy(0, cc.p(0, -this._speed));
    this._tileLayer.runAction(action);

    // 删除数组
    var pos = this._tiles[0][0].parent.convertToWorldSpace(this._tiles[0][0].getPosition());
    if (pos.y < - this._tileSize.height / 2 - 100){

      for(var i = 0; i < 4; i++){
        this._tiles[0][i].removeFromParent();
      }
      this._tiles.splice(0,1);
      this._count--;
      cc.log('remove array');
      cc.log(this._tiles);
      cc.log(this._count);

    }

    // 判断最下面的没有按过的黑块的位置，判断gameover
    var lastLineTiles = this._tiles[this._count];
    for (var i = 0; i < this._col ; i++) {
      if(lastLineTiles[i]._type == TileType.TOUCH){
        var y = lastLineTiles[i].parent.convertToWorldSpace(lastLineTiles[i].getPosition());
        if(!lastLineTiles[i]._isTouched && y.y < - this._tileSize.height / 2){
          this.unscheduleUpdate();
          this.gameOver();

/*          // TODO 特效
          var self = this;
          var callFun = cc.callFunc(function(){
            self.gameOver();
          });

          var blinkAction = cc.blink(0.6, 4);
          var popAction = cc.moveBy(1, cc.p(0, 2 * (this._tileSize.height + 1)));


          var subTile = new cc.Sprite();
          lastLineTiles[i].addChild(subTile);
          subTile.setPosition(this.width / 2, this.height / 2);
          subTile.setTextureRect(cc.rect(0, 0, this.width, this.height));
          subTile.color = cc.color.GRAY;
          subTile.runAction(blinkAction);

          var deadAction = cc.sequence(popAction, callFun);
          this._tileLayer.runAction(deadAction);*/
        }
      }
    };
  },
  gameOver: function(){
    var scene = new GameoverScene(this._score);
    var transitionScene = new cc.TransitionSlideInR(0.5, scene);
    cc.director.runScene(transitionScene);
  }
});

var PlayScene = cc.Scene.extend({
  _isFirstTime: true,
  ctor: function(isFirstTime){
    this._super();
    this._isFirstTime = isFirstTime;
  },
  onEnter: function() {
    this._super();
    var layer = new PlayLayer(this._isFirstTime);
    this.addChild(layer);
  }
});


