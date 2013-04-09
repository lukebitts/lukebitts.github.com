function EndStagePopup(stage,other,next) {
	this.initialize(stage,other,next);
}
EndStagePopup.prototype = new ScreenBase();
EndStagePopup.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
EndStagePopup.prototype.initialize = function(stage, other, next) {
	this.ScreenBase_initialize(stage);
	
	this.stage = stage;
	
	this.stage.addChild(this);
	
	var bg = new createjs.Shape();
	bg.alpha = 0.4;
	bg.graphics.beginFill("gray").drawRect(0,0,300,200);
	bg.x = 300;
	bg.y = 200;
	
	var data = {"images": [queue.getResult("pirate")], "frames": [[1040, 2, 515, 668, 0, -13, -31], [521, 2, 515, 668, 0, -13, -31], [2, 2, 515, 668, 0, -13, -31]], "animations": {"all": {"frames": [0, 1, 2, 2, 2, 1, 1, 0, 0], "frequency":2}}};
	this.pirate = this.addChild(make_animated_sprite(data));
	this.pirate.x = 350;
	this.pirate.y = 100;
	
	bg.addEventListener("mousedown",function(){
		this.destroy();
		other.destroy();
		new next(other.stage);
	}.context(this));
	
	this.addChild(bg);
}