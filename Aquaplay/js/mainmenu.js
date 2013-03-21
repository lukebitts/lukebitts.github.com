function ButtonHelper(normal, over) {
	this.initialize(normal, over);
}
ButtonHelper.prototype = new createjs.Container();
ButtonHelper.prototype.Container_initializer = createjs.Container.prototype.initialize;
ButtonHelper.prototype.initialize = function(normal, over) {
	this.Container_initializer();
	
	this.normal = new createjs.Bitmap(queue.getResult(normal));
	this.over = new createjs.Bitmap(queue.getResult(over));
	
	this.addChild(this.normal);
	
	this.addEventListener("mousedown",function(e){
		this.removeChild(this.normal);
		this.addChild(this.over);
		
		e.addEventListener("mouseup",function(){
			this.addChild(this.normal);
			this.removeChild(this.over);
		}.context(this))
	}.context(this));
}

function MainMenu(stage) {
	this.initialize(stage);
}
MainMenu.prototype = new ScreenBase();
MainMenu.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
MainMenu.prototype.initialize = function(stage) {
	this.ScreenBase_initialize(stage);
	
	this.sound = new Howl({
		urls:[queue.getResult("sound1mp3").src],
		loop:true,
	});
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
	}.context(this));
}

