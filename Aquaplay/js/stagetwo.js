function StageTwo(stage) {
	this.initialize(stage);
}
var anim;
StageTwo.prototype = new StageBase();
StageTwo.prototype.StageBase_initialize = StageBase.prototype.initialize;
StageTwo.prototype.initialize = function(stage) {
	this.World_initialize();
	this.StageBase_initialize(stage, new ChestTarget(this._world,450,520 - 50,100,50,
	[
		[385,510 - 50,10,90,-3.9],
		[515,510 - 50,10,90,3.9],
		[450,520 - 50+30,120,10,0],
		[450,520-105,120,100,0],
	], 0.7, -60), false, 30);
	
	this._random_item_fn = function() {
		var rnd = Math.random();
		var screen_position = Math.random() * 150
		screen_position += (rnd < 0.49) ? 180 :
						   (rnd >= 0.49 && rnd < 0.98) ? 560 : 380;
		return {type:(Math.random() < 0.8) ? "coin" : (rnd >= 0.98) ? "coin" : "diamond",screen_position_x:screen_position};
	}.context(this);
	
	this.sound = new Howl({
		urls:getSound("sound2"),
		loop:true
	});
	
	Howler.music.push(this.sound);
	
	this.sound.play();
	
	var bg = new createjs.Bitmap(queue.getResult("sea_bottom_ship"));
	bg.y = -80;
	this.layer_back.addChild(bg);
	
	var data = {
		"images": [queue.getResult("kraken")],
		"frames": [
			[1981, 992, 33, 0, 0, -271, -523],
			[1985, 513, 44, 2, 0, -270, -521],
			[983, 1334, 69, 11, 0, -265, -512],
			[893, 1334, 86, 29, 0, -269, -494],
			[796, 1334, 93, 50, 0, -280, -473],
			[684, 1334, 108, 72, 0, -284, -451],
			[1878, 513, 103, 100, 0, -304, -423],
			[353, 1334, 327, 129, 0, -89, -394],
			[2, 1334, 347, 160, 0, -78, -364],
			[1613, 992, 364, 193, 0, -72, -330],
			[1227, 992, 382, 230, 0, -64, -293],
			[829, 992, 394, 267, 0, -57, -257],
			[422, 992, 403, 303, 0, -49, -221],
			[2, 992, 416, 338, 0, -42, -186],
			[1443, 513, 431, 370, 0, -35, -153],
			[991, 513, 448, 398, 0, -29, -125],
			[1568, 2, 466, 424, 0, -24, -99],
			[504, 513, 483, 452, 0, -20, -71],
			[2, 513, 498, 475, 0, -16, -48],
			[1053, 2, 511, 492, 0, -14, -31],
			[529, 2, 520, 503, 0, -12, -20],
			[2, 2, 523, 507, 0, -12, -16]
		],
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 21, 21, 21, 20, 19, 18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], "frequency":2}}
	};
	kraken = make_animated_sprite(data);
	kraken.x = 250; kraken.y = 100;
	this.layer_back.addChild(kraken);
	
	var ship = this.layer_back.addChild(new createjs.Bitmap(queue.getResult("ship")));
	ship.x = 30;
	ship.y = -100;
	
	var fish_off = new createjs.Bitmap(queue.getResult("fish_off"));
	var fish_on = new createjs.Bitmap(queue.getResult("fish_on"));
	this.layer_back.addChild(fish_off);
	this.layer_back.addChild(fish_on);
	var complete_fishes = function() {
		fish_off.x = (Math.random()*1200)-1700;
		fish_off.y = (Math.random()*200)+200;
		fish_on.x = fish_off.x;
		fish_on.y = fish_off.y;
		
		var to = Math.random()*1500+1000;
		createjs.Tween.get(this).to({x:to},80000).call(complete_fishes);
		createjs.Tween.get(fish_on).to({x:to},80000);
	}.context(fish_off);
	complete_fishes();
	
	var alpha_fish = function() {
		if(this.alpha == 0) {
			if(Math.random() > 0.5)
				createjs.Tween.get(this).to({alpha:1},800).call(alpha_fish);
			else
				createjs.Tween.get(this).to({alpha:0},Math.random() * 500 + 1000).call(alpha_fish);
		}
		else
			createjs.Tween.get(this).to({alpha:0},Math.random() * 3000 + 2000).call(alpha_fish);
	}.context(fish_on);
	alpha_fish();
	
	var ghost_data = {"images": [queue.getResult("ghost")], "frames": [[89, 2, 82, 122, 0, -13, -7], [2, 2, 83, 122, 0, -13, -7], [175, 2, 85, 121, 0, -10, -7], [264, 2, 88, 120, 0, -6, -8]], "animations": {"all": {"frames": [0, 1, 2, 3, 2, 1], "frequency": 4}}};
	var ghost = make_animated_sprite(ghost_data);
	ghost.scaleX = ghost.scaleY = 0.7;
	ghost.alpha = 0;
	
	this.layer_back.addChild(ghost);
	var complete_ghost = function() {
		if(this.alpha == 0) {
			if(Math.random() > 0.95) {
				this.x = Math.random() * 400 + 150;
				this.y = 500;
				
				createjs.Tween.get(this).to({y:300,x:this.x + 200,alpha:1},2200).call(function(){
					createjs.Tween.get(this).to({y:250,x:this.x + 60,alpha:0},500).call(complete_ghost);
				}.context(this));
			}
			else {
				createjs.Tween.get(this).to({alpha:0},5000).call(complete_ghost);
			}
		}
	}.context(ghost);
	complete_ghost();
	
	var shark_data = {"images": [queue.getResult("shark")], "frames": [[1033, 125, 340, 117, 0, -2, -4], [689, 125, 340, 118, 0, -2, -3], [345, 125, 340, 118, 0, -3, -3], [2, 125, 339, 118, 0, -3, -3], [1684, 2, 337, 118, 0, -4, -3], [1345, 2, 335, 118, 0, -5, -3], [1007, 2, 334, 118, 0, -6, -3], [671, 2, 332, 118, 0, -7, -3], [336, 2, 331, 119, 0, -8, -3], [2, 2, 330, 119, 0, -8, -3]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]}}};
	var shark = make_animated_sprite(shark_data);
	this.layer_back.addChild(shark);
	var complete_shark = function() {
		shark.x = (Math.random()*1200)-1700;
		shark.y = (Math.random()*200)+200;
		
		var to = Math.random()*1500+1000;
		createjs.Tween.get(this).to({x:to},80000).call(complete_shark);
	}.context(shark);
	complete_shark();
	
	this.layer_back.addChild(new Planktons(150,0,750,450));
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2_1")));
	rays.getChildAt(0).x = 360;
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2_2")));
	rays.getChildAt(1).x = 333;
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
	
	var layer2 = new createjs.Bitmap(queue.getResult("layer2_2"));
	this.layer_middle.addChild(layer2);
	
	this.layer_front.addChild(new createjs.Bitmap(queue.getResult("layer2_1")));
	
	/* Animations */
	
	data = {
		"images": [queue.getResult("aguaviva2"), queue.getResult("aguaviva2over")],
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
	
	var data = {"images": [queue.getResult("algas1_2")], "frames": [[760, 2, 141, 467, 0, -26, -20], [905, 2, 142, 467, 0, -25, -20], [1051, 2, 143, 467, 0, -25, -20], [611, 2, 145, 468, 0, -24, -20], [461, 2, 146, 468, 0, -24, -20], [309, 2, 148, 468, 0, -23, -20], [156, 2, 149, 469, 0, -22, -20], [2, 2, 150, 469, 0, -22, -20]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency":2}}};
	algas1_2 = make_animated_sprite(data);
	this.layer_middle.addChild(algas1_2);
	algas1_2.x = 600; algas1_2.y = 230;
	
	data = {"images": [queue.getResult("algas2_2")], "frames": [[105, 2, 98, 348, 0, -24, -16], [2, 2, 99, 348, 0, -24, -16], [207, 2, 100, 347, 0, -23, -17], [311, 2, 101, 346, 0, -23, -19], [416, 2, 102, 344, 0, -22, -20], [522, 2, 104, 343, 0, -21, -22], [630, 2, 106, 341, 0, -20, -23], [740, 2, 107, 341, 0, -19, -24]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}};
	algas2_2 = make_animated_sprite(data);
	this.layer_middle.addChild(algas2_2);
	algas2_2.x = -30; algas2_2.y = 230;
	
	data = {"images": [queue.getResult("algas3_2")], "frames": [[677, 2, 120, 632, 0, -28, -11], [801, 2, 121, 632, 0, -28, -11], [926, 2, 123, 632, 0, -27, -11], [547, 2, 126, 632, 0, -26, -11], [415, 2, 128, 633, 0, -26, -11], [280, 2, 131, 633, 0, -25, -11], [142, 2, 134, 633, 0, -24, -11], [2, 2, 136, 633, 0, -23, -11]], "animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], "frequency": 2}}};
	algas3_2 = make_animated_sprite(data);
	this.layer_middle.addChild(algas3_2);
	algas3_2.x = 120; algas3_2.y = 120;
	
	data = {
		"images": [queue.getResult("esponja1")],
		"frames": [[596, 2, 90, 338, 0, -34, -5], [1081, 2, 92, 338, 0, -32, -5], [984, 2, 93, 338, 0, -31, -5], [886, 2, 94, 338, 0, -30, -5], [788, 2, 94, 338, 0, -30, -5], [690, 2, 94, 338, 0, -30, -5], [1177, 2, 95, 338, 0, -29, -5], [497, 2, 95, 338, 0, -29, -5], [398, 2, 95, 338, 0, -29, -5], [299, 2, 95, 338, 0, -29, -5], [200, 2, 95, 338, 0, -29, -5], [101, 2, 95, 338, 0, -29, -5], [2, 2, 95, 338, 0, -29, -5]],
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]}}
	};
	esponja1 = make_animated_sprite(data);
	this.layer_middle.addChild(esponja1);
	esponja1.x = 180; esponja1.y = 400;
	
	data = {
		"images": [queue.getResult("esponja2")],
		"frames": [[962, 2, 156, 402, 0, -20, -15], [1762, 2, 156, 402, 0, -20, -15], [1602, 2, 156, 402, 0, -20, -15], [1442, 2, 156, 402, 0, -20, -15], [1282, 2, 156, 402, 0, -20, -15], [1122, 2, 156, 402, 0, -20, -15], [2, 408, 156, 402, 0, -20, -15], [802, 2, 156, 402, 0, -20, -15], [642, 2, 156, 402, 0, -20, -15], [482, 2, 156, 402, 0, -20, -15], [322, 2, 156, 402, 0, -20, -15], [162, 2, 156, 402, 0, -20, -15], [2, 2, 156, 402, 0, -20, -15]],
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]}}
	};
	esponja2 = make_animated_sprite(data);
	this.layer_middle.addChild(esponja2);
	esponja2.x = 560; esponja2.y = 400;
	
	data = {
		"images": [queue.getResult("esponja3")],
		"frames": [[596, 2, 93, 181, 0, -10, -13], [1083, 2, 93, 181, 0, -10, -13], [986, 2, 93, 181, 0, -10, -13], [889, 2, 93, 181, 0, -10, -13], [791, 2, 94, 181, 0, -10, -13], [693, 2, 94, 181, 0, -10, -13], [1180, 2, 95, 181, 0, -10, -13], [497, 2, 95, 181, 0, -10, -13], [398, 2, 95, 181, 0, -10, -13], [299, 2, 95, 181, 0, -10, -13], [200, 2, 95, 181, 0, -10, -13], [101, 2, 95, 181, 0, -10, -13], [2, 2, 95, 181, 0, -10, -13]],
		"animations": {"all": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12]}}
	}
	esponja3 = make_animated_sprite(data);
	this.layer_front.addChild(esponja3);
	esponja3.x = 500; esponja3.y = 515;

	this.addEventListener("destroy",this.ondestroy.context(this));
}
StageTwo.prototype.ondestroy = function() {
	this.sound.stop();
	Howler.music.splice(Howler.music.indexOf(this.sound),1);
}