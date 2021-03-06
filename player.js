player = {
	x:36,
	y:364,
	vx:0,
	vy:0,
	vvy:0,
	falling:false,
	jumping:false,
	interacting:false,
	scene:0,
	choose:0,
	flip:false,
	color:[0, 0, 0],

	update:function(){
		player.draw();
		player.move();
		if(player.interacting){
			player.interact(player.scene);
		}
		player.animate();
	},

	draw:function(){
		if(player.spr){
			if(player.flip){
				push();
				scale(-1.0, 1.0);
				image(player.spr, -VIEWWIDTH / 2 - TILEWIDTH, player.y);
				pop();
			} else {
				image(player.spr, VIEWWIDTH / 2, player.y);
			}
		} else {
			fill(player.color);
			rect(VIEWWIDTH / 2, player.y, TILEWIDTH, TILEHEIGHT);	 
		}
	},

	control:function(){
		if(!player.interacting){
			if(keyA){
				player.vx = -4;
			} else if(keyD){
				player.vx = 4;
			} else {
				player.vx = 0;
			}

			if(keyW && !player.jumping && !player.falling){
				player.vvy -= 12;
				player.jumping = true;
			}

			if(keyG && !player.jumping && !player.falling){
				console.log(events[0].length);
				for(var i = 0; i < events.length; i++){
					if(collide(player.x, player.y, TILEWIDTH, TILEHEIGHT, events[i].x, events[i].y, TILEHEIGHT, TILEWIDTH)){
						player.scene = levels.intro[i];
						player.interacting = true;
						keyG = false;
					}
				}
			}
		}
	},

	move:function(){
		player.vx = 0;
		player.vvy += 0.6;

		player.control();

		player.x += player.vx;
		player.y += player.vy;
		player.vy = constrain(player.vvy, -16, 16);

		fx = snap(player.x, TILEWIDTH);
		fy = snap(player.y, TILEHEIGHT);

		nx = player.x % TILEWIDTH;
		ny = player.y % TILEHEIGHT; 

		centertile = ccell(fx, fy);
		righttile = ccell(fx + 1, fy);
		downtile = ccell(fx, fy + 1);
		diagonaltile = ccell(fx + 1, fy + 1);

		if (player.vy > 0) {
			if ((downtile && !centertile) || (diagonaltile && !righttile && nx)) {
				player.y = grid(fy, TILEHEIGHT);       
				player.vy = 0;
				player.vvy = 0;  
				player.falling = false;
				player.jumping = false;            
				ny = 0; 
			}
		} else if (player.vy < 0) {
			if ((centertile && !downtile ) || (righttile && !diagonaltile && nx)) {
				player.y = grid(fy + 1, TILEHEIGHT);
				player.vy = 0;
				player.vvy = 0;
				centertile = downtile;
				righttile = diagonaltile;
				ny = 0;
			}
		}

		if (player.vx > 0) {
			if ((righttile && !centertile) || (diagonaltile  && !downtile  && ny)) {
				player.x = grid(fx, TILEWIDTH);
				player.vx = 0;
			}
		} else if (player.vx < 0) {
			if ((centertile     && !righttile) || (downtile  && !diagonaltile && ny)) {
				player.x = grid(fx + 1, TILEWIDTH);
				player.vx = 0;
			}
		}

		player.falling = ! (downtile || (nx && diagonaltile));

	},

	animate:function(){
		tickCount++;
		if(player.jumping || player.falling){
			if(keyA){
				player.flip = true;
			} else if(keyD) {
				player.flip = false;
			}
			player.spr = jump;
		} else if(keyA){
			if(tickCount > tpf){
				current++;
				tickCount = 0;
				if(current > 11){
					current = 0;
				}
			}
			player.flip = true;
			player.spr = wSpr[current];
		} else if(keyD){
			if(tickCount > tpf){
				current++;
				tickCount = 0;
				if(current > 11){
					current = 0;
				}
			}
			player.flip = false;
			player.spr = wSpr[current];
		} else {
			player.spr = stand;
			current = 0;	
		}
	},

	interact:function(scene){
		var j;
		image(scroll, 10, 375);
		push();
		translate(30, 400);
		fill(0);
		text(scene.text, 0, 0);
		for(var i = 0; i < scene.choices.length; i++){
			var x = i * 15;
			if(player.choose == i){
				fill(255);
			} else {
				fill(0);
			}
			text(scene.choices[i], 0, 20 + x);
		}
		if(keyW){
			player.choose -= 1;
			keyW = false;
		} else if(keyS){
			player.choose += 1;
			keyS = false;
		}
		player.choose = constrain(player.choose, 0, scene.choices.length - 1);
		if(keyG){
			if(scene.events[player.choose] == "end"){
				player.interacting = false;
			} else if(scene.events[player.choose] == "to"){
				if(!j){
					j = 0;
				}
				player.scene = levels.intro[j + 1];
			}
			keyG = false;
		}
		pop();
	}	
}
