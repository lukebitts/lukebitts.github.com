function StageOne(stage) {
	this.initialize(stage);
}
StageOne.prototype = new StageBase();
StageOne.prototype.StageBase_initialize = StageBase.prototype.initialize;
StageOne.prototype.initialize = function(stage) {
	this.World_initialize();
	this.StageBase_initialize(stage, new ChestTarget(this._world,450,520,140,50,null,0.86,-80), false, 15);
	
	this.sound = new Howl({
		urls:[queue.getResult("sound1mp3").src],
		loop:true,
	});
	this.sound.play();

	this._random_item_fn = function() {
		var rnd = Math.random();
		var screen_position = Math.random() * 150
		screen_position += (rnd < 0.49) ? 180 :
						   (rnd >= 0.49 && rnd < 0.98) ? 560 : 380;
		return {type:"coin",screen_position_x:screen_position};
	}.context(this);
	
	var bg = new createjs.Bitmap(queue.getResult("sea_bottom"));
	this.layer_back.addChild(bg);
	
	var water_data = {
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}},
		"images": [queue.getResult("agua1"), queue.getResult("agua2")],
		"frames": [[2, 1032, 1022, 202, 0, -1, -1], [2, 208, 1022, 202, 1, -1, -1], [2, 2, 1022, 202, 1, -1, -1], [2, 1650, 1022, 202, 0, -1, -1], [2, 1444, 1022, 202, 0, -1, -1], [2, 1238, 1022, 202, 0, -1, -1], [2, 414, 1022, 202, 1, -1, -1], [2, 826, 1022, 202, 0, -1, -1], [2, 620, 1022, 202, 0, -1, -1], [2, 414, 1022, 202, 0, -1, -1], [2, 208, 1022, 202, 0, -1, -1], [2, 2, 1022, 202, 0, -1, -1]]
	}
	var water = make_animated_sprite(water_data);
	this.layer_back.addChild(water);
	
	var whale_data = {
		"images": [queue.getResult("whale")],
		"frames": [[638, 2, 208, 89, 0, -5, -4], [2, 2, 208, 89, 0, -5, -4], [214, 2, 208, 89, 0, -5, -4], [426, 2, 208, 89, 0, -5, -4], [1061, 2, 207, 89, 0, -5, -4], [850, 2, 207, 89, 0, -5, -4], [1692, 2, 207, 88, 0, -5, -4], [2, 95, 206, 88, 0, -5, -4], [1272, 2, 206, 88, 0, -5, -4], [1482, 2, 206, 88, 0, -5, -4], [630, 95, 205, 87, 0, -5, -4], [212, 95, 205, 87, 0, -5, -4], [421, 95, 205, 87, 0, -5, -4], [1047, 95, 204, 87, 0, -5, -4], [839, 95, 204, 87, 0, -5, -4]],
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]}}
	}
	var whale = make_animated_sprite(whale_data);
	this.layer_back.addChild(whale);
	var complete_whale = function() {
		whale.x = (Math.random()*1200)+1000;
		whale.y = (Math.random()*200)+200;
		createjs.Tween.get(this).to({x:-Math.random()*1500-1000},120000).call(complete_whale);
	}.context(whale);
	complete_whale();
	
	var fishes = new createjs.Bitmap(queue.getResult("fishes"));
	this.layer_back.addChild(fishes);
	var complete_fishes = function() {
		fishes.x = (Math.random()*1200) - 1700;
		fishes.y = (Math.random()*200) + 200;
		createjs.Tween.get(this).to({x:Math.random()*1500+1000},40000).call(complete_fishes);
	}.context(fishes);
	complete_fishes();
	
	var fish1_data = {"animations": {"all": {"frames": [0, 1, 2, 3, 4, 3, 2, 1], "frequency": 2}}, "images": [queue.getResult("peixe1")], "frames": [[334, 2, 167, 152, 0, -23, -21], [505, 2, 167, 152, 0, -23, -21], [676, 2, 165, 152, 0, -24, -21], [167, 2, 163, 152, 0, -24, -21], [2, 2, 161, 152, 0, -25, -21]]}
	var fish1 = make_animated_sprite(fish1_data);
	this.layer_middle.addChild(fish1);
	var complete_fish1 = function() {
		this.x = (Math.random()*1200)+1000;
		this.y = (Math.random()*200)+200;
		createjs.Tween.get(this).to({x:-Math.random()*1500-1000},50000).call(complete_fish1);
	}.context(fish1);
	complete_fish1();
	
	var fish2_data = {"animations": {"all": {"frames": [0, 1, 2, 3, 4, 3, 2, 1], "frequency": 2}}, "images": [queue.getResult("peixe2")], "frames": [[97, 2, 92, 30, 0, -5, -6], [2, 2, 91, 30, 0, -6, -6], [193, 2, 89, 28, 0, -6, -6], [377, 2, 87, 26, 0, -6, -6], [286, 2, 87, 26, 0, -7, -6]]}
	var fish2 = make_animated_sprite(fish2_data);
	this.layer_middle.addChild(fish2);
	var complete_fish2 = function() {
		this.x = (Math.random()*1200)+1000;
		this.y = (Math.random()*200)+200;
		createjs.Tween.get(this).to({x:-Math.random()*1500-1000},30000).call(complete_fish2);
	}.context(fish2);
	complete_fish2();
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray1")));
	rays.getChildAt(0).x = 120;
	rays.getChildAt(0).y = 50;
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2")));
	rays.getChildAt(1).x = 150;
	rays.getChildAt(1).y = 20;
	this.layer_middle.addChild(rays);
	
	this.layer_middle.addChild(new Planktons(0,200,900,400));
	
	var complete_ray = function() { 
		if(this.alpha <= 0) {
			createjs.Tween.get(this).to({alpha:1},2000).call(complete_ray);
		} else {
			createjs.Tween.get(this).to({alpha:0},2000).call(complete_ray);
		}
	}
	complete_ray.context(rays.getChildAt(0))();
	complete_ray.context(rays.getChildAt(1))();
	
	var layer2 = new createjs.Bitmap(queue.getResult("layer2"));
	this.layer_middle.addChild(layer2);
	layer2.y = 100;
	
	this.layer_front.addChild(new createjs.Bitmap(queue.getResult("layer1")));
	
	/*** Animations ***/
	
	var data;
	
	/* Agua viva */
	data = {
		"images": [queue.getResult("aguaviva1"), queue.getResult("aguaviva1over")],
		"frames": [
			[2, 2, 70, 161, 0, -15, -10], [76, 2, 70, 160, 0, -16, -10], [150, 2, 69, 157, 0, -16, -11], [223, 2, 70, 154, 0, -15, -12], [297, 2, 71, 151, 0, -15, -13],
			[350, 2, 70, 161, 1, -15, -10], [499, 2, 71, 136, 1, -15, -11], [652, 2, 73, 116, 1, -12, -13], [729, 2, 75, 104, 1, -11, -14], [808, 2, 76, 95, 1, -9, -16], [888, 2, 75, 92, 1, -10, -16], [574, 2, 74, 124, 1, -10, -13], [424, 2, 71, 157, 1, -8, -8], [2, 2, 64, 173, 1, -13, -6], [70, 2, 65, 172, 1, -14, -7], [139, 2, 65, 171, 1, -16, -8], [208, 2, 65, 165, 1, -18, -9], [277, 2, 69, 162, 1, -16, -9]
			],
		"animations": {
			"all": {
				"frames": [0, 1, 2, 3, 4, 3, 2, 1],
				"frequency":2
			},
			"over": {
				"frames": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
				"frequency":1
			}
		}
	};
	var aguaviva = this.layer_middle.addChild(make_animated_sprite(data));
	var ay = Math.random() * 150 + 150;
	aguaviva.x = Math.random() * 600 + 150; aguaviva.y = ay;
	
	var an = 0;
	var afn = function(e){
		an++;
		
		aguaviva.y = Math.sin(Math.degToRad(an))*40 + ay;
	};
	
	aguaviva.addEventListener("tick",afn);
	
	var amfn = function(){
		aguaviva.removeEventListener("tick",afn);
		aguaviva.removeEventListener("mouseover",amfn);
		aguaviva.gotoAndPlay("over");
		setTimeout(function(){
			createjs.Tween.get(aguaviva).to({y:-150,x:aguaviva.x + 120},1800).call(function(){
				this.layer_middle.removeChild(aguaviva);
			}.context(this));
		}.context(this),300);
	}.context(this);
	
	aguaviva.addEventListener("mouseover",amfn);
	
	/* Algas 1 1 */
	data = {"images": [queue.getResult("algas1_1")], "frames": [[1401, 2, 192, 469, 0, -16, -23], [1204, 2, 193, 470, 0, -16, -23], [1006, 2, 194, 470, 0, -15, -23], [807, 2, 195, 470, 0, -13, -23], [607, 2, 196, 471, 0, -11, -23], [406, 2, 197, 471, 0, -10, -23], [204, 2, 198, 472, 0, -8, -23], [2, 2, 198, 472, 0, -7, -23]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}}
	var algas1_1 = this.layer_middle.addChild(make_animated_sprite(data));
	algas1_1.x = 575; algas1_1.y = 260;
	
	/* Algas 2 1 */
	data = {"images": [queue.getResult("algas2_1")], "frames": [[91, 2, 84, 283, 0, -21, -10], [2, 2, 85, 283, 0, -21, -10], [179, 2, 86, 283, 0, -20, -10], [366, 2, 89, 282, 0, -19, -11], [459, 2, 91, 282, 0, -18, -11], [269, 2, 93, 282, 0, -17, -12], [654, 2, 95, 281, 0, -16, -12], [554, 2, 96, 281, 0, -16, -13]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}}
	var algas2_1 = this.layer_back.addChild(make_animated_sprite(data));
	algas2_1.x = 540; algas2_1.y = 330;
	
	/* Algas 3 1 */
	data = {"images": [queue.getResult("algas3_1")], "frames": [[106, 2, 99, 348, 0, -24, -13], [2, 2, 100, 349, 0, -24, -13], [209, 2, 101, 348, 0, -23, -14], [314, 2, 103, 347, 0, -22, -15], [534, 2, 106, 345, 0, -21, -17], [421, 2, 109, 345, 0, -20, -18], [761, 2, 111, 343, 0, -19, -19], [644, 2, 113, 343, 0, -18, -20]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}}
	var algas3_1 = this.layer_back.addChild(make_animated_sprite(data));
	algas3_1.x = 155; algas3_1.y = 330;
	
	/* Algas 4 1 */
	data = {"images": [queue.getResult("algas4_1")], "frames": [[39, 2, 32, 249, 0, -11, -18], [2, 2, 33, 249, 0, -10, -18], [116, 2, 34, 249, 0, -9, -19], [75, 2, 37, 249, 0, -8, -19], [154, 2, 39, 248, 0, -6, -20], [197, 2, 42, 247, 0, -5, -21], [243, 2, 44, 246, 0, -4, -22], [291, 2, 45, 246, 0, -3, -22]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}}
	var algas4_1 = this.layer_back.addChild(make_animated_sprite(data));
	algas4_1.x = 600; algas4_1.y = 245;
	
	/* Algas 5 1 */
	data = {"images": [queue.getResult("algas5_1")], "frames": [[36, 2, 29, 195, 0, -11, -4], [2, 2, 30, 195, 0, -10, -4], [69, 2, 32, 194, 0, -9, -5], [105, 2, 35, 192, 0, -8, -6], [144, 2, 38, 191, 0, -6, -8], [186, 2, 40, 189, 0, -5, -10], [230, 2, 42, 188, 0, -4, -11], [276, 2, 44, 186, 0, -3, -12]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}}
	var algas5_1 = this.layer_back.addChild(make_animated_sprite(data));
	algas5_1.x = 290; algas5_1.y = 330;
	
	data = {"frames": [[557, 2, 175, 183, 0, -24, -12], [2, 2, 177, 183, 0, -23, -12], [183, 2, 180, 183, 0, -22, -12], [367, 2, 186, 183, 0, -19, -13], [1153, 2, 193, 182, 0, -17, -13], [948, 2, 201, 182, 0, -14, -14], [736, 2, 208, 182, 0, -12, -14], [1350, 2, 212, 181, 0, -10, -14]], "animations": {"all": {"frames": [7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6], "frequency": 2}}, "images": [queue.getResult("plantas1_1")]};
	plantas1_1 = this.layer_middle.addChild(make_animated_sprite(data));
	plantas1_1.x = 200; plantas1_1.y = 520;
	
	data = {"frames": [[2, 317, 336, 308, 0, -70, -31], [342, 317, 339, 308, 0, -68, -31], [685, 317, 345, 307, 0, -64, -32], [1566, 2, 354, 308, 0, -57, -31], [1196, 2, 366, 309, 0, -48, -30], [811, 2, 381, 310, 0, -37, -29], [412, 2, 395, 310, 0, -25, -29], [2, 2, 406, 311, 0, -16, -28]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}, "images": [queue.getResult("plantas2_1")]};
	plantas2_1 = this.layer_front.addChild(make_animated_sprite(data));
	plantas2_1.x = -120; plantas2_1.y = 290;
	
	data = {"frames": [[1061, 2, 209, 181, 0, -34, -12], [849, 2, 208, 181, 0, -33, -12], [637, 2, 208, 181, 0, -31, -13], [214, 2, 208, 181, 0, -27, -13], [2, 2, 208, 181, 0, -24, -14], [426, 2, 207, 181, 0, -22, -14], [1274, 2, 205, 180, 0, -21, -15], [1483, 2, 204, 180, 0, -20, -15]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}, "images": [queue.getResult("plantas3_1")]};
	plantas3_1 = this.layer_middle.addChild(make_animated_sprite(data));
	plantas3_1.x = 685; plantas3_1.y = 220;
	
	data = {"frames": [[550, 2, 175, 183, 0, -12, -14], [1087, 2, 175, 183, 0, -13, -14], [908, 2, 175, 183, 0, -15, -14], [729, 2, 175, 183, 0, -19, -14], [1266, 2, 176, 183, 0, -24, -14], [369, 2, 177, 183, 0, -28, -14], [186, 2, 179, 183, 0, -32, -14], [2, 2, 180, 183, 0, -35, -14]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}, "images": [queue.getResult("plantas4_1")]};
	plantas4_1 = this.layer_middle.addChild(make_animated_sprite(data));
	plantas4_1.x = -70; plantas4_1.y = 260;
	
	data = {"images": [queue.getResult("concha")], "frames": [[206, 2, 57, 30, 0, -18, -39], [267, 2, 57, 28, 0, -18, -41], [138, 2, 64, 38, 0, -18, -31], [2, 2, 62, 56, 0, -19, -13], [68, 2, 66, 53, 0, -18, -16]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1], "frequency":2, "next":"stop"}}};
	concha = this.layer_middle.addChild(make_animated_sprite(data));
	concha.gotoAndStop(0);
	concha.x = 420; concha.y = 555;
	
	concha.addEventListener("mouseover",function(){
		concha.gotoAndPlay("all");
	});
	
	this.addEventListener("destroy",this.ondestroy.context(this));
}
StageOne.prototype.ondestroy = function() {
	this.sound.stop();
}