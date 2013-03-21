function EndStagePopup(stage,other,next) {
	this.initialize(stage,other,next);
}
EndStagePopup.prototype = new createjs.Container();
EndStagePopup.prototype.Container_initialize = createjs.Container.prototype.initialize;
EndStagePopup.prototype.initialize = function(stage, other, next) {
	this.Container_initialize();
	
	this.stage = stage;
	
	this.stage.addChild(this);
	
	var bg = new createjs.Shape();
	bg.alpha = 0.4;
	bg.graphics.beginFill("gray").drawRect(0,0,300,200);
	this.x = 300;
	this.y = 200;
	
	bg.addEventListener("mousedown",function(){
		this.destroy();
		other.destroy();
		new next(other.stage);
	}.context(this));
	
	this.addChild(bg);
}
EndStagePopup.prototype.destroy = function() {
	this.stage.removeChild(this);
};