var current_stage = 0;

function StageBase(stage, chest, closing_chest, max_score) {
	if(!stage) return;
	this.initialize(stage, chest, closing_chest, max_score);
}
StageBase.prototype = new ScreenBase();
StageBase.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
StageBase.prototype.World_initialize = function() {
	this._world = new b2World(new b2Vec2(0,3), true);
	
	return this._world;
}
StageBase.prototype.initialize = function(stage, chest, closing_chest, max_score) {
	this.ScreenBase_initialize(stage);
	
	current_stage++;

	this._handle_key_context = this.handle_keyboard.context(this);
	Keyboard.addEventListener("keydown", this._handle_key_context);
	Keyboard.addEventListener("keyup", this._handle_key_context);
	
	this._destroy_list = [];
	this._call_later = [];
	
	this._max_score = max_score;
	
	this.layer_back = new createjs.Container();
	this.layer_middle = new createjs.Container();
	this.layer_front = new createjs.Container();
	this.layer_hud = new createjs.Container();
	
	this.addChild(this.layer_back);
	this.addChild(this.layer_middle);
	this.addChild(this.layer_front);
	this.addChild(this.layer_hud);
	
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
	this.layer_front.addChild(this._itens);
	this._random_item_fn = null;
	
	this.win_sound = new Howl({
		urls:[queue.getResult("win_soundmp3").src]
	});
	
	/*** Bubble Jets ***/
	var destroy_bubble_fn = function(bubble) {
		this._world.DestroyBody(bubble.target.body.GetBody());
	}.context(this);
	
	this._left_jet = new BubbleJet(this._world,190,530,60,2);
	this._left_jet.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.layer_hud.addChild(this._left_jet);
	
	this._right_jet = new BubbleJet(this._world,710,510,60,-2);
	this._right_jet.addEventListener("DestroyBubble",destroy_bubble_fn);
	this.layer_hud.addChild(this._right_jet);
	
	/*** Obstacles ***/
	this.layer_back.addChild(new Obstacle(this._world,150,384,10,768,0)); //Left wall
	this.layer_back.addChild(new Obstacle(this._world,750,384,10,768,0)); //Right wall
	this.layer_back.addChild(new Obstacle(this._world,450,-5,600,10,0));  //Top wall
	
	/*** Extra data ***/
	this._paused = false;
	this._time = 0;
	this._score = 0;
	this._score_text = new createjs.Text("0","bold 50px Arial", "#000");
	this._score_text.textAlign = "center";
	this._score_text.x = 155/2;
	this._score_text.y = 60;
	
	this.layer_hud.addChild(new createjs.Bitmap(queue.getResult("planks")));
	
	var j1 = new JetController(this._left_jet,this,80,560);
	var j2 = new JetController(this._right_jet,this,820,560);
	
	this.layer_hud.addChild(j1);
	this.layer_hud.addChild(j2);
	
	var dispatch1 = function(e) {
		j1.dispatchEvent(e.type,e.target);
	};
	var dispatch2 = function(e) {
		j2.dispatchEvent(e.type,e.target);
	};
	
	this._left_jet.addEventListener("jetstarted",dispatch1);
	this._left_jet.addEventListener("jetstoped",dispatch1);
	
	this._right_jet.addEventListener("jetstarted",dispatch2);
	this._right_jet.addEventListener("jetstoped",dispatch2);
	
	var bgscore = new createjs.Bitmap(queue.getResult("bgscore"));
	bgscore.y = 30;
	this.layer_hud.addChild(bgscore);
	
	this.layer_hud.addChild(this._score_text);
	
	var score_glow = new createjs.Bitmap(queue.getResult("score_text_glow"));
	score_glow.x = 30;
	score_glow.y = 75;
	this.layer_hud.addChild(score_glow);
	
	var pause_btn = new createjs.Bitmap(queue.getResult("btn_pause"));
	pause_btn.x = 7;
	pause_btn.y = 7;
	var pause_btn_press = new createjs.Bitmap(queue.getResult("btn_pause_press"));
	pause_btn_press.alpha = 0;
	
	var pause_container = new createjs.Container();
	pause_container.addChild(pause_btn);
	pause_container.addChild(pause_btn_press);
	this.layer_hud.addChild(pause_container);
	
	pause_container.x = 50;
	pause_container.y = 125;
	
	var pause_overlay = new createjs.Shape();
	pause_overlay.graphics.beginFill("black").drawRect(0,0,900,675);
	pause_overlay.alpha = 0.8;
	
	pause_container.addEventListener("click",function(){
		if(this.is_paused() && createjs.Ticker.getPaused()) {
			pause_btn_press.alpha = 0;
			pause_btn.alpha = 100;
			
			this.layer_hud.removeChild(pause_overlay);
			
			this.set_pause(false);
			createjs.Ticker.setPaused(false);
		}
		else if(this.is_paused() && !createjs.Ticker.getPaused()) {
			return;
		}
		else {
			pause_btn.alpha = 0;
			pause_btn_press.alpha = 100;
			
			this.layer_hud.addChild(pause_overlay);
			
			this.set_pause(true);
			createjs.Ticker.setPaused(true);
		}
		this.layer_hud.removeChild(pause_container);
		this.layer_hud.addChild(pause_container);
	}.context(this));
	
	window.onblur = function() {
		if(!this.is_paused()) pause_container.dispatchEvent("click",null);
		nn = false;
	}.context(this);
	
	this.chestTarget = chest;
	//chest.close();
	chest.open();
	
	this.layer_front.addChildAt(this.chestTarget.back,0);
	this.layer_hud.addChild(this.chestTarget.front);

	this.addEventListener("contact",this.contact.context(this));
	this.addEventListener("destroy",this.ondestroy.context(this));
}
StageBase.prototype.set_pause = function(state) {
	this._paused = state;
	
	if(state) {
		this._left_jet.stop();
		this._right_jet.stop();
	}
}
var nn = false;
StageBase.prototype.handle_tick = function(evt) {
	for(var c in this._call_later) {
		this._call_later[c]();
	}
	this._call_later = [];
	if(!this.is_paused()) {
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
		
		this._world.Step(1/evt.params[0].delta,1,1);
		this._world.ClearForces();
		
		this._world.DrawDebugData();
	}
	else {
		this._world.Step(0,1,1);
		this._world.ClearForces();
		
		this._world.DrawDebugData();
	}
}
StageBase.prototype.begin_contact = function(contact) {
	if(this.is_paused()) return;
	
	this.dispatchEvent("contact",contact);
}
StageBase.prototype.contact = function(contact) {
	contact = contact.target;
	var made_point = false;

	if(contact.GetFixtureA().GetBody() == this.chestTarget.body.GetBody()) {
		this._itens.removeChild(contact.GetFixtureB().GetBody().GetUserData());
		this._destroy_list.push(contact.GetFixtureB().GetBody());
		
		this._score += contact.GetFixtureB().GetBody().GetUserData().points;
		contact.GetFixtureB().GetBody().GetUserData().sound.play();
		this._score_text.text = this._score;
		
		made_point = true;
	}
	else if(contact.GetFixtureB().GetBody() == this.chestTarget.body.GetBody()) {
		this._itens.removeChild(contact.GetFixtureA().GetBody().GetUserData());
		this._destroy_list.push(contact.GetFixtureA().GetBody());
		
		this._score += contact.GetFixtureA().GetBody().GetUserData().points;
		contact.GetFixtureA().GetBody().GetUserData().sound.play();
		this._score_text.text = this._score;
		
		made_point = true;
	}

	if(made_point && this._score >= this._max_score) {
		this.set_pause(true);
		
		for(var item in this._itens.children) {
			var i = this._itens.children[item];

			createjs.Tween.get(i.icon).to({alpha:0},100);
			createjs.Tween.get(i.glow1).to({y:(i.glow1.y + 200)},1400);
			createjs.Tween.get(i.glow2).to({y:(i.glow2.y + 200)},1400);
			createjs.Tween.get(i).to({alpha:0},1400);
		}
		
		//this.chestTarget.close();
		this._call_later.push(this.chestTarget.close.context(this.chestTarget));
		
		var stages = [StageOne, StageTwo, StageThree];
		
		new EndStagePopup(this.stage, this, stages[current_stage % 3]);
	}
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
StageBase.prototype.ondestroy = function() {
	Keyboard.removeEventListener("keydown", this._handle_key_context);
	Keyboard.removeEventListener("keyup", this._handle_key_context);
}