function MainMenu(stage) {
	this.initialize(stage);
}
MainMenu.prototype = new ScreenBase();
MainMenu.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
MainMenu.prototype.initialize = function(stage) {
	this.ScreenBase_initialize(stage);
	
	this.play_btn = new createjs.Container();
	this.addChild(this.play_btn);
	
	var play_bg = new createjs.Shape();
	play_bg.graphics.beginFill("red").drawRect(0,0,100,50);
	this.play_btn.addChild(play_bg);
	
	var play_text = new createjs.Text("Jogar","40px Arial","black");
	this.play_btn.addChild(play_text);
	
	this.play_btn.x = 300;
	this.play_btn.y = 200;
	
	this.play_btn.addEventListener("mousedown",function(){
		this.destroy();
		new StageThree(this.stage);
	}.context(this));
}