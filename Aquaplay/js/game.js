function main() {
	var stage = new createjs.Stage("canvas");	
	var stage_one = new LoadingScreen(stage);
}
window.onload = main;

createjs.Ticker.setFPS(30);