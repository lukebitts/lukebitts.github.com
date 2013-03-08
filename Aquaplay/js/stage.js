function StageBase(stage) {
	if(!stage) return;
	this.initialize(stage);
}
StageBase.prototype = new ScreenBase();
StageBase.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
StageBase.prototype.initialize = function(stage) {
	this.ScreenBase_initialize(stage);

	this._handle_key_context = this.handle_keyboard.context(this);
	Keyboard.addEventListener("keydown", this._handle_key_context);
	Keyboard.addEventListener("keyup", this._handle_key_context);
	
	this._world = new b2World(new b2Vec2(0,3), true);
	this._destroy_list = [];
	
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = this.begin_contact.context(this);
	this._world.SetContactListener(listener);
	
	/*** DEBUG INFORMATION ***/
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("dcanvas").getContext("2d"));
	debugDraw.SetDrawScale(pixels_in_meters);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	this._world.SetDebugDraw(debugDraw);
	/***/
	
	this._itens = new createjs.Container();
	this.addChild(this._itens);
	this._random_item_fn = null;
	
	/*** Bubble Jets ***/
	var destroy_bubble_fn = function(bubble) {
		this._world.DestroyBody(bubble.target.body.GetBody());
	}.context(this);
	
	this._left_jet = new BubbleJet(this._world,190,530,60,2);
	this._left_jet.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.addChild(this._left_jet);
	
	this._right_jet = new BubbleJet(this._world,710,510,60,-2);
	this._right_jet.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.addChild(this._right_jet);
	
	this.addChild(new JetController(this._left_jet,this,80,560));
	this.addChild(new JetController(this._right_jet,this,820,560));
	
	/*** Obstacles ***/
	this.addChild(new Obstacle(this._world,150,384,10,768,0)); //Left wall
	this.addChild(new Obstacle(this._world,750,384,10,768,0)); //Right wall
	this.addChild(new Obstacle(this._world,450,-5,600,10,0));  //Top wall
	
	/*** Extra data ***/
	this._paused = false;
	this._time = 0;
	this._score = 0;
	this._score_text = new createjs.Text("0","60px Arial", "#000");
	this._score_text.x = 40;
	this._score_text.y = 40;
	this.addChild(this._score_text);
}
StageBase.prototype.set_pause = function(state) {
	this._paused = state;
	
	if(!state) {
		this._left_jet.stop();
		this._right_jet.stop();
	}
}
StageBase.prototype.handle_tick = function(evt) {
	if(this.is_paused()) return;
	
	for(var d in this._destroy_list) {
		this._world.DestroyBody(this._destroy_list[d]);
	}
	this._destroy_list = [];
	
	this._time += 1 / evt.params[0].delta;
	if(this._time >= 2.0) {
	
		if(this._random_item_fn) {
			var r = this._random_item_fn();

			var type = r.type;
			var screen_position_x = r.screen_position_x;
			
			var item = new FallingItem(this._world, screen_position_x, 0, type);
			
			var remove_item = function(){
				this._itens.removeChild(item);
				this._world.DestroyBody(item.body.GetBody());
				item.removeEventListener("destroy", remove_item);
			}.context(this);
			item.addEventListener("destroy",remove_item);
			
			this._itens.addChild(item);
		}
		
		this._time = 0;
	}
	
	this._world.Step(1/evt.params[0].delta,10,10);
	this._world.ClearForces();
	
	this._world.DrawDebugData();
}
StageBase.prototype.begin_contact = function(contact) {
	if(this.is_paused()) return;
	
	this.dispatchEvent("contact",contact);
}
StageBase.prototype.handle_keyboard = function(evt) {
	if(this.is_paused()) return;
	
	if(evt.type == "keydown") {
		if(evt.target.keyCode == 37) {
			if(this._left_jet.started == false)
				this._left_jet.start();
		}
		if(evt.target.keyCode == 39) {
			if(this._right_jet.started == false)
				this._right_jet.start();
		}
	}
	if(evt.type == "keyup") {
		if(evt.target.keyCode == 37)
			this._left_jet.stop();
		if(evt.target.keyCode == 39)
			this._right_jet.stop();
	}
}
StageBase.prototype.destroy = function() {
	this.stage.removeChild(this);
	Keyboard.removeEventListener("keydown", this._handle_key_context);
	Keyboard.removeEventListener("keyup", this._handle_key_context);
}