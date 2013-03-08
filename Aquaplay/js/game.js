function main() {
	var stage = new createjs.Stage("canvas");	
	new LoadingScreen(stage);
	
	stage.enableMouseOver(1000);
	createjs.Touch.enable(stage);
	
	var tick = function(evt) {
		stage.update(evt);
	}
	createjs.Ticker.addEventListener("tick",tick);
}
window.onload = main;

createjs.Ticker.setFPS(30);