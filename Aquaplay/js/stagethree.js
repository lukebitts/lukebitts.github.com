function StageThree(stage) {
	this.initialize(stage);
}
StageThree.prototype = new StageBase();
StageThree.prototype.StageBase_initialize = StageBase.prototype.initialize;
StageThree.prototype.initialize = function(stage) {
	this.World_initialize();
	this.StageBase_initialize(stage, new ChestTarget(this._world, 450, 520, 100, 50,[
		[385,510,10,90,-3.9],
		[515,510,10,90,3.9],
		[450,520+30,120,10,0],
		[450,520-55,120,100,0]
	], 0.7, -60), true, 50);
	
	this._random_item_fn = function() {
		var rnd = Math.random();
		var screen_position = Math.random() * 150
		screen_position += (rnd < 0.49) ? 180 :
						   (rnd >= 0.49 && rnd < 0.98) ? 560 : 380;
		return {type:(Math.random() < 0.8) ? "coin" : (rnd >= 0.98) ? "coin" : "diamond",screen_position_x:screen_position};
	}.context(this);
	
	this.sound = new Howl({
		urls:getSound("sound3"),
		group:"music",
		loop:true
	});
	this.sound.play();
	
	var bg = new createjs.Bitmap(queue.getResult("layer3_3"));
	this.layer_back.addChild(bg);
	
	var mermaid_data = {"images": [queue.getResult("mermaid")], "frames": [[2, 66, 251, 54, 0, -6, -10], [1761, 2, 251, 55, 0, -5, -9], [1506, 2, 251, 55, 0, -5, -9], [1251, 2, 251, 56, 0, -5, -8], [998, 2, 249, 57, 0, -5, -7], [747, 2, 247, 58, 0, -5, -6], [497, 2, 246, 59, 0, -4, -5], [249, 2, 244, 59, 0, -4, -5], [2, 2, 243, 60, 0, -4, -4]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}}
	
	var mermaid = make_animated_sprite(mermaid_data);
	this.layer_back.addChild(mermaid);
	var complete_mermaid = function() {
		mermaid.x = (Math.random()*400 + 1000);
		mermaid.y = (Math.random()*200 + 200);
		createjs.Tween.get(this).to({x:Math.random() * 800 - 2000},28000).call(complete_mermaid);
	}.context(mermaid);
	complete_mermaid();
	
	this.layer_back.addChild(new Planktons(150,0,750,450));
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray3_1")));
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray3_2")));
	this.layer_back.addChild(rays);
	
	var complete_ray = function() {
		if(this.alpha <= 0) {
			createjs.Tween.get(this).to({alpha:1},2000).call(complete_ray);
		} else {
			createjs.Tween.get(this).to({alpha:0},2000).call(complete_ray);
		}
	}
	complete_ray.context(rays.getChildAt(0))();
	complete_ray.context(rays.getChildAt(1))();
	
	var layer2 = new createjs.Bitmap(queue.getResult("layer3_2"));
	this.layer_middle.addChild(layer2);
	
	this.layer_front.addChild(new createjs.Bitmap(queue.getResult("layer3_1")));
	
	/* Animations */
	
	var data = {"images": [queue.getResult("plantas1_3")], "frames": [[288, 2, 281, 344, 0, -40, -9], [2, 2, 282, 345, 0, -37, -9], [573, 2, 285, 343, 0, -29, -10], [862, 2, 288, 340, 0, -20, -14], [1154, 2, 296, 337, 0, -12, -17], [1454, 2, 300, 332, 0, -7, -22], [2, 351, 301, 326, 0, -6, -28], [307, 351, 300, 320, 0, -7, -35]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	plantas1_3 = make_animated_sprite(data);
	this.layer_middle.addChild(plantas1_3);
	plantas1_3.x = 620; plantas1_3.y = 200;
	
	data = {"images": [queue.getResult("plantas2_3")], "frames": [[189, 2, 183, 195, 0, -3, -8], [2, 2, 183, 196, 0, -4, -8], [376, 2, 183, 194, 0, -9, -9], [563, 2, 187, 193, 0, -11, -11], [754, 2, 193, 192, 0, -12, -12], [951, 2, 199, 191, 0, -13, -14], [1154, 2, 204, 190, 0, -13, -16], [1362, 2, 207, 189, 0, -13, -17]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	plantas2_3 = make_animated_sprite(data);
	this.layer_middle.addChild(plantas2_3);
	plantas2_3.x = 0; plantas2_3.y = 300;
	
	data = {"images": [queue.getResult("plantas3_3")], "frames": [[179, 2, 171, 171, 0, -62, -1], [2, 2, 173, 171, 0, -61, -1], [354, 2, 180, 171, 0, -57, -1], [538, 2, 191, 168, 0, -50, -4], [733, 2, 204, 164, 0, -40, -8], [941, 2, 217, 160, 0, -31, -12], [1162, 2, 229, 158, 0, -23, -14], [1395, 2, 236, 158, 0, -18, -15]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	plantas3_3 = make_animated_sprite(data);
	this.layer_back.addChild(plantas3_3);
	plantas3_3.x = 50; plantas3_3.y = 280;
	
	data = {"images": [queue.getResult("algas1_3")], "frames": [[72, 2, 65, 215, 0, -18, -8], [2, 2, 66, 216, 0, -18, -8], [213, 2, 67, 215, 0, -17, -8], [141, 2, 68, 215, 0, -17, -9], [284, 2, 69, 214, 0, -16, -10], [357, 2, 70, 213, 0, -16, -11], [431, 2, 71, 212, 0, -15, -11], [506, 2, 72, 212, 0, -15, -12]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	algas1_3 = make_animated_sprite(data);
	this.layer_back.addChild(algas1_3);
	algas1_3.x = 280; algas1_3.y = 460;
	
	data = {"images": [queue.getResult("algas2_3")], "frames": [[110, 2, 103, 371, 0, -22, -15], [2, 2, 104, 371, 0, -22, -16], [329, 2, 106, 370, 0, -21, -16], [217, 2, 108, 370, 0, -20, -17], [439, 2, 110, 369, 0, -19, -17], [671, 2, 112, 368, 0, -18, -18], [553, 2, 114, 368, 0, -17, -19], [787, 2, 115, 367, 0, -17, -19]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	algas2_3 = make_animated_sprite(data);
	this.layer_back.addChild(algas2_3);
	algas2_3.x = -20; algas2_3.y = 190;
	
	data = {"images": [queue.getResult("algas3_3")], "frames": [[89, 2, 82, 283, 0, -10, -14], [2, 2, 83, 283, 0, -9, -14], [175, 2, 85, 283, 0, -8, -14], [264, 2, 87, 282, 0, -7, -15], [355, 2, 89, 281, 0, -6, -16], [545, 2, 91, 280, 0, -5, -17], [448, 2, 93, 280, 0, -4, -18], [640, 2, 95, 279, 0, -3, -19]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}}
	algas3_3 = make_animated_sprite(data);
	this.layer_back.addChild(algas3_3);
	algas3_3.x = 650; algas3_3.y = 100;
	
	data = {"images": [queue.getResult("algas4_3")], "frames": [[77, 2, 70, 293, 0, -16, -4], [2, 2, 71, 293, 0, -15, -4], [151, 2, 72, 293, 0, -14, -5], [227, 2, 74, 292, 0, -13, -6], [305, 2, 76, 291, 0, -12, -7], [385, 2, 79, 290, 0, -11, -8], [468, 2, 81, 289, 0, -10, -9], [553, 2, 82, 289, 0, -9, -10]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	algas4_3 = make_animated_sprite(data);
	this.layer_back.addChild(algas4_3);
	algas4_3.x = 150; algas4_3.y = 160;
	
	data = {"images": [queue.getResult("algas5_3")], "frames": [[95, 2, 88, 434, 0, -23, -10], [2, 2, 89, 435, 0, -22, -10], [187, 2, 91, 434, 0, -21, -11], [282, 2, 93, 433, 0, -20, -12], [379, 2, 96, 432, 0, -18, -13], [479, 2, 99, 431, 0, -17, -14], [582, 2, 102, 430, 0, -15, -15], [688, 2, 103, 430, 0, -14, -15]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	algas5_3 = make_animated_sprite(data);
	this.layer_back.addChild(algas5_3);
	algas5_3.x = 500; algas5_3.y = 40;
	
	data = {"images": [queue.getResult("concha")], "frames": [[206, 2, 57, 30, 0, -18, -39], [267, 2, 57, 28, 0, -18, -41], [138, 2, 64, 38, 0, -18, -31], [2, 2, 62, 56, 0, -19, -13], [68, 2, 66, 53, 0, -18, -16]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1], "frequency":2, "next":"stop"}}};
	concha = this.layer_middle.addChild(make_animated_sprite(data));
	concha.gotoAndStop(0);
	concha.x = 420; concha.y = 405;
	
	concha.addEventListener("mouseover",function(){
		concha.gotoAndPlay("all");
	});
	
	this.addEventListener("destroy",this.ondestroy.context(this));
	
	var last_time = 0;
	var last_open = 0;
	var closed = false;
	var open_time = 0;
	this.addEventListener("tick",function(e){
		if(createjs.Ticker.getPaused() || this.is_paused()) return;
	
		if(e.params[0].runTime - last_time >= 4000) {
			if(Math.random() > 0.7) {
				this.chestTarget.close();
				open_time = Math.random() * 2000 + 1000;
				last_open = e.params[0].runTime;
				closed = true;
			}
			last_time = e.params[0].time;
		}
		if(closed && (e.params[0].runTime - last_open >= open_time)) {
			this.chestTarget.open();
			closed = false;
			last_open = e.params[0].runTime;
		}
	}.context(this));
	
	setInterval(this.interval,4000);
}
StageThree.prototype.StageBase_ondestroy = StageBase.prototype.ondestroy;
StageThree.prototype.ondestroy = function() {
	this.StageBase_ondestroy();
	this.sound.stop();
}