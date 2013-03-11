var queue = new createjs.LoadQueue(false);

function LoadingScreen(stage) {
	this.initialize(stage);
}
LoadingScreen.prototype = new ScreenBase();
LoadingScreen.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
LoadingScreen.prototype.initialize = function(stage) {
	this.ScreenBase_initialize(stage);
	
	var objects = new createjs.Container();
	var loading_text = new createjs.Text("Carregando: 0%","20px Arial", "black");
	loading_text.x = 500;
	loading_text.y = 300;
	objects.addChild(loading_text);
	this.addChild(objects);
	
	queue.addEventListener("progress", function(e) {
		loading_text.text = "Carregando: " + parseInt(e.loaded * 100) + "%";
	});
	queue.addEventListener("complete", function(e){
		this.destroy();
		new MainMenu(this.stage);
	}.context(this));
	
	queue.loadManifest([
		{id:"sea_bottom", src:"img/sea_bottom.png"},
		{id:"layer1", src:"img/layer1.png"},
		{id:"layer2", src:"img/layer2.png"},
		{id:"bubble", src:"img/bubble.png"},
		{id:"coin", src:"img/coin.png"},
		{id:"diamond", src:"img/diamond.png"},
		{id:"fishes", src:"img/fishes_right.png"},
		{id:"glow", src:"img/glow.png"},
		{id:"ray1", src:"img/ray1.png"},
		{id:"ray2", src:"img/ray2.png"},
		{id:"whale", src:"img/whale.png"},
		{id:"chest", src:"img/chest_front2.png"},
		{id:"chesttop", src:"img/chest_top2.png"},
		{id:"chestclosed", src:"img/chest_closed2.png"},
		{id:"sea_bottom_ship", src:"img/sea_bottom_ship.png"},
		{id:"layer2_1", src:"img/layer2_1.png"},
		{id:"layer2_2", src:"img/layer2_2.png"},
		{id:"ray2_1", src:"img/ray2_1.png"},
		{id:"ray2_2", src:"img/ray2_2.png"},
		{id:"fish_off", src:"img/fish_off.png"},
		{id:"fish_on", src:"img/fish_on.png"},
		{id:"ghost", src:"img/ghost.png"},
		{id:"mermaid", src:"img/mermaid.png"},
		{id:"layer3_1", src:"img/layer3_1.png"},
		{id:"layer3_2", src:"img/layer3_2.png"},
		{id:"layer3_3", src:"img/layer3_3.png"},
		{id:"ray3_1", src:"img/ray3_1.png"},
		{id:"ray3_2", src:"img/ray3_2.png"},
		
		{id:"planks", src:"img/hud/planks.png"},
		{id:"button", src:"img/hud/button.png"},
		{id:"button_press", src:"img/hud/button_press.png"},
		{id:"bgscore", src:"img/hud/bgscore.png"}
	]);
}