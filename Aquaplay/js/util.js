var fn_b = createjs.BitmapAnimation.prototype._tick;
createjs.BitmapAnimation.prototype._tick = function() {
	if(createjs.Ticker.getPaused()) return;
	
	fn_b.context(this)();
};

var pixels_in_meters = 30;

Function.prototype.context = function(context)  {
  var action = this;
  return function() { return action.apply(context, arguments); };
}

Math.degToRad = function(rad) {
	return rad * Math.PI / 180.0;
};

Math.radToDeg = function(deg) {
	return deg * 180.0 / Math.PI;
}

var b2Vec2 = Box2D.Common.Math.b2Vec2
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
,	b2AABB = Box2D.Collision.b2AABB;

var Keyboard = function(){
	function Keyboard() {
		this.keys = {}
	}
	Keyboard.prototype = new createjs.Container();
	Keyboard.prototype.isDown = function(key) { return this.keys[key]; }
	return new Keyboard();
}(window);

document.onkeydown = function(event) {
	//if(keys[event.keyCode] && keys[event.keyCode].pressed) return;
	Keyboard.keys[event.keyCode] = true;
	Keyboard.dispatchEvent("keydown",event);
};
document.onkeyup = function(event) {
	//if(!keys[event.keyCode] || !keys[event.keyCode].pressed) return;
	//keys[event.keyCode] = {pressed:false,time:createjs.Ticker.getTime()};
	Keyboard.keys[event.keyCode] = false;
	Keyboard.dispatchEvent("keyup",event);
}

var make_animated_sprite = function(data) {
	var sprite = new createjs.BitmapAnimation(new createjs.SpriteSheet(data));
	sprite.gotoAndPlay("all");
	sprite.scaleX = sprite.scaleY = 0.88;
	return sprite;
}