function MainMenu(stage) {
	this.stage = stage;
	
	this.stage.addChild(this);
	this._tick_callback = this.tick.context(this);
	createjs.Ticker.addEventListener("tick",this._tick_callback);
	
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
		new StageOne(this.stage);
	}.context(this));

}
MainMenu.prototype = new createjs.Container();
MainMenu.prototype.tick = function(evt) {
	this.stage.update();
};
MainMenu.prototype.destroy = function() {
	this.stage.removeChild(this);
	createjs.Ticker.removeEventListener("tick",this._tick_callback);
};