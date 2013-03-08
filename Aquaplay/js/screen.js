function ScreenBase(stage) {
	if(!stage) return;
	this.initialize(stage);
}
ScreenBase.prototype = new createjs.Container();
ScreenBase.prototype.Container_initialize = createjs.Container.prototype.initialize;
ScreenBase.prototype.initialize = function(stage) {
	this.Container_initialize();

	this.stage = stage;
	this.stage.addChild(this);
	
	this.addEventListener("tick", this.handle_tick.context(this));
	
	this._paused = false;
}
ScreenBase.prototype.set_pause = function(state) {
	this._paused = state;
}
ScreenBase.prototype.is_paused = function() {
	return this._paused;
}
ScreenBase.prototype.handle_tick = function(evt) {

}
ScreenBase.prototype.destroy = function() {
	this.stage.removeChild(this);
}