function main() {
	var stage = new createjs.Stage("canvas");	
	var stage_one = new MainMenu(stage);
}
window.onload = main;

function main_menu() {
	stage.removeAllChildren();
	createjs.Ticker.removeEventListener("tick");
		
	var objects = new createjs.Container();
	
	var bg = new createjs.Shape();
	bg.graphics.beginFill("red").drawRect(-10,-10,120,70);
	objects.addChild(bg);
	
	var play_button = new createjs.Text("Jogar","40px Arial", "black");
	objects.addChild(play_button);
	
	objects.x = 500;
	objects.y = 300;
	
	stage.addChild(objects);
	
	createjs.Ticker.addEventListener("tick", tick);
}

function load() {
	stage.removeAllChildren();
	createjs.Ticker.removeEventListener("tick");

	var objects = new createjs.Container();
	var loading_text = new createjs.Text("Carregando","20px Arial", "black");
	loading_text.x = 500;
	loading_text.y = 300;
	objects.addChild(loading_text);
	stage.addChild(objects);
	
	window.setTimeout(main_menu,400);
	createjs.Ticker.addEventListener("tick", tick);
}

createjs.Ticker.setFPS(30);