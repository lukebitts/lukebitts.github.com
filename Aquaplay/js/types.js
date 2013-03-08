function Glow(n) {
	this.initialize(n)
}
Glow.prototype = new createjs.Bitmap();
Glow.prototype.Bitmap_initialize = createjs.Bitmap.prototype.initialize;
Glow.prototype.initialize = function(n) {
	this.Bitmap_initialize(queue.getResult("glow"));
	this.regX = this.regY = 29/2;
	this.alpha = n;
	
	var tween_end = (function() {
		if(this.alpha <= 0) {
			this.x = Math.random() * 29 - 29/2;
			this.y = Math.random() * 29 - 29/2;
			this.scaleX = this.scaleY = Math.random() * 0.5 + 0.5;
			createjs.Tween.get(this).to({alpha:1},400).call(tween_end);
		}
		else
			createjs.Tween.get(this).to({alpha:0},400).call(tween_end);
	}.context(this));
	
	tween_end();
}
function FallingItem(world, x, y, type) {
	this.initialize(world, x, y, type);
}
FallingItem.prototype = new createjs.Container();
FallingItem.prototype.Container_initialize = createjs.Container.prototype.initialize;
FallingItem.prototype.initialize = function(world, x, y, type) {
	this.Container_initialize();
	
	this.x = x;
	this.y = y;
	this.points = type == "coin" ? 1 : 5;
	this.should_rotate = (type != "coin");
	
	var icon = new createjs.Bitmap(type == "coin" ? queue.getResult("coin") : queue.getResult("diamond"));
	icon.regX = 39 / 2;
	icon.regY = (type == "coin" ? 38 : 32) / 2;
	this.icon = icon;
	this.addChild(this.icon);
	
	this.glow1 = new Glow(0);
	this.glow2 = new Glow(1);
	
	this.addChild(this.glow1);
	this.addChild(this.glow2);
	
	var fix_def = new b2FixtureDef;
	fix_def.density = 1.5;
	fix_def.friction = 0.5;
	fix_def.restitution = 0.2;
	if(type == "coin")
		fix_def.shape = new b2CircleShape(18/pixels_in_meters);
	else {
		fix_def.shape = new b2PolygonShape();
		fix_def.shape.SetAsArray([
			new b2Vec2(-39/2/pixels_in_meters,-32/2/pixels_in_meters),
			new b2Vec2(39/2/pixels_in_meters,-32/2/pixels_in_meters),
			new b2Vec2(0,39/2/pixels_in_meters,-32/2/pixels_in_meters)],3);
	}
	fix_def.filter.categoryBits = 2;
	
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_dynamicBody;
	body_def.position.x = this.x / pixels_in_meters;
	body_def.position.y = this.y / pixels_in_meters;
	body_def.userData = this;
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
	
	this.addEventListener("tick",this.handleTick.context(this));
}
FallingItem.prototype.handleTick = function(evt) {
	this.x = this.body.GetBody().GetPosition().x * pixels_in_meters;
	this.y = this.body.GetBody().GetPosition().y * pixels_in_meters;
	if(this.should_rotate) this.icon.rotation = Math.radToDeg(this.body.GetBody().GetAngle());
	
	if(this.y >= 748)
		this.dispatchEvent("destroy");
}

function Obstacle(world, x, y, w, h, angle) {
	this.initialize(world, x, y, w, h, angle);
}
Obstacle.prototype = new createjs.Shape();
Obstacle.prototype.Shape_initialize = createjs.Shape.prototype.initialize;
Obstacle.prototype.initialize = function(world, x, y, w, h, angle) {
	this.Shape_initialize();
	
	this.x = x;
	this.y = y;
	this.graphics = new createjs.Graphics();
	this.graphics.beginFill("black").drawRect(-w/2,-h/2, w, h);
	this.rotation = angle;
	
	var fix_def = new b2FixtureDef;
	fix_def.shape = new b2PolygonShape;
	fix_def.shape.SetAsBox(w / 2 / pixels_in_meters, h / 2 / pixels_in_meters);
	fix_def.filter.categoryBits = 2;
	
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_staticBody;
	body_def.position.x = this.x / pixels_in_meters ;
	body_def.position.y = this.y / pixels_in_meters ;
	body_def.bullet = true;
	body_def.angle = Math.degToRad(angle);
	body_def.userData = this;
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
}

function normalizr(minInput, maxInput, minOutput, maxOutput) {
    var diffInput = maxInput - minInput;
    var diffOutput = maxOutput - minOutput;
    return function(x) {   
        return maxOutput - (diffOutput / diffInput) * (x - minInput);
    };
};

function Bubble(world,x,y) {
	this.initialize(world, x, y);
}
Bubble.prototype = new createjs.Bitmap();
Bubble.prototype.Bitmap_initialize = createjs.Bitmap.prototype.initialize;
Bubble.prototype.initialize = function(world, x, y) {
	this.Bitmap_initialize(queue.getResult("bubble"));

	this.world = world;
	this.x = x || 0;
	this.y = y || 0;
	this.regX = 39/2;
	this.regY = 39/2;
	
	//this.alpha = 0.5;
	
	var fix_def = new b2FixtureDef;
	var size = (Math.random()*10+5);
	fix_def.shape = new b2CircleShape(size/pixels_in_meters);
	fix_def.density = normalizr(5,15,4,30)(size);
	fix_def.filter.categoryBits = 4;
	fix_def.filter.maskBits = 2;
	
	var ss = ((size-5)*10)/100;
	this.scaleX = this.scaleY = size/(39/2);
			
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_dynamicBody;
	body_def.position = new b2Vec2(x/pixels_in_meters,(y+1)/pixels_in_meters);
	body_def.userData = this;
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
	this.time = (size/20)*35;
	
	//createjs.Tween.get(this).to({time:0},this.time * 1000);
	
	this.addEventListener("tick", this.handleTick.context(this));
}
Bubble.prototype.handleTick = function(evt) {
	this.x = this.body.GetBody().GetPosition().x * pixels_in_meters;
	this.y = this.body.GetBody().GetPosition().y * pixels_in_meters;
	
	this.time--;
};

function ChestTarget(world,x,y,w,h,scale) {
	this.initialize(world, x, y, w, h, scale);
}
ChestTarget.prototype = new createjs.Container();
ChestTarget.prototype.Container_initialize = createjs.Container.prototype.initialize;
ChestTarget.prototype.initialize = function(world, x, y, w, h, types) {
	this.Container_initialize();
	
	types = types || [
		[370,y-20,10,100,-3.9],
		[530,y-20,10,100,3.9],
		[450,y+30,160,10,0]
	]
	
	this.x = x;
	this.y = y;
	
	//this.scaleX = this.scaleY = scale || 1;
	
	var fix_def = new b2FixtureDef;
	fix_def.shape = new b2PolygonShape;
	fix_def.shape.SetAsBox(w / 2 / pixels_in_meters, h / 2 / pixels_in_meters);
	fix_def.isSensor = true;
	
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_staticBody;
	body_def.position.x = this.x / pixels_in_meters;
	body_def.position.y = this.y / pixels_in_meters;
	body_def.userData = this;
	
	var chest_icon = new createjs.Bitmap(queue.getResult("chest"));
	chest_icon.regX = 186/2;
	chest_icon.regY = 70;
	this.addChild(chest_icon);
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
	
	this.addChild(new Obstacle(world,types[0][0],types[0][1],types[0][2],types[0][3],types[0][4]));
	this.addChild(new Obstacle(world,types[1][0],types[1][1],types[1][2],types[1][3],types[1][4]));
	this.addChild(new Obstacle(world,types[2][0],types[2][1],types[2][2],types[2][3],types[2][4]));
}

function BubbleJet(world,x,y,blast_power,dir) {
	this.initialize(world, x, y, blast_power, dir);
}
BubbleJet.prototype = new createjs.Container();
BubbleJet.prototype.Container_initialize = createjs.Container.prototype.initialize;
BubbleJet.prototype.initialize = function(world,x,y,blast_power,dir) {
	this.Container_initialize();
	
	this.bubbles = new createjs.Container();
	this.addChild(this.bubbles);
	
	this.world = world;
	this.x_ = x;
	this.y_ = y;
	this.blast_power = blast_power;
	this.dir = dir;
	this.started = false;
	this.interval = 0;
	this.time = 0;
	
	this.addEventListener("tick",this.handleTick.context(this));
}
BubbleJet.prototype.handleTick = function(evt) {
	for(var bubble in this.bubbles.children) {
		var b = this.bubbles.children[bubble];
		if(b.time <= 0) {
			this.bubbles.removeChild(b);
			this.dispatchEvent("DestroyBubble",b);
		}
	}

	if(!this.started) return;
	var t = (createjs.Ticker.getTime() - this.time) / 1000;
	if(t > this.interval) {
		if(this.interval < 3)
			this.interval += 0.01 + t/15 ;
		else
			this.interval += 0.2;
		this.bubbles.addChild(this._bubble_with_force(this.world,this.x_,this.y_,this.blast_power,this.dir));
	}
}
BubbleJet.prototype._bubble_with_force = function(world, x, y, blast_power, dir) {
	var center = new b2Vec2(x/pixels_in_meters,y/pixels_in_meters);

	var bubble = new Bubble(world,x,y);
	bubble.body.GetBody().ApplyImpulse(new b2Vec2(Math.random()*16*dir,-1 * blast_power), center);
	return bubble;
}
BubbleJet.prototype.start = function() {
	this.started = true;
	this.time = createjs.Ticker.getTime();
}
BubbleJet.prototype.stop = function() {
	this.started = false;
	this.interval = 0;
}

function JetController(jet,scene,x,y) {
	this.initialize(jet,scene,x,y);
}
JetController.prototype = new createjs.Container();
JetController.prototype.Container_initialize = createjs.Container.prototype.initialize;
JetController.prototype.initialize = function(jet,scene,x,y) {
	this.Container_initialize();
	
	this.x = x;
	this.y = y;
	this._jet = jet;
	this._scene = scene;
	
	this.addChild(new createjs.Shape());
	this.children[0].graphics.beginFill("lightgreen").drawCircle(0,0,60);
	
	this.addEventListener("mousedown",function(evt) {
		if(this._scene.is_paused()) return;
		this._jet.start();
		evt.addEventListener("mouseup",function(){
			this._jet.stop();
		}.context(this));
	}.context(this));
}


function Planktons(x,y,w,h) {
	this.initialize(x,y,w,h);
}
Planktons.prototype = new createjs.Container();
Planktons.prototype.Container_initialize = createjs.Container.prototype.initialize;
Planktons.prototype.initialize = function(x,y,w,h) {
	this.Container_initialize();
	
	var s1 = new createjs.Shape();
	s1.graphics.beginFill("white").drawCircle(0,0,1);
	
	this.cont1 = new createjs.Container();
	this.cont2 = new createjs.Container();
	this.cont3 = new createjs.Container();
	
	this.addChild(this.cont1);
	this.addChild(this.cont2);
	this.addChild(this.cont3);
	
	for(var i = 0; i < 200; ++i) {
		var s = s1.clone();
		s.x = Math.random() * w;
		s.y = Math.random() * h;
		s.alpha = Math.random() * 0.5 + 0.2;
		this.cont1.addChild(s);
	}
	
	for(var i = 0; i < 200; ++i) {
		var s = s1.clone();
		s.x = Math.random() * w;
		s.y = Math.random() * h;
		s.alpha = Math.random() * 0.5 + 0.2;
		this.cont2.addChild(s);
	}
	this.cont2.alpha = 0.5;
	this.cont2.y = -300;
	
	for(var i = 0; i < 200; ++i) {
		var s = s1.clone();
		s.x = Math.random() * w;
		s.y = Math.random() * h;
		s.alpha = Math.random() * 0.5;
		this.cont3.addChild(s);
	}
	this.cont3.alpha = 0.5;
	
	var cont_end = function() {
		if(this.alpha <= 0.2) {
			createjs.Tween.get(this).to({alpha:0.8},1000).call(cont_end.context(this))
		}
		else {
			createjs.Tween.get(this).to({alpha:0.2},1000).call(cont_end.context(this))
		}
	}
	cont_end.context(this.cont1)();
	cont_end.context(this.cont2)();
	cont_end.context(this.cont3)();
	
	var mask = new createjs.Shape();
	mask.graphics.beginFill("black").drawRect(x,y,w,h);
	
	this.cont1.mask = mask;
	this.cont2.mask = mask;
	this.cont3.mask = mask;
	
	this.height = h;
	
	this.addEventListener("tick",this.handleTick.context(this));
	
	this.frame = 0;
}
Planktons.prototype.handleTick = function(evt) {
	this.cont1.y += 0.5;
	this.cont2.y += 0.5;
	
	this.cont1.x = Math.sin(Math.degToRad(this.frame))*15;
	this.cont2.x = Math.cos(Math.degToRad(this.frame))*15;
	this.cont3.x = Math.cos(Math.degToRad(this.frame))*15;
	
	if(this.cont1.y >= this.height)
		this.cont1.y = -this.height;
	if(this.cont2.y >= this.height)
		this.cont2.y = -this.height;
		
	this.frame += 0.001;
}
