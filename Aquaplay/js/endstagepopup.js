function EndStagePopup(stage,other) {
	this.stage = stage;
	console.log(this.stage);
	
	this.stage.addChild(this);
	this._tick_callback = this.tick.context(this);
	createjs.Ticker.addEventListener("tick",this._tick_callback);
	
	var bg = new createjs.Shape();
	bg.graphics.beginFill("gray").drawRect(0,0,300,200);
	this.x = 300;
	this.y = 300;
	
	bg.addEventListener("mousedown",function(){
		this.destroy();
		other.destroy();
		new StageTwo(other.stage);
	}.context(this));
	
	this.addChild(bg);
}
EndStagePopup.prototype = new createjs.Container();
EndStagePopup.prototype.tick = function(evt) {
	this.stage.update();
};
EndStagePopup.prototype.destroy = function() {
	this.stage.removeChild(this);
	createjs.Ticker.removeEventListener("tick",this._tick_callback);
};