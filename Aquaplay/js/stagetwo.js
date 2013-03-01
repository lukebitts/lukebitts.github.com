function StageTwo(stage) {
	this.stage = stage;
	this.world = new b2World(new b2Vec2(0,3), true);
	this.destroy_list = [];
	
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
	this.bubbles = new createjs.Container();
	
	this.addChild(this.itens);
	this.addChild(this.obstacles);
	this.addChild(this.bubbles);
	
	//Wall physic data
	this.obstacles.addChild(new Obstacle(this.world,150,384,10,768,0)); //Left wall
	this.obstacles.addChild(new Obstacle(this.world,750,384,10,768,0)); //Right wall
	this.obstacles.addChild(new Obstacle(this.world,450,-5,600,10,0));//Top wall
	
	//Treasure chest physics data
	this.obstacles.addChild(new Obstacle(this.world,375,400,10,100,0));
	this.obstacles.addChild(new Obstacle(this.world,525,400,10,100,0));
	this.obstacles.addChild(new Obstacle(this.world,450,450,160,10,0));
	
	this.chestTarget = new ChestTarget(this.world,450,420,140,50);
	this.addChild(this.chestTarget);
	
	this.stage.addChild(this);
	this._tick_callback = this.tick.context(this);
	createjs.Ticker.addEventListener("tick",this._tick_callback);
	
	this.time = 0; //Control variable for the creation of new coins/diamonds
	this.interval_left = 0;
	this.interval_right = 0;
	this.score = 0;
	this.score_text = new createjs.Text("0","30px Arial","black");
	this.score_text.x = 20;
	this.score_text.y = 50;
	this.addChild(this.score_text);
}
StageTwo.prototype = new createjs.Container();
StageTwo.prototype.BeginContact = function(contact) {
	//Whenever a coin hit the chestTarget we remove it from play
	if(contact.GetFixtureA().GetBody() == this.chestTarget.body.GetBody()) {
		this.itens.removeChild(contact.GetFixtureB().GetBody().GetUserData());
		this.destroy_list.push(contact.GetFixtureB().GetBody());
		
		this.score += contact.GetFixtureB().GetBody().GetUserData().points;
		this.score_text.text = this.score;
	}
}
StageTwo.prototype.tick = function(evt) {
	for(var d in this.destroy_list) {
		this.world.DestroyBody(this.destroy_list[d]);
	}

	for(var child in this.itens.children)
		this.itens.children[child].tick(evt);

	for(var bubble in this.bubbles.children) {
		var b = this.bubbles.children[bubble];
		b.tick(evt);
		
		if(b.time <= 0) {
			this.bubbles.removeChild(b);
			this.world.DestroyBody(b.body.GetBody());
		}
	}
	if(keys[37] && keys[37].pressed) { //left
		var t = (createjs.Ticker.getTime() - keys[37].time) / 1000;
		if(t > this.interval_left) {
			if(this.interval_left < 3)
				this.interval_left += 0.01 + t/15 ;
			else
				this.interval_left += 0.2;
			this.bubbles.addChild(BubbleWithForce(this.world,180,620,60,2));
			this.bubbles.addChild(BubbleWithForce(this.world,180,620,60,2));
		}
	}
	else {
		this.interval_left = 0;
	}
	
	if(keys[39] && keys[39].pressed) { //right
		var t = (createjs.Ticker.getTime() - keys[39].time) / 1000;
		if(t > this.interval_right) {
			if(this.interval_right < 3)
				this.interval_right += 0.01 + t/15;
			else
				this.interval_right += 0.2;
			this.bubbles.addChild(BubbleWithForce(this.world,720,620,60,-2));
			this.bubbles.addChild(BubbleWithForce(this.world,720,620,60,-2));
		}
	}
	else {
		this.interval_right = 0;
	}
	
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

	this.world.Step(1/createjs.Ticker.getMeasuredFPS(),10,10);
	this.world.ClearForces();
	this.world.DrawDebugData();
	this.stage.update();
};
StageTwo.prototype.destroy = function() {
	this.stage.removeChild(this);
	createjs.Ticker.removeEventListener("tick",this._tick_callback);
};