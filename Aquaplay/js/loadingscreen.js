var queue = new createjs.LoadQueue(false);

function LoadingScreen(stage) {
	this.initialize(stage);
}
LoadingScreen.prototype = new ScreenBase();
LoadingScreen.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
LoadingScreen.prototype.initialize = function(stage) {
	this.ScreenBase_initialize(stage);
	
	queue.installPlugin(createjs.Sound);
	
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
		{id:"bubble_pop", src:"img/bubble_pop.png"},
		{id:"coin", src:"img/coin.png"},
		{id:"diamond", src:"img/diamond.png"},
		{id:"fishes", src:"img/fishes_right.png"},
		{id:"glow", src:"img/glow.png"},
		{id:"ray1", src:"img/ray1.png"},
		{id:"ray2", src:"img/ray2.png"},
		{id:"chest", src:"img/chest_front2.png"},
		{id:"chesttop", src:"img/chest_top2.png"},
		{id:"chestclosed", src:"img/chest_closed2.png"},
		
		{id:"bau_top", src:"img/anim/bau_tampa.png"},
		{id:"bau_body", src:"img/anim/bau_corpo.png"},
		
		{id:"sea_bottom_ship", src:"img/sea_bottom_ship.png"},
		{id:"layer2_1", src:"img/layer2_1.png"},
		{id:"layer2_2", src:"img/layer2_2.png"},
		{id:"ray2_1", src:"img/ray2_1.png"},
		{id:"ray2_2", src:"img/ray2_2.png"},
		{id:"fish_off", src:"img/fish_off.png"},
		{id:"fish_on", src:"img/fish_on.png"},
		{id:"layer3_1", src:"img/layer3_1.png"},
		{id:"layer3_2", src:"img/layer3_2.png"},
		{id:"layer3_3", src:"img/layer3_3.png"},
		{id:"ray3_1", src:"img/ray3_1.png"},
		{id:"ray3_2", src:"img/ray3_2.png"},
		
		{id:"planks", src:"img/hud/planks.png"},
		{id:"button", src:"img/hud/button.png"},
		{id:"button_press", src:"img/hud/button_press.png"},
		{id:"bgscore", src:"img/hud/bgscore.png"},
		{id:"score_text_glow", src:"img/hud/score_text_glow.png"},
		{id:"btn_pause", src:"img/hud/btn_pause.png"},
		{id:"btn_pause_press", src:"img/hud/btn_pause_press.png"},
		
		{id:"alga", src:"img/anim/alga.png"},
		{id:"aguaviva1over", src:"img/anim/agua viva cenario 1 over.png"},
		{id:"aguaviva1", src:"img/anim/agua viva cenario 1 parada.png"},
		{id:"aguaviva2over", src:"img/anim/agua viva cenario 2 over.png"},
		{id:"aguaviva2", src:"img/anim/agua viva cenario 2 parada.png"},
		{id:"algas1_1", src:"img/anim/algas 1 cenario 1.png"},
		{id:"algas1_2", src:"img/anim/algas 1 cenario 2.png"},
		{id:"algas1_3", src:"img/anim/algas 1 cenario 3.png"},
		{id:"algas2_1", src:"img/anim/algas 2 cenario 1.png"},
		{id:"algas2_2", src:"img/anim/algas 2 cenario 2.png"},
		{id:"algas2_3", src:"img/anim/algas 2 cenario 3.png"},
		{id:"algas3_1", src:"img/anim/algas 3 cenario 1.png"},
		{id:"algas3_2", src:"img/anim/algas 3 cenario 2.png"},
		{id:"algas3_3", src:"img/anim/algas 3 cenario 3.png"},
		{id:"algas4_1", src:"img/anim/algas 4 cenario 1.png"},
		{id:"algas4_3", src:"img/anim/algas 4 cenario 3.png"},
		{id:"algas5_1", src:"img/anim/algas 5 cenario 1.png"},
		{id:"algas5_3", src:"img/anim/algas 5 cenario 3.png"},
		
		{id:"ghost", src:"img/anim/fantasma.png"},
		{id:"kraken", src:"img/anim/kraken.png"},
		
		{id:"plantas1_1", src:"img/anim/cenario 1 plantas 1.png"},
		{id:"plantas2_1", src:"img/anim/cenario 1 plantas 2.png"},
		{id:"plantas3_1", src:"img/anim/cenario 1 plantas 3.png"},
		{id:"plantas4_1", src:"img/anim/cenario 1 plantas 4.png"},
		{id:"peixe1", src:"img/anim/peixe 1.png"},
		{id:"peixe2", src:"img/anim/peixe 2.png"},
		{id:"agua1", src:"img/anim/agua cenario 1_0.png"},
		{id:"agua2", src:"img/anim/agua cenario 1_1.png"},
		{id:"concha", src:"img/anim/concha.png"},
		{id:"whale", src:"img/anim/baleia.png"},
		
		{id:"esponja1", src:"img/anim/cenario 2 esponja 1.png"},
		{id:"esponja2", src:"img/anim/cenario 2 esponja 2.png"},
		{id:"esponja3", src:"img/anim/cenario 2 esponja 3.png"},
		{id:"shark", src:"img/anim/tubarao.png"},
		
		{id:"plantas1_3", src:"img/anim/cenario 3 plantas 1.png"},
		{id:"plantas2_3", src:"img/anim/cenario 3 plantas 2.png"},
		{id:"plantas3_3", src:"img/anim/cenario 3 plantas 3.png"},
		{id:"mermaid", src:"img/anim/sereia.png"},
		
		/* Main menu */
		{id:"menu_bg", src:"img/hud/splash_background.png"},
		{id:"menu_pirate", src:"img/hud/splash_pirate.png"},
		{id:"btn_howtoplay", src:"img/hud/button_howtoplay.png"},
		{id:"btn_howtoplay_press", src:"img/hud/button_howtoplay_press.png"},
		{id:"btn_play", src:"img/hud/button_play.png"},
		{id:"btn_play_press", src:"img/hud/button_play_press.png"},
		{id:"title", src:"img/hud/title.png"},
		
		/* How to play */
		{id:"howtoplay_arrow", src:"img/hud/howtoplay_arrow.png"},
		{id:"howtoplay_bg", src:"img/hud/howtoplay_bg.png"},
					
		/* Sound loading */
		{id:"sound1ogg", src:"sound/ogg/1-tema-aquaplay-alegre.ogg"},
		{id:"sound1mp3", src:"sound/mp3/1-tema-aquaplay-alegre.mp3"},
		
		{id:"sound2ogg", src:"sound/ogg/1-tema-aquaplay-sombrio.ogg"},
		{id:"sound2mp3", src:"sound/mp3/1-tema-aquaplay-sombrio.mp3"},
		
		{id:"sound3ogg", src:"sound/ogg/1-tema-aquaplay-atlantis.ogg"},
		{id:"sound3mp3", src:"sound/mp3/1-tema-aquaplay-atlantis.mp3"},
		
		{id:"win_soundmp3", src:"sound/mp3/aquaplay-tela-acerto.mp3"},
		{id:"win_soundogg", src:"sound/ogg/aquaplay-tela-acerto.ogg"},
		{id:"diamond_soundmp3", src:"sound/mp3/pega-diamante.mp3"},
		{id:"diamond_soundogg", src:"sound/ogg/pega-diamante.ogg"},
		{id:"coin_soundmp3", src:"sound/mp3/pega-moeda.mp3"},
		{id:"coin_soundogg", src:"sound/ogg/pega-moeda.ogg"},
		{id:"bubble_soundmp3", src:"sound/mp3/bolhas.mp3"},
		{id:"bubble_soundogg", src:"sound/ogg/bolhas.ogg"},
		
		{id:"chest_closeogg", src:"sound/ogg/bau.ogg"},
		{id:"chest_closemp3", src:"sound/mp3/bau.mp3"},
	]);
}