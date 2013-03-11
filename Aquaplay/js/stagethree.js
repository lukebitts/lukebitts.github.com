function StageThree(stage) {
	this.initialize(stage);
}
StageThree.prototype = new StageBase();
StageThree.prototype.StageBase_initialize = StageBase.prototype.initialize;
StageThree.prototype.initialize = function(stage) {
	this.StageBase_initialize(stage);
	
	this._random_item_fn = function() {
		var rnd = Math.random();
		var screen_position = Math.random() * 150
		screen_position += (rnd < 0.49) ? 180 :
						   (rnd >= 0.49 && rnd < 0.98) ? 560 : 380;
		return {type:(Math.random() < 0.8) ? "coin" : (rnd >= 0.98) ? "coin" : "diamond",screen_position_x:screen_position};
	}.context(this);
	
	var bg = new createjs.Bitmap(queue.getResult("layer3_3"));
	this.addChildAt(bg,0);
	
	var mermaid = new createjs.Bitmap(queue.getResult("mermaid"));
	this.addChildAt(mermaid,1);
	var complete_mermaid = function() {
		mermaid.x = (Math.random()*400 - 800);
		mermaid.y = (Math.random()*200 + 200);
		createjs.Tween.get(this).to({x:-Math.random() * 800 + 2000},21000).call(complete_mermaid);
	}.context(mermaid);
	complete_mermaid();
	
	this.addChildAt(new Planktons(150,0,750,450),2);
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray3_1")));
	//rays.getChildAt(0).x = 360;
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray3_2")));
	//rays.getChildAt(1).x = 280;
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
	
	var layer2 = new createjs.Bitmap(queue.getResult("layer3_2"));
	this.addChildAt(layer2,4);
	
	this.addChildAt(new createjs.Bitmap(queue.getResult("layer3_1")),6);
	
	var chest_new_pos = -80;
	
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
	
	this.chest_obstacle_top = null;
	
	this.chestTarget = new ChestTarget(this._world,450,520 - chest_new_pos,100,50,
	[
		[385,510 - chest_new_pos,10,90,-3.9],
		[515,510 - chest_new_pos,10,90,3.9],
		[450,520 - chest_new_pos+30,120,10,0]
	]);
	this.chestTarget.scaleX = this.chestTarget.scaleY = 0.8;
	this.addChild(this.chestTarget);

	this.addEventListener("contact",this.contact.context(this));
	
	var chest_close_fn = function() {
		if(Math.random() > 0.35) {
			close_chest.context(this)();
			createjs.Tween.get(this).to({},Math.random() * 2000 + 1000).call(open_chest.context(this));
		}
		createjs.Tween.get(this).to({},4000).call(chest_close_fn);
	}.context(this);
	chest_close_fn();
	
	this.create_gui();
}
function close_chest() {
	this.removeChild(this.chestTopOpen);
	this.removeChild(this.chestTarget);
	this.addChild(this.chestTopClosed);
	
	createjs.Tween.get(this.chestTopClosed).to({scaleX:1.46*0.8,scaleY:0.4*0.8},200).call(function(){
		createjs.Tween.get(this.chestTopClosed).to({scaleX:0.8,scaleY:0.8},200).call(function(){
			
		}.context(this));
	}.context(this));
	
	this.chest_obstacle_top = new Obstacle(this._world, 450, 505, 120, 20, 0, 0.8);
}
function open_chest() {
	this.addChildAt(this.chestTopOpen,5);
	this.addChild(this.chestTarget);
	this.removeChild(this.chestTopClosed);
	
	this._world.DestroyBody(this.chest_obstacle_top.body.GetBody());
}
StageThree.prototype.contact = function(contact) {
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
	
	if(made_point && this._score >= 50) {
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
				new EndStagePopup(this.stage, this, MainMenu);
			}.context(this));
		}.context(this));
	}
}