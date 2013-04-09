function HowToPlay(stage, other, fn, simple) {
	this.initialize(stage, other, fn, simple);
}
HowToPlay.prototype = new ScreenBase();
HowToPlay.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
HowToPlay.prototype.initialize = function(stage, other, fn, simple) {
	this.ScreenBase_initialize(stage);
	
	seen_tutorial = true;
	
	console.log(simple);
	
	var bg = this.addChild(new createjs.Bitmap(queue.getResult("howtoplay_bg")));
	bg.x = 20;
	
	texts = [];
	
	var tut1 = new createjs.Container();
	var tut11 = tut1.addChild(new createjs.Bitmap(queue.getResult("tut11")));
	var tut12 = tut1.addChild(new createjs.Bitmap(queue.getResult("tut12")));
	tut12.alpha = 0;
	
	var tut2 = new createjs.Container();
	var tut21 = tut2.addChild(new createjs.Bitmap(queue.getResult("tut21")));
	var tut22 = tut2.addChild(new createjs.Bitmap(queue.getResult("tut22")));
	tut22.alpha = 0;
	
	/*var blink = function() {
		if(this.alpha == 0) {
			this.alpha = 1;
			createjs.Tween.get(this).to({alpha:1},600).call(blink.context(this));
		}
		if(this.alpha == 1) {
			this.alpha = 0;
			createjs.Tween.get(this).to({alpha:0},600).call(blink.context(this));
		}
	}*/
	
	var i = 0;
	var tick = function() {
		if(i == 10)
		{
			if(tut11.alpha == 1)
				tut11.alpha = 0;
			if(tut12.alpha == 0)
				tut12.alpha = 1;
				
			if(tut21.alpha == 1)
				tut21.alpha = 0;
			if(tut22.alpha == 0)
				tut22.alpha = 1;
		}
		i++;
		if(i >= 20)
		{
			if(tut11.alpha == 0)
				tut11.alpha = 1;
			if(tut12.alpha == 1)
				tut12.alpha = 0;
				
			if(tut21.alpha == 0)
				tut21.alpha = 1;
			if(tut22.alpha == 1)
				tut22.alpha = 0;
			i = 0;
		}
	};
	
	this.addEventListener("tick",tick);
	
	/*blink.context(tut11)();
	blink.context(tut12)();
	blink.context(tut21)();
	blink.context(tut22)();*/
	
	texts.push(tut1);
	texts[0].x = 90; texts[0].y = 135;
	
	if(!simple) {
	
		texts.push(tut2);
		texts[1].x = 90; texts[1].y = 135;
		texts.push(new createjs.Bitmap(queue.getResult("tut3")));
		texts[2].x = 100; texts[2].y = 135;
		texts.push(new createjs.Bitmap(queue.getResult("tut4")));
		texts[3].x = 100; texts[3].y = 165;
		
	}
	
	this.addChild(texts[0]);
	
	var right_arrow = this.addChild(new createjs.Bitmap(queue.getResult("howtoplay_arrow")));
	var left_arrow = this.addChild(right_arrow.clone());
	left_arrow.rotation = 180;
	
	right_arrow.x = 280;
	right_arrow.y = 430;
	
	left_arrow.x = 165;
	left_arrow.y = 430 + 35;
	
	var count = this.addChild(new createjs.Text("1 de "+texts.length,"30px Prelo-Black", "#fff"));
	count.textAlign = "center";
	count.x = 225;
	count.y = 430;
	
	var btn_play = this.addChild(new ButtonHelper("btn_play","btn_play_press"));
	btn_play.x = 90;
	btn_play.y = 460;
	btn_play.addEventListener("click",fn.context(this));
	
	this.sound = new Howl({
		urls:getSound("button"),
		group:"sound"
	});
	
	var current = 0;
	right_arrow.addEventListener("click",function(){
		this.removeChild(texts[current]);
		current++;
		if(current >= texts.length) current = 0;
		this.addChild(texts[current]);
		
		this.sound.play();
		
		count.text = (current+1) + " de " + texts.length;
	}.context(this));
	
	left_arrow.addEventListener("click",function(){
		this.removeChild(texts[current]);
		current--;
		if(current < 0) current = texts.length-1;
		this.addChild(texts[current]);
		
		this.sound.play();
		
		count.text = (current+1) + " de " + texts.length;
	}.context(this));
}
