function StageOne(stage) {
	this.stage = stage;
	this.stage.enableMouseOver(1000);
	this.world = new b2World(new b2Vec2(0,3), true);
	this.destroy_list = [];
	
	this.stage.addChild(this);
	this._tick_callback = this.tick.context(this);
	createjs.Ticker.addEventListener("tick",this._tick_callback);
	
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
	
	this.addChild(this.itens);
	this.addChild(this.obstacles);
	
	//Wall physic data
	this.obstacles.addChild(new Obstacle(this.world,150,384,10,768,0)); //Left wall
	this.obstacles.addChild(new Obstacle(this.world,750,384,10,768,0)); //Right wall
	this.obstacles.addChild(new Obstacle(this.world,450,-5,600,10,0));  //Top wall
	
	//Treasure chest physics data
	this.obstacles.addChild(new Obstacle(this.world,375,500,10,100,0));
	this.obstacles.addChild(new Obstacle(this.world,525,500,10,100,0));
	this.obstacles.addChild(new Obstacle(this.world,450,550,160,10,0));
	
	this.chestTarget = new ChestTarget(this.world,450,520,140,50);
	this.addChild(this.chestTarget);
	
	var btn_left = new createjs.Shape();
	btn_left.graphics.beginFill("lightgreen").drawCircle(0,0,60);
	btn_left.x = 80;
	btn_left.y = 560;
	btn_left.addEventListener("mousedown",function(){
		this.bubble_jet_left.start();
	}.context(this));
	this.addChild(btn_left);

	var btn_right = new createjs.Shape();
	btn_right.graphics.beginFill("lightgreen").drawCircle(0,0,60);
	btn_right.x = 820;
	btn_right.y = 560;
	btn_right.addEventListener("mousedown",function(){
		this.bubble_jet_right.start();
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
	
	this.bubble_jet_left = new BubbleJet(this.world,180,620,60,2);
	this.bubble_jet_left.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.addChild(this.bubble_jet_left);
	
	this.bubble_jet_right = new BubbleJet(this.world,720,620,60,-2);
	this.bubble_jet_right.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.addChild(this.bubble_jet_right);
}
StageOne.prototype = new createjs.Container();
StageOne.prototype.BeginContact = function(contact) {
	//Whenever a coin hit the chestTarget we remove it from play
	if(contact.GetFixtureA().GetBody() == this.chestTarget.body.GetBody()) {
		this.itens.removeChild(contact.GetFixtureB().GetBody().GetUserData());
		this.destroy_list.push(contact.GetFixtureB().GetBody());
		
		this.score += contact.GetFixtureB().GetBody().GetUserData().points;
		this.score_text.text = this.score;
		
		/*if(this.score >= 10) {
			this.paused = true;
			new EndStagePopup(this.stage,this);
		}*/
	}
}
StageOne.prototype.handle_keyboard = function(evt) {
	console.log(evt);
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
StageOne.prototype.tick = function(evt) {
	createjs.Ticker.setPaused(this.paused);
	
	if(!this.paused) {

		for(var d in this.destroy_list) {
			this.world.DestroyBody(this.destroy_list[d]);
		}

		for(var child in this.itens.children)
			this.itens.children[child].tick(evt);
		
		this.bubble_jet_left.tick(evt);
		this.bubble_jet_right.tick(evt);

		this.time += 1 / evt.delta;
			
		if(this.time >= 2.0) {
			var rnd = Math.random();
			if(rnd < 0.45) {
				this.itens.addChild(new FallingItem(this.world,Math.random() * 150 + 180, 0));
			}
			else if(rnd > 0.45 && rnd < 0.9){
				this.itens.addChild(new FallingItem(this.world,Math.random() * 150 + 560, 0));
			}
			else {
				this.itens.addChild(new FallingItem(this.world,Math.random() * 150 + 380, 0));
			}
			var it = this.itens.children[this.itens.getNumChildren()-1];
			
			var remove_item = function(){
				this.itens.removeChild(it);
				this.world.DestroyBody(it.body.GetBody());
				it.removeEventListener("destroy", remove_item);
			}.context(this);
			
			it.addEventListener("destroy",remove_item);
			if(Math.random() > 0.8) {
				it.graphics.beginFill("red").drawCircle(0,0,15);
				it.points = 2;
			}
			this.time = 0;
		}
			
		this.world.Step(1/30,10,10);
		this.world.ClearForces();
	
	}
	
	this.world.DrawDebugData();
	this.stage.update();
};
StageOne.prototype.destroy = function() {
	this.stage.removeChild(this);
	createjs.Ticker.removeEventListener("tick",this._tick_callback);
	Keyboard.removeEventListener("keydown",this.handle_keyboard_ct);
	Keyboard.removeEventListener("keyup",this.handle_keyboard_ct);
};