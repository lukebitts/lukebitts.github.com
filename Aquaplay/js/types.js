function FallingItem(world, x, y) {
	this.points = 1;
	this.x = x || 0;
	this.y = y || 0;
	this.graphics = new createjs.Graphics();
	this.graphics.beginFill("blue").drawCircle(0,0,15);
	
	var fix_def = new b2FixtureDef;
	fix_def.density = 1.5;
	fix_def.friction = 0.5;
	fix_def.restitution = 0.2;
	fix_def.shape = new b2CircleShape(15/pixels_in_meters);
	fix_def.filter.categoryBits = 2;
	
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_dynamicBody;
	body_def.position.x = this.x / pixels_in_meters;
	body_def.position.y = this.y / pixels_in_meters;
	body_def.userData = this;
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
}
FallingItem.prototype = new createjs.Shape();
FallingItem.prototype.tick = function() {
	this.x = this.body.GetBody().GetPosition().x * pixels_in_meters;
	this.y = this.body.GetBody().GetPosition().y * pixels_in_meters;
	
	if(this.y >= 748)
		this.dispatchEvent("destroy");
}

function Obstacle(world, x, y, w, h, angle) {
	this.x = x;
	this.y = y;
	this.graphics = new createjs.Graphics();
	this.graphics.beginFill("red").drawRect(-w/2,-h/2, w, h);
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
Obstacle.prototype = new createjs.Shape();

var normalizr = function(minInput, maxInput, minOutput, maxOutput) {
    var diffInput = maxInput - minInput;
    var diffOutput = maxOutput - minOutput;
    return function(x) {   
        return maxOutput - (diffOutput / diffInput) * (x - minInput);
    };
};

function Bubble(world,x,y) {
	this.world = world;
	this.x = x || 0;
	this.y = y || 0;
	
	this.graphics = new createjs.Graphics();
	this.alpha = 0.5;
	
	var fix_def = new b2FixtureDef;
	var size = (Math.random()*10+5);
	fix_def.shape = new b2CircleShape(size/pixels_in_meters);
	fix_def.density = normalizr(5,15,4,30)(size);
	fix_def.filter.categoryBits = 4;
	fix_def.filter.maskBits = 2;
	
	this.graphics.beginFill("rgba(0,140,255,100)").drawCircle(0,0,size);
			
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_dynamicBody;
	body_def.position = new b2Vec2(x/pixels_in_meters,(y+1)/pixels_in_meters);
	body_def.userData = this;
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
	this.time = size/20;
}
Bubble.prototype = new createjs.Shape();
Bubble.prototype.tick = function(e) {
	this.time -= 1 / e.delta;
	
	this.x = this.body.GetBody().GetPosition().x * pixels_in_meters;
	this.y = this.body.GetBody().GetPosition().y * pixels_in_meters;
};
function BubbleWithForce(world, x, y, blast_power, dir) {
	var center = new b2Vec2(x/pixels_in_meters,y/pixels_in_meters);

	var bubble = new Bubble(world,x,y);
	bubble.body.GetBody().ApplyImpulse(new b2Vec2(Math.random()*16*dir,-1 * blast_power), center);
	return bubble;
}

function ChestTarget(world,x,y,w,h) {
	this.x = x;
	this.y = y;
	this.graphics = new createjs.Graphics();
	this.graphics.beginFill("green").drawRect(-w/2,-h/2, w, h);
	
	var fix_def = new b2FixtureDef;
	fix_def.shape = new b2PolygonShape;
	fix_def.shape.SetAsBox(w / 2 / pixels_in_meters, h / 2 / pixels_in_meters);
	fix_def.isSensor = true;
	
	var body_def = new b2BodyDef;
	body_def.type = b2Body.b2_staticBody;
	body_def.position.x = this.x / pixels_in_meters ;
	body_def.position.y = this.y / pixels_in_meters ;
	body_def.userData = this;
	
	this.body = world.CreateBody(body_def).CreateFixture(fix_def);
}
ChestTarget.prototype = new createjs.Shape();

function BubbleJet(world,x,y,blast_power,dir) {
	console.log(this);
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
}
BubbleJet.prototype = new createjs.Container();
BubbleJet.prototype.tick = function(evt) {	
	for(var bubble in this.bubbles.children) {
		var b = this.bubbles.children[bubble];
		b.tick(evt);
		
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
		this.bubbles.addChild(BubbleWithForce(this.world,this.x_,this.y_,this.blast_power,this.dir));
	}
}
BubbleJet.prototype.start = function() {
	this.started = true;
	this.time = createjs.Ticker.getTime();
}
BubbleJet.prototype.stop = function() {
	this.started = false;
	this.interval = 0;
}

