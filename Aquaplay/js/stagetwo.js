function StageTwo(stage) {
	this.initialize(stage);
}
StageTwo.prototype = new StageBase();
StageTwo.prototype.StageBase_initialize = StageBase.prototype.initialize;
StageTwo.prototype.initialize = function(stage) {
	this.StageBase_initialize(stage);
	
	this._random_item_fn = function() {
		var rnd = Math.random();
		var screen_position = Math.random() * 150
		screen_position += (rnd < 0.49) ? 180 :
						   (rnd >= 0.49 && rnd < 0.98) ? 560 : 380;
		return {type:(Math.random() < 0.8) ? "coin" : "diamond",screen_position_x:screen_position};
	}.context(this);
	
	var bg = new createjs.Bitmap(queue.getResult("sea_bottom_ship"));
	this.addChildAt(bg,0);
	
	var fish_off = new createjs.Bitmap(queue.getResult("fish_off"));
	var fish_on = new createjs.Bitmap(queue.getResult("fish_on"));
	this.addChildAt(fish_on,1);
	this.addChildAt(fish_off,1);
	
	var complete_fishes = function() {
		fish_off.x = (Math.random()*1200)-1700;
		fish_off.y = (Math.random()*200)+200;
		fish_on.x = fish_off.x;
		fish_on.y = fish_off.y;
		
		var to = Math.random()*1500+1000;
		var to = 900;
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
	
	var ghost = new createjs.Bitmap(queue.getResult("ghost"));
	ghost.alpha = 0;
	
	this.addChildAt(ghost,3);
	var complete_ghost = function() {
		if(this.alpha == 0) {
			if(Math.random() > 0.95) {
				this.x = Math.random() * 400 + 150;
				this.y = 500;
				
				createjs.Tween.get(this).to({y:200,x:this.x + 200,alpha:1},2200).call(function(){
					createjs.Tween.get(this).to({y:190,x:this.x + 10,alpha:0},100).call(complete_ghost);
				}.context(this));
			}
			else {
				createjs.Tween.get(this).to({alpha:0},5000).call(complete_ghost);
			}
		}
	}.context(ghost);
	complete_ghost();
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2_1")));
	rays.getChildAt(0).x = 360;
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2_2")));
	rays.getChildAt(1).x = 280;
	this.addChildAt(rays,4);
	
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
	this.addChildAt(layer2,5);
	
	this.addChildAt(new createjs.Bitmap(queue.getResult("layer2_1")),7);
	
	var chest_new_pos = 140;
	
	this.chestTopOpen = new createjs.Bitmap(queue.getResult("chesttop"));
	this.chestTopOpen.x = 468 - 186/2;
	this.chestTopOpen.y = 550 - 152 - chest_new_pos;
	this.chestTopOpen.scaleX = this.chestTopOpen.scaleY = 0.8;
	this.addChildAt(this.chestTopOpen,5);
	
	this.chestTopClosed = new createjs.Bitmap(queue.getResult("chestclosed"));
	this.chestTopClosed.regX = 186/2;
	this.chestTopClosed.regY = 135;
	this.chestTopClosed.scaleX = this.chestTopClosed.scaleY = 0.8;
	this.chestTopClosed.x = 450;
	this.chestTopClosed.y = 520 - chest_new_pos;
	
	this.chestTarget = new ChestTarget(this._world,450,520 - chest_new_pos,100,50,
	[
		[385,510 - chest_new_pos,10,90,-3.9],
		[515,510 - chest_new_pos,10,90,3.9],
		[450,520 - chest_new_pos+30,120,10,0]
	]);
	this.chestTarget.scaleX = this.chestTarget.scaleY = 0.8;
	this.addChild(this.chestTarget);

	
	this.addEventListener("contact",this.contact.context(this));
}
StageTwo.prototype.contact = function(contact) {
	contact = contact.target;
	var made_point = false;

	if(contact.GetFixtureA().GetBody() == this.chestTarget.body.GetBody()) {
		this._itens.removeChild(contact.GetFixtureB().GetBody().GetUserData());
		this._destroy_list.push(contact.GetFixtureB().GetBody());
		
		this._score += contact.GetFixtureB().GetBody().GetUserData().points;
		this._score_text.text = this._score;
		
		made_point = true;
	}
	else if(contact.GetFixtureB().GetBody() == this.chestTarget.body.GetBody()) {
		this._itens.removeChild(contact.GetFixtureA().GetBody().GetUserData());
		this._destroy_list.push(contact.GetFixtureA().GetBody());
		
		this._score += contact.GetFixtureA().GetBody().GetUserData().points;
		this._score_text.text = this._score;
		
		made_point = true;
	}
	
	if(made_point && this._score >= 100) {
		this.set_pause(true);
		
		this.removeChild(this.chestTopOpen);
		this.removeChild(this.chestTarget);
		this.addChild(this.chestTopClosed);
		
		for(var item in this._itens.children) {
			var i = this._itens.children[item];

			createjs.Tween.get(i.icon).to({alpha:0},100);
			createjs.Tween.get(i.glow1).to({y:(i.glow1.y + 200)},1400);
			createjs.Tween.get(i.glow2).to({y:(i.glow2.y + 200)},1400);
			createjs.Tween.get(i).to({alpha:0},1400);
		}
		
		createjs.Tween.get(this.chestTopClosed).to({scaleX:1.46*0.8,scaleY:0.4*0.8},200).call(function(){
			createjs.Tween.get(this.chestTopClosed).to({scaleX:0.8,scaleY:0.8},200).call(function(){
				new EndStagePopup(this.stage, this);
			}.context(this));
		}.context(this));
	}
}