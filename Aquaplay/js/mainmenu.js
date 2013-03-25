function MainMenu(stage) {
	this.initialize(stage);
}
MainMenu.prototype = new ScreenBase();
MainMenu.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
MainMenu.prototype.initialize = function(stage) {
	this.ScreenBase_initialize(stage);
	
	this.sound = new Howl({
		urls:getSound("sound1"),
		loop:true,
	});
	
	Howler.music.push(this.sound);
	
	this.sound.play();
	
	var t1 = new createjs.Text("a","12px Alice","#000");
	var t2 = new createjs.Text("b","12px Prelo-Black","#000");
	this.addChild(t1);
	this.addChild(t2);
	
	this.addChild(new createjs.Bitmap(queue.getResult("menu_bg")));
	
	this.addChild(new createjs.Bitmap(queue.getResult("menu_pirate")));
	
	var title = new createjs.Bitmap(queue.getResult("title"));
	title.y = 50;
	title.x = 20;
	this.addChild(title);
	
	btn_play = new ButtonHelper("btn_play","btn_play_press");
	btn_play.x = 80;
	btn_play.y = 400;
	this.addChild(btn_play);
	
	btn_howtoplay = new ButtonHelper("btn_howtoplay","btn_howtoplay_press");
	btn_howtoplay.x = 70;
	btn_howtoplay.y = 500;
	this.addChild(btn_howtoplay);
	
	btn_play.addEventListener("click",function(){
		this.destroy();
		new StageOne(this.stage);
	}.context(this));
	
	btn_howtoplay.addEventListener("click",function(){
		title.x = 500;
		title.y = 430;
		this.removeChild(btn_play);
		this.removeChild(btn_howtoplay);
		var self = this;
		new HowToPlay(this.stage, this, function(){
			this.destroy();
			self.destroy();
			new StageOne(self.stage);
		});
	}.context(this));
	
	this.addEventListener("destroy",function(){
		this.sound.stop();
		
		Howler.music.splice(Howler.music.indexOf(this.sound),1);
	}.context(this));
}

