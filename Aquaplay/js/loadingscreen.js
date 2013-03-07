var queue = new createjs.LoadQueue(false);

function LoadingScreen(stage) {
	this.initialize(stage);
}
LoadingScreen.prototype = new createjs.Container();
LoadingScreen.prototype.Container_initialize = createjs.Container.prototype.initialize;
LoadingScreen.prototype.initialize = function(stage) {
	this.Container_initialize();

	this.stage = stage;
	this.stage.enableMouseOver(1000);
	createjs.Touch.enable(this.stage);
	
	this.stage.addChild(this);
	this._tick_callback = this.handleTick.context(this);
	createjs.Ticker.addEventListener("tick",this._tick_callback);
	
	var objects = new createjs.Container();
	var loading_text = new createjs.Text("Carregando: 0%","20px Arial", "black");
	loading_text.x = 500;
	loading_text.y = 300;
	objects.addChild(loading_text);
	this.addChild(objects);
	
	queue.addEventListener("fileprogress", function(e) {
		loading_text.text = "Carregando: " + parseInt(e.progress * 100) + "%";
	});
	queue.addEventListener("complete", function(e){
		this.destroy();
		stage_one = new MainMenu(this.stage);
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
		{id:"ghost", src:"img/ghost.png"}
	]);
}
LoadingScreen.prototype.handleTick = function(evt) {
	this.stage.update(evt);
};
LoadingScreen.prototype.destroy = function() {
	this.stage.removeChild(this);
	createjs.Ticker.removeEventListener("tick",this._tick_callback);
};