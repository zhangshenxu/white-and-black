var GameoverLayer = cc.Layer.extend({
  _bgSprite: null,
  _inputSprite: null,
  _yuanbaoSprite: null,
  _yuanbaoSprite2: null,
  _phoneLabel: null,
  _notmeLabel: null,
  _draw: null,
  _scoreLabel: null,

  _messageLabel: null,
  _messageNoPhoneLabel: null,
  _messageWithPhoneLabel:null,
  _textField: null,
  _menu: null,
  _menuNoPhone: null,
  _menuWithPhone: null,

  _score: 0,
  _result: '',
  _phone: '',
  _openid: '',
  _text: '',
  ctor: function(score, openid, result, phone) {
    this._super();
    this._score = score;
    this._result = result;
    this._phone = phone;
    this._openid = openid;
    var size = cc.winSize;

    cc.log('score: '+this._score);
    cc.log('aaa '+this._result);
    cc.log('aaa '+this._phone);
    // 背景
    this._bgSprite = new cc.Sprite(res.gameover_bg_jpg);
    this._bgSprite.attr({
      x: size.width / 2,
      y: size.height / 2,
    });
    this.addChild(this._bgSprite, 0);

    // 分数
    this._scoreLabel = new cc.LabelTTF('' + this._score , 'Arial', 128);
    this._scoreLabel.lineWidth = 5;
    this._scoreLabel.strokeStyle = cc.color('#854405');
    this._scoreLabel.setPosition(size.width / 2, 970);
    this._scoreLabel.setColor(cc.color('#df8e19'));
    this.addChild(this._scoreLabel, 10);

    if(!this._result){
      this.showNoWinPage();
    }
    if(this._result && !this._phone){
      this.showNoPhoneWinPage();
    }
    if(this._result && this._phone){
      this.showWinPage();
    }
    return true;
  },
  getGift: function(openid, phone) {
    var self = this;
    $.ajax({
      url: 'http://testapi.dudumeijia.com/activities/qixi/coupons',
      method: 'POST',
      data: {
        openid: openid,
        phone: phone
      },
      success: function(data) {
        self._text = data.text;
        self.showHaveGetGift();
      },
      error: function() {

      },
    });
  },

  showMenu: function() {
    var size = cc.winSize;
    // 菜单
    var showSprite = new cc.Sprite(res.show_png);
    var showSprite2 = new cc.Sprite(res.show_png);
    var menuItem = new cc.MenuItemSprite(showSprite, showSprite2, function(){
      this.share();
    },this);
    menuItem.setPosition(-150, 0);

    var playagainSprite = new cc.Sprite(res.playagain_png);
    var playagainSprite2 = new cc.Sprite(res.playagain_png);
    var menuItem2 = new cc.MenuItemSprite(playagainSprite, playagainSprite2, function(){
        var scene = new PlayScene(false);
        cc.director.runScene(scene);
    },this);
    menuItem2.setPosition(150, 0);

    var see77styleSprite = new cc.Sprite(res.see77style_png);
    var see77styleSprite2 = new cc.Sprite(res.see77style_png);
    var menuItem3 = new cc.MenuItemSprite(see77styleSprite, see77styleSprite2, function(){
        // TODO 转到七夕美甲页面
    },this);
    menuItem3.setPosition(0, -140);

    this._menu = new cc.Menu(menuItem, menuItem2, menuItem3);
    this._menu.setPosition(size.width / 2, 450);
    this.addChild(this._menu, 5);
  },
  showNoWinPage: function() {
    var size = cc.winSize;
    // 文字
    var text = [
      '郎君～来追我呀～',
      '亲，玩的分数越高，\n\r中奖几率越大哦～',
      '左手右手一个慢动作,\n\r重播一次试试！',
      '表放弃！原地复活\n\r红包在等你～',
      '再接再厉，\n\r红包在向你招手噢！'
    ];
    var num = Math.floor(Math.random() * text.length);
    this._messageLabel = new cc.LabelTTF(text[num] , 'Arial', 46);
    this._messageLabel.boundingWidth = 480;
    this._messageLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this._messageLabel.setPosition(size.width / 2 - 20, 750);
    this._messageLabel.setColor(cc.color('#b25700'));
    this.addChild(this._messageLabel, 10);

    this.showMenu();
  },
  showNoPhoneWinPage: function() {
    var size = cc.winSize;
    // 输入框
    this._inputSprite = new cc.Sprite(res.input_png);
    this._inputSprite.attr({
      x: size.width / 2,
      y: 450,
    });
    this.addChild(this._inputSprite);

    var normal9SpriteBg = new cc.Scale9Sprite(res.transparent_png);
    this._textField = new cc.EditBox(cc.size(300,100), normal9SpriteBg);
    this.addChild(this._textField);
    this._textField.fontSize = 48;
    this._textField.fontColor = cc.color('#e5e5e5');

    this._textField.placeHolder = '请输入手机号';
    this._textField.placeHolderFontSize = 48;
    this._textField.placeHolderFontColor = cc.color('#e5e5e5');

    this._textField.x = size.width / 2;
    this._textField.y = 450;
    // 领取大红包
    var getGiftSprite = new cc.Sprite(res.get_gift_png);
    var getGiftSprite2 = new cc.Sprite(res.get_gift_png);
    var menuItem = new cc.MenuItemSprite(getGiftSprite, getGiftSprite2, function(){
      //cc.log(this._textField.string);
      this._phone = this._textField.string;
      cc.log(this._phone);
      if(this._phone){
        this.closeNoPhoneWinPage();
        //this.showHaveGetGift();
        this.getGift(this._openid, this._phone);
      }else{
        alert('请输入手机号～');
      }

    },this);
    this._menuNoPhone = new cc.Menu(menuItem);
    this._menuNoPhone.setPosition(size.width / 2, 310);
    this.addChild(this._menuNoPhone);
    // 文字
    this._messageNoPhoneLabel = new cc.LabelTTF('美甲大红包从天而降!\n\r快输入手机号领取吧!', 'Arial', 38);
    this._messageNoPhoneLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this._messageNoPhoneLabel.setPosition(size.width / 2, 645);
    this._messageNoPhoneLabel.setColor(cc.color('#b25700'));
    this.addChild(this._messageNoPhoneLabel);
    // 元宝
    this._yuanbaoSprite2 = new cc.Sprite(res.yuanbao_png);
    this._yuanbaoSprite2.attr({
      x: size.width / 2,
      y: 795,
    });
    this.addChild(this._yuanbaoSprite2);

    var rightAction = new cc.RotateBy(0.5, -5);
    var leftAction = new cc.RotateBy(0.5, 5);
    //rightAction.easing(cc.easeIn(2.0));
    //leftAction.easing(cc.easeIn(2.0));
    var moveAction = cc.sequence(rightAction, leftAction);
    var rep = new cc.RepeatForever(moveAction);
    this._yuanbaoSprite2.runAction(rep);
  },
  closeWinPage: function() {
    this._yuanbaoSprite.removeFromParent();
    this._menuWithPhone.removeFromParent();
    this._messageWithPhoneLabel.removeFromParent();
    this._phoneLabel.removeFromParent();
    this._notmeLabel.removeFromParent();
    this._draw.removeFromParent();
  },
  closeNoPhoneWinPage: function() {
    this._yuanbaoSprite2.removeFromParent();
    this._menuNoPhone.removeFromParent();
    this._messageNoPhoneLabel.removeFromParent();
    this._textField.removeFromParent();
    this._inputSprite.removeFromParent();
  },
  showHaveGetGift: function() {
    var size = cc.winSize;
    this.showMenu();
    // 文字
    var messageLabel = new cc.LabelTTF('恭喜你得到'+this._text+'元\n\r美甲大红包', 'Arial', 46);
    //messageLabel.boundingWidth = 480;
    messageLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    messageLabel.setPosition(size.width / 2 - 20, 750);
    messageLabel.setColor(cc.color('#b25700'));
    this.addChild(messageLabel);

    var messageLabel1 = new cc.LabelTTF('已放入您的账户'+this._phone+'\n\r请到“我的优惠券”查看' , 'Arial', 30);
    //messageLabel.boundingWidth = 480;
    messageLabel1.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    messageLabel1.setPosition(size.width / 2 , 620);
    messageLabel1.setColor(cc.color('#b25700'));
    this.addChild(messageLabel1);

    var tipsHeadLabel = new cc.LabelTTF('注意事项：' , 'Arial', 30);
    tipsHeadLabel.setPosition(110 , 190);
    tipsHeadLabel.setColor(cc.color.WHITE);
    this.addChild(tipsHeadLabel);
    var tipsLabel = new cc.LabelTTF(' 1.上门服务城市包括：北京、上海、深圳、广州、成都、杭州、\n\r苏州、武汉、重庆、南京、西安、天津、长沙、宁波；\n\r2.美甲大红包有效期自领取之日一周有效；\n\r3.本次活动最终解释权归嘟嘟美甲所有，详询客服：4008626066' , 'Arial', 24);
    tipsLabel.setPosition(size.width / 2 , tipsLabel.height);
    tipsLabel.setColor(cc.color.WHITE);
    this.addChild(tipsLabel);


  },
  showWinPage: function() {
    var size = cc.winSize;
    // 元宝
    this._yuanbaoSprite = new cc.Sprite(res.yuanbao_png);
    this._yuanbaoSprite.attr({
      x: size.width / 2,
      y: 795,
    });
    this.addChild(this._yuanbaoSprite);

    var rightAction = new cc.RotateBy(0.5, -5);
    var leftAction = new cc.RotateBy(0.5, 5);
    //rightAction.easing(cc.easeIn(2.0));
    //leftAction.easing(cc.easeIn(2.0));
    var moveAction = cc.sequence(rightAction, leftAction);
    var rep = new cc.RepeatForever(moveAction);
    this._yuanbaoSprite.runAction(rep);

    // 领取大红包
    var getGiftSprite = new cc.Sprite(res.get_gift_png);
    var getGiftSprite2 = new cc.Sprite(res.get_gift_png);
    var menuItem = new cc.MenuItemSprite(getGiftSprite, getGiftSprite2, function(){
      cc.log('you click it');
      this.closeWinPage();
      //this.showHaveGetGift();
      this.getGift(this._openid, this._phone);
    },this);
    this._menuWithPhone = new cc.Menu(menuItem);
    this._menuWithPhone.setPosition(size.width / 2, 450);
    this.addChild(this._menuWithPhone);
    // 文字
    this._messageWithPhoneLabel = new cc.LabelTTF('美甲大红包从天而降!', 'Arial', 38);
    this._messageWithPhoneLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this._messageWithPhoneLabel.setPosition(size.width / 2, 660);
    this._messageWithPhoneLabel.setColor(cc.color('#b25700'));
    this.addChild(this._messageWithPhoneLabel);
    // 手机号
    this._phoneLabel = new cc.LabelTTF(''+this._phone, 'Arial', 30);
    this._phoneLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this._phoneLabel.setPosition(size.width / 2, 590);
    this._phoneLabel.setColor(cc.color('#b25700'));
    this.addChild(this._phoneLabel);
    // 这不是我
    this._notmeLabel = new cc.LabelTTF('这不是我', 'Arial', 30);
    this._notmeLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this._notmeLabel.setPosition(size.width / 2, 550);
    this._notmeLabel.setColor(cc.color('#b25700'));
    this.addChild(this._notmeLabel);

    this._draw = new cc.DrawNode();
    this._draw.drawSegment(cc.p(size.width / 2 -60,530),cc.p(size.width / 2 +60,530),1,cc.color('#b25700'));
    this.addChild(this._draw);

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
        target.parent.showNoPhoneWinPage();
        target.parent.closeWinPage();
        return true;
      }
    });
    cc.eventManager.addListener(listener, this._notmeLabel);
  },
  share: function() {
    var sharelayer = new ShareLayer();
    this.addChild(sharelayer, 100);
  }

});

var GameoverScene = cc.Scene.extend({
  _score: 0,
  _result: '',
  _phone: '',
  _openid: '',
  ctor: function(score, openid, result, phone){
    this._super();
    this._openid = openid;
    this._score = score;
    this._result = result;
    this._phone = phone;
  },
  onEnter: function() {
    this._super();
    var layer = new GameoverLayer(this._score, this._openid, this._result, this._phone);
    this.addChild(layer);
  }
});

