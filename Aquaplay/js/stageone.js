function StageOne(stage) {
	this.initialize(stage);
}
StageOne.prototype = new StageBase();
StageOne.prototype.StageBase_initialize = StageBase.prototype.initialize;
StageOne.prototype.initialize = function(stage) {
	this.StageBase_initialize(stage);

	this._random_item_fn = function() {
		var rnd = Math.random();
		var screen_position = Math.random() * 150
		screen_position += (rnd < 0.49) ? 180 :
						   (rnd >= 0.49 && rnd < 0.98) ? 560 : 380;
		return {type:"coin",screen_position_x:screen_position};
	}.context(this);
	
	var bg = new createjs.Bitmap(queue.getResult("sea_bottom"));
	this.addChildAt(bg,0);
	
	var whale = new createjs.Bitmap(queue.getResult("whale"));
	this.addChildAt(whale,1);
	var complete_whale = function() {
		whale.x = (Math.random()*1200)+1000;
		whale.y = (Math.random()*200)+200;
		createjs.Tween.get(this).to({x:-Math.random()*1500-1000},120000).call(complete_whale);
	}.context(whale);
	complete_whale();
	
	var fishes = new createjs.Bitmap(queue.getResult("fishes"));
	this.addChildAt(fishes,2);
	var complete_fishes = function() {
		fishes.x = (Math.random()*1200) - 1700;
		fishes.y = (Math.random()*200) + 200;
		createjs.Tween.get(this).to({x:Math.random()*1500+1000},40000).call(complete_fishes);
	}.context(fishes);
	complete_fishes();
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray1")));
	rays.getChildAt(0).x = 120;
	rays.getChildAt(0).y = 50;
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2")));
	rays.getChildAt(1).x = 150;
	rays.getChildAt(1).y = 20;
	this.addChildAt(rays,3);
	
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
	this.addChildAt(layer2,4);
	layer2.y = 100;
	
	this.addChildAt(new createjs.Bitmap(queue.getResult("layer1")),6);
	
	this.chestTopOpen = new createjs.Bitmap(queue.getResult("chesttop"));
	this.chestTopOpen.x = 450 - 186/2;
	this.chestTopOpen.y = 520 - 152;
	this.addChildAt(this.chestTopOpen,4);
	
	this.chestTopClosed = new createjs.Bitmap(queue.getResult("chestclosed"));
	this.chestTopClosed.regX = 186/2;
	this.chestTopClosed.regY = 135;
	this.chestTopClosed.x = 450;
	this.chestTopClosed.y = 520;
	
	this.chestTarget = new ChestTarget(this._world,450,520,140,50);
	this.addChild(this.chestTarget);
	
	this.addEventListener("contact",this.contact.context(this));
}
StageOne.prototype.contact = function(contact) {
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
	
	if(made_point && this._score >= 10) {
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
		
		createjs.Tween.get(this.chestTopClosed).to({scaleX:1.46,scaleY:0.4},200).call(function(){
			createjs.Tween.get(this.chestTopClosed).to({scaleX:1,scaleY:1},200).call(function(){
				new EndStagePopup(this.stage, this);
			}.context(this));
		}.context(this));
	}
}