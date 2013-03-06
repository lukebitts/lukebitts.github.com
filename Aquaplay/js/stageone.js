function StageOne(stage) {
	this.initialize(stage);
}

StageOne.prototype = new createjs.Container();
StageOne.prototype.Container_initialize = createjs.Container.prototype.initialize;
StageOne.prototype.initialize = function(stage) {
	this.Container_initialize();

	this.stage = stage;
	this.stage.enableMouseOver(1000);
	createjs.Touch.enable(this.stage);
	this.world = new b2World(new b2Vec2(0,3), true);
	this.destroy_list = [];
	
	this.stage.addChild(this);
	this._tick_callback = this.handleTick.context(this);
	createjs.Ticker.addEventListener("tick",this._tick_callback);
	
	var bg = new createjs.Bitmap(queue.getResult("sea_bottom"));
	this.addChild(bg);
	
	var whale = new createjs.Bitmap(queue.getResult("whale"));
	this.addChild(whale);
	var complete_whale = function() {
		whale.x = (Math.random()*1200)+1000;
		whale.y = (Math.random()*200)+200;
		createjs.Tween.get(this).to({x:-Math.random()*1500-1000},120000).call(complete_whale);
	}.context(whale);
	complete_whale();
	
	var fishes = new createjs.Bitmap(queue.getResult("fishes"));
	this.addChild(fishes);
	var complete_fishes = function() {
		fishes.x = (Math.random()*1200) - 1700;
		fishes.y = (Math.random()*200) + 200;
		createjs.Tween.get(this).to({x:Math.random()*1500+1000},40000).call(complete_fishes);
	}.context(fishes);
	complete_fishes();
	
	this.addChild(new Planktons(0,200,900,400));
	
	var rays = new createjs.Container();
	rays.addChild(new createjs.Bitmap(queue.getResult("ray1")));
	rays.getChildAt(0).x = 120;
	rays.getChildAt(0).y = 50;
	rays.getChildAt(0).alpha = 0;
	rays.addChild(new createjs.Bitmap(queue.getResult("ray2")));
	rays.getChildAt(1).x = 150;
	rays.getChildAt(1).y = 20;
	this.addChild(rays);
	
	var complete_ray = function() {
		if(this.alpha <= 0) {
			createjs.Tween.get(this).to({alpha:1},2000).call(complete_ray);
		} else {
			createjs.Tween.get(this).to({alpha:0},2000).call(complete_ray);
		}
	}
	complete_ray.context(rays.getChildAt(0))();
	complete_ray.context(rays.getChildAt(1))();
	
	this.handle_keyboard_ct = this.handle_keyboard.context(this);
	Keyboard.addEventListener("keydown",this.handle_keyboard_ct);
	Keyboard.addEventListener("keyup",this.handle_keyboard_ct);
	
	//todo: Remove debug information.
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("dcanvas").getContext("2d"));
	debugDraw.SetDrawScale(pixels_in_meters);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	this.world.SetDebugDraw(debugDraw);
	
	//Contact callback information
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = this.BeginContact.context(this);
	this.world.SetContactListener(listener);
	
	this.itens = new createjs.Container();
	this.obstacles = new createjs.Container();
	
	//Wall physic data
	this.obstacles.addChild(new Obstacle(this.world,150,384,10,768,0)); //Left wall
	this.obstacles.addChild(new Obstacle(this.world,750,384,10,768,0)); //Right wall
	this.obstacles.addChild(new Obstacle(this.world,450,-5,600,10,0));  //Top wall
	
	var layer2 = new createjs.Bitmap(queue.getResult("layer2"));
	this.addChild(layer2);
	layer2.y = 100;
	
	this.addChild(this.obstacles);
	
	this.addChild(new createjs.Bitmap(queue.getResult("layer1")));
	
	this.chestTopOpen = new createjs.Bitmap(queue.getResult("chesttop"));
	this.chestTopOpen.x = 450 - 186/2;
	this.chestTopOpen.y = 520 - 152;
	this.addChild(this.chestTopOpen);

	this.addChild(this.itens);
	
	this.chestTopClosed = new createjs.Bitmap(queue.getResult("chestclosed"));
	this.chestTopClosed.regX = 186/2;
	this.chestTopClosed.regY = 135;
	this.chestTopClosed.x = 450;
	this.chestTopClosed.y = 520;
	
	this.chestTarget = new ChestTarget(this.world,450,520,140,50);
	this.addChild(this.chestTarget);
	
	var btn_left = new createjs.Shape();
	btn_left.graphics.beginFill("lightgreen").drawCircle(0,0,60);
	btn_left.x = 80;
	btn_left.y = 560;
	btn_left.addEventListener("mousedown",function(evt){
		if(this.paused) return;
		this.bubble_jet_left.start();
		evt.addEventListener("mouseup",function(){
			this.bubble_jet_left.stop();
		}.context(this));
	}.context(this));
	this.addChild(btn_left);

	var btn_right = new createjs.Shape();
	btn_right.graphics.beginFill("lightgreen").drawCircle(0,0,60);
	btn_right.x = 820;
	btn_right.y = 560;
	btn_right.addEventListener("mousedown",function(evt){
		if(this.paused) return;
		this.bubble_jet_right.start();
		evt.addEventListener("mouseup",function(){
			this.bubble_jet_right.stop();
		}.context(this));
	}.context(this));
	this.addChild(btn_right);
	
	this.paused = false;
	this.time = 0; //Control variable for the creation of new coins/diamonds
	this.score = 0;
	this.score_text = new createjs.Text("0","30px Arial","black");
	this.score_text.x = 20;
	this.score_text.y = 50;
	this.addChild(this.score_text);
	
	var destroy_bubble_fn = function(b){
		this.world.DestroyBody(b.target.body.GetBody());
	}.context(this);
	
	this.bubble_jet_left = new BubbleJet(this.world,190,530,60,2);
	this.bubble_jet_left.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.addChild(this.bubble_jet_left);
	
	this.bubble_jet_right = new BubbleJet(this.world,710,510,60,-2);
	this.bubble_jet_right.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.addChild(this.bubble_jet_right);
}
StageOne.prototype.BeginContact = function(contact) {
	var made_point = false;
	//Whenever a coin hit the chestTarget we remove it from play
	if(contact.GetFixtureA().GetBody() == this.chestTarget.body.GetBody()) {
		this.itens.removeChild(contact.GetFixtureB().GetBody().GetUserData());
		this.destroy_list.push(contact.GetFixtureB().GetBody());
		
		this.score += contact.GetFixtureB().GetBody().GetUserData().points;
		this.score_text.text = this.score;
		
		made_point = true;
	}
	else if(contact.GetFixtureB().GetBody() == this.chestTarget.body.GetBody()) {
		this.itens.removeChild(contact.GetFixtureA().GetBody().GetUserData());
		this.destroy_list.push(contact.GetFixtureA().GetBody());
		
		this.score += contact.GetFixtureA().GetBody().GetUserData().points;
		this.score_text.text = this.score;
		
		made_point = true;
	}
	
	if(made_point && this.score >= 6) {
		//this.paused = true;
		this.set_pause(true);
		
		this.removeChild(this.chestTopOpen);
		this.removeChild(this.chestTarget);
		this.addChild(this.chestTopClosed);
		
		for(var item in this.itens.children) {
			var i = this.itens.children[item];

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
StageOne.prototype.handle_keyboard = function(evt) {
	if(this.paused) return;
	if(evt.type == "keydown") {
		if(evt.target.keyCode == 37) {
			if(this.bubble_jet_left.started == false)
				this.bubble_jet_left.start();
		}
		if(evt.target.keyCode == 39) {
			if(this.bubble_jet_right.started == false)
				this.bubble_jet_right.start();
		}
	}
	if(evt.type == "keyup") {
		if(evt.target.keyCode == 37)
			this.bubble_jet_left.stop();
		if(evt.target.keyCode == 39)
			this.bubble_jet_right.stop();
	}
}
StageOne.prototype.handleTick = function(evt) {
	//createjs.Ticker.setPaused(this.paused);
	
	if(!this.paused) {
		
		for(var d in this.destroy_list) {
			this.world.DestroyBody(this.destroy_list[d]);
		}

		this.time += 1 / evt.delta;
			
		if(this.time >= 2.0) {
			var type = "coin";
			if(Math.random() > 0.8) {
				type = "diamond";
			}
			
			var rnd = Math.random();
			if(rnd < 0.49) {
				this.itens.addChild(new FallingItem(this.world,Math.random() * 150 + 180, 0, type));
			}
			else if(rnd > 0.49 && rnd < 0.98){
				this.itens.addChild(new FallingItem(this.world,Math.random() * 150 + 560, 0, type));
			}
			else {
				this.itens.addChild(new FallingItem(this.world,Math.random() * 150 + 380, 0, type));
			}
			var it = this.itens.children[this.itens.getNumChildren()-1];
			
			var remove_item = function(){
				this.itens.removeChild(it);
				this.world.DestroyBody(it.body.GetBody());
				it.removeEventListener("destroy", remove_item);
			}.context(this);
			it.addEventListener("destroy",remove_item);
			
			this.time = 0;
		}
			
		this.world.Step(1/evt.delta,10,10);
		this.world.ClearForces();
	}
	
	this.world.DrawDebugData();
	this.stage.update(evt);
	
	frames++;
};
StageOne.prototype.set_pause = function(value) {
	this.paused = value;
	
	if(value) {
		this.bubble_jet_left.stop();
		this.bubble_jet_right.stop();
	}
}
StageOne.prototype.destroy = function() {
	this.stage.removeChild(this);
	createjs.Ticker.removeEventListener("tick",this._tick_callback);
	Keyboard.removeEventListener("keydown",this.handle_keyboard_ct);
	Keyboard.removeEventListener("keyup",this.handle_keyboard_ct);
};