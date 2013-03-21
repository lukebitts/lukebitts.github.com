function HowToPlay(stage, other, fn) {
	this.initialize(stage, other, fn);
}
HowToPlay.prototype = new ScreenBase();
HowToPlay.prototype.ScreenBase_initialize = ScreenBase.prototype.initialize;
HowToPlay.prototype.initialize = function(stage, other, fn) {
	this.ScreenBase_initialize(stage);
	
	var bg = this.addChild(new createjs.Bitmap(queue.getResult("howtoplay_bg")));
	bg.x = 20;
	
	texts = [];
	
	texts.push(new createjs.Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra consectetur turpis sed tempor. Phasellus et adipiscing metus. Integer interdum est eu mi sodales vel posuere tortor suscipit. Suspendisse potenti. Aliquam at lorem metus, sit amet gravida diam.", "23px Prelo-Black", "#fff"));
	texts[0].textAlign = "center";
	texts[0].lineWidth = 300;
	texts[0].x = 230;
	texts[0].y = 160;
	texts[0].shadow = new createjs.Shadow("#000",5,5,5);
	
	texts.push(texts[0].clone());
	texts[1].text = "Texto 2";
	
	texts.push(texts[0].clone());
	texts[2].text = "Texto 3";
	
	this.addChild(texts[0]);
	
	var right_arrow = this.addChild(new createjs.Bitmap(queue.getResult("howtoplay_arrow")));
	var left_arrow = this.addChild(right_arrow.clone());
	left_arrow.rotation = 180;
	
	right_arrow.x = 280;
	right_arrow.y = 430;
	
	left_arrow.x = 165;
	left_arrow.y = 430 + 35;
	
	var count = this.addChild(new createjs.Text("1 de "+texts.length,"43px Alice", "#fff"));
	count.textAlign = "center";
	count.x = 225;
	count.y = 430;
	
	var btn_play = this.addChild(new ButtonHelper("btn_play","btn_play_press"));
	btn_play.x = 90;
	btn_play.y = 460;
	btn_play.addEventListener("click",fn.context(this));
	
	var current = 0;
	right_arrow.addEventListener("click",function(){
		this.removeChild(texts[current]);
		current++;
		if(current >= texts.length) current = 0;
		this.addChild(texts[current]);
		
		count.text = (current+1) + " de " + texts.length;
	}.context(this));
	
	left_arrow.addEventListener("click",function(){
		this.removeChild(texts[current]);
		current--;
		if(current < 0) current = texts.length-1;
		this.addChild(texts[current]);
		
		count.text = (current+1) + " de " + texts.length;
	}.context(this));
}
