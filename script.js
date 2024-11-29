let p1;
let s;
let stk;
let minoList = [];
let numList = [];
let weapon = 1;
let level = 1;
let prestige = 0;
let wW = window.screen.width
let wH = window.screen.height - 85
let levelMap = {
  1: [
    [50, 50, 20, 1, 2], [wW, 50, 20, 1, 3], [50, wH, 20, 1, 2], [wW, wH, 20, 1, 3]
  ],
  2: [
    [50, wH/2, 21, 1, 2], [wW/2, 50, 21, 1, 5], [wW, wH/2, 21, 1, 3], [wW/2, wH, 21, 1, 2], [wW/2, wH/2, 25, 2, 3]
  ],
  3: [
    [50, 50, 25, 2, 2], [wW/2, 50, 25, 2, 3], [50, wH, 25, 2, 2], [wW/2, wH, 25, 2, 3], [wW/2, wH/2, 5, 2, 5]
  ],
  4: [
    [50, 50, 28, 2, 2], [wW, 50, 28, 2, 5], [50, wH, 28, 2, 3], [wW, wH, 28, 2, 5]
  ],
  5: [
    [wW/2, wH/2, 55, 5, 20]
  ],
  6: [
    [50, 50, 32, 2, 5], [wW, 50, 32, 3, 5], [50, wH, 32, 2, 2], [wW, wH, 32, 2, 3], [50, wH/2, 32, 1, 1], [wW/2, 50, 32, 1, 1], [wW, wH/2, 36, 1, 1], [wW/2, wH, 32, 1, 2]
  ],
  7: [
    [50, 50, 40, 5, 5], [wW, 50, 38, 3, 5], [50, wH, 38, 2, 5], [wW, wH, 40, 3, 5], [50, wH/2, 38, 1, 1], [wW/2, 50, 40, 3, 3], [wW, wH/2, 38, 3, 2], [wW/2, wH, 42, 2, 5]
  ],
  8: [
    [45, 20, 75, 3, 5], [wW-30, wH/2, 75, 3, 5], [45, wH-30, 75, 4, 5], [55, wH-130, 80, 2, 5], [10, wH/2, 80,2,5]
  ],
  9: [
    [0,0,10,2,5],[100,10,20,2,5],[200,20,10,2,5],[75,30,30,2,5],[40,75,40,2,3],[3,350,50,2,2],[60,60,65,2,2],[350,260,85,2,3],[80,80,100,2,10]
  ],
  10: [
    [wW/2-180, wH/2, 235, 5, 20], [wW/2+180, wH/2, 235, 5, 20]
  ]
}
let swordList = {
  1: {
    name: "Dagger",
    dam: 5,
    cost: 1
  },
  2: {
    name: "Broadsword (25 Coins)",
    dam: 7,
    cost: 25
  },
  3: {
    name: "Iron Blade (30 Coins)",
    dam: 10,
    cost: 30
  },
  4: {
    name: "Nightwon Blade (40 Coins)",
    dam: 15,
    cost: 40
  },
  5: {
    name: "Burstbane Blade (60 Coins)",
    dam: 17,
    cost: 60
  },
  6: {
    name: "Kruel Katana (100 Coins)",
    dam: 20,
    cost: 100
  },
  7: {
    name: "Gold Hero Longblade (200 Coins)",
    dam: 25,
    cost: 200
  },
  8: {
    name: "Charred Greatsword (400 Coins)",
    dam: 32,
    cost: 400
  },
  9: {
    name: "Mournelotte Cutlass (1000 Coins)",
    dam: 75,
    cost: 1000
  },
  10: {
    name: "Eldritch Death Dancer (10000 Coins)",
    dam: 555,
    cost: 10000
  },
  11: {
    name: "All Swords Acquired",
  }
}
let hit = 0;
let coins = 0;
let atktimer = 0;
let space = false;  
let kb = false;
let leveling = false;
let leveltext;
let key = false;
let flashing = 0;
let deathtimer = 0;
let next = document.getElementById("next")
let money = document.getElementById("money")
let health = document.getElementById("health")
let bar = document.getElementById("bar")
bar.style.display = "none"

function startGame(){
  document.getElementById("bef").style.display = "none"
  bar.style.display = "table"
  terrain.start();
  p1 = new player(64, 72, terrain.canvas.width/2, terrain.canvas.height/2);
  s = new sword();
  stk = new dam();
  newMinos()
}

function levelText(){
  if(level == 10){
    level = 0
    healthgained = Math.round(40*(1+(0.1*level))*(1+(0.2*prestige)))
    numList.push(new number(p1, `${healthgained}`, "green"))
    p1.health += healthgained
    prestige++
  }
  healthgained = Math.round(5*(1+(0.2*level))*(1+(0.4*prestige)))
  numList.push(new number(p1, `${healthgained}`, "green"))
  p1.health += healthgained
  updateBar()
  setTimeout(function(){
    level++
    newMinos()
  }, 1250)
}

function newMinos(){
  for(let i = 0; i<levelMap[level].length; i++){
    minoList.push(new mino(levelMap[level][i][0], levelMap[level][i][1], Math.round(levelMap[level][i][2]*(prestige+1)), Math.round(levelMap[level][i][3]*(prestige+0.7)), Math.round(levelMap[level][i][4]*(1+prestige))))
  }
  
  leveling = false;
}

function buyNext() {
  if(weapon == 10){ return; }
  if(coins >= swordList[weapon+1].cost){
    coins -= swordList[weapon+1].cost
    weapon++
    s.width += 14
    s.height += 14
    stk.width = s.width
    stk.height = s.height
    updateBar()
  }
}

function buyHeal(){
  if(health <= 0){ return; }
  if(coins >= 10){
    coins -= 10
    numList.push(new number(p1, "5", "green"))
    p1.health += 5
    updateBar()
  }
}

let terrain = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = wW
    this.canvas.height = wH
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas)
    this.interval = setInterval(updateterrain, 12);
    terrain.key = new Map()
    window.addEventListener('keydown', function (e) {
      if(e.keyCode == 32){
        key = true
        if(!space){
          space = true
          atk()
        }
        return;
      }else if(e.keyCode == 81){
        buyNext()
        return;
      }else if(e.keyCode == 69){
        buyHeal()
        return;
      }
      terrain.key.set(e.keyCode, true)
    })
    window.addEventListener('keyup', function (e) {
      if(e.keyCode == 32){
        key = false
        space = false
        return;
      }
      terrain.key.delete(e.keyCode)
    })
    window.addEventListener('click', function (e) {
      atk()
    })
  }, 
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function player(width, height, x, y) {
  this.terrain = terrain;
  this.width = width;
  this.height = height;
  this.health = 100;
  this.speedX = 0;
  this.speedY = 0;
  this.dir = 270
  this.image = new Image()
  this.image.src = "lenkup.png"
  this.x = x;
  this.y = y;
  this.x2 = x+width;
  this.y2 = y+height;
  this.update = function() {
    ctx = terrain.context;
    ctx.save()
    if(hit != 0){
      if(flashing <= 12){
        flashing++
      }else if(flashing > 12 && flashing < 24){
        flashing++
        ctx.globalAlpha = 0.6
      }else if(flashing >= 24){
        flashing = 0
      }
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore()
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x > wW-64){
      this.x = wW-74
    }else if(this.x < 0){
      this.x = 5
    }
    if(this.y > wH-64){
      this.y = wH-74
    }else if(this.y < 0){
      this.y = 5
    }
    this.x2 = this.x+this.width
    this.y2 = this.y+this.height
  }
}

function sword(){
  this.terrain = terrain;
  this.width = 48
  this.height = 54
  this.x = 0
  this.y = 0
  this.image = new Image()
  this.image.src = "sword1.png"
  this.update = function() {
    ctx = terrain.context
    ctx.save();
    if(p1.dir == 0){
      this.x = p1.x+p1.width+20
      this.y = p1.y+p1.height/2
    }else if(p1.dir == 90){
      this.x = p1.x+p1.width/2
      this.y = p1.y+p1.height+20
    }else if(p1.dir == 180){
      this.x = p1.x-20
      this.y = p1.y+p1.height/2
    }else if(p1.dir == 270){
      this.x = p1.x+p1.width/2
      this.y = p1.y-20
    }
    ctx.translate(this.x, this.y);
    ctx.rotate((Math.PI*p1.dir)/180)
    ctx.drawImage(this.image, this.width/-2, this.height/-2, this.width, this.height)
    ctx.restore();
  }
}

function dam(){
  this.terrain = terrain;
  this.width = s.width;
  this.height = s.height;
  this.x = s.x;
  this.y = s.y;
  this.image = new Image()
  this.image.src = "atk.png"
  this.update = function(){
    ctx = terrain.context
    ctx.save();
    if(p1.dir == 0){
      this.x = p1.x+p1.width+55
      this.y = p1.y+p1.height/2
    }else if(p1.dir == 90){
      this.x = p1.x+p1.width/2
      this.y = p1.y+p1.height+55
    }else if(p1.dir == 180){
      this.x = p1.x-55
      this.y = p1.y+p1.height/2
    }else if(p1.dir == 270){
      this.x = p1.x+p1.width/2
      this.y = p1.y-55
    }
    ctx.translate(this.x, this.y);
    if(p1.dir == 270 || p1.dir == 90){
      ctx.rotate((Math.PI*(360-p1.dir))/180)
    }else{
      ctx.rotate((Math.PI*(180-p1.dir))/180)
    }
    ctx.drawImage(this.image, this.width/-2, this.height/-2, this.width, this.height)
    ctx.restore();
  }
}

function number(target, n, color){
  this.terrain = terrain;
  this.size = 40
  this.number = n
  this.x = target.x;
  this.y = target.y;
  this.color = color
  this.newPos = function() {
    this.size -= 0.8
    this.x += 1
    this.y -= 1
  }
  this.update = function(){
    ctx = terrain.context
    ctx.fillStyle = this.color
    ctx.font = `${this.size}px Comic Sans MS`
    ctx.fillText(`${this.number}`, this.x, this.y)
  }
}

function mino(x, y, hp, damage, coins){
  this.terrain = terrain;
  this.width = 64;
  this.height = 72;
  this.x = x;
  this.y = y;
  this.dirX = 0
  this.dirY = 0
  this.drops = coins
  this.jukeDelay = 0
  this.delayDelay = 0
  this.immune = 0
  this.beenAtk = 0
  this.collision = "none"
  this.x2 = x+this.width;
  this.y2 = y+this.height;
  this.health = hp;
  this.speedX = 0;
  this.speedY = 0;
  this.damage = damage;
  this.image = new Image()
  this.image.src = "minodown.png"
  this.update = function() {
    ctx = terrain.context
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.x2 = this.x+this.width
    this.y2 = this.y+this.height
  }
  this.collide = function(){
    this.collision = collide(this, p1)
    if(this.collision != "none"){
      kb = true
      hit = 100
      this.immune = 90
      numList.push(new number(p1, this.damage, "darkred"))
      p1.health -= this.damage
      updateBar()
      if(this.collision === "right"){
        p1.speedX = -75
      }else if(this.collision === "left"){
        p1.speedX = 75
      }else if(this.collision === "up"){
        p1.speedY = 75
      }else if(this.collision === "down"){
        p1.speedY = -75
      }
    }
  }
  this.dmg = function(){
    ctx = terrain.context
    rotatedCollideObject = {
      x: stk.x-stk.width/2,
      y: stk.y-stk.height/2,
      x2: stk.x-stk.width/2+stk.width,
      y2: stk.y-stk.height/2+stk.height,
      width: stk.width,
      height: stk.height
    }
    d = collide(rotatedCollideObject, this)
    if(d != "none"){
      console.log(d)
      numList.push(new number(this, swordList[weapon].dam, "black"))
      this.health -= swordList[weapon].dam
      this.beenAtk = 170
      if(p1.dir == 180){
        this.speedX = -150
      }else if(p1.dir == 0){
        this.speedX = 150
      }else if(p1.dir == 90){
        this.speedY = 150
      }else if(p1.dir == 270){
        this.speedY = -150
      }
    }
  }
}

function collide(o1, o2){
  if(o1.x+o1.width/2 > o2.x-2 && o1.x+o1.width/2 < o2.x2+2){
    if(o1.y < o2.y2 && o1.y > o2.y){
      return "down"
    }else if(o1.y2 > o2.y && o1.y2 < o2.y2){
      return "up"
    }
  }
  
  if(o1.y+o1.height/2 > o2.y-2 && o1.y+o1.height/2 < o2.y2+2){
    if(o1.x < o2.x2 && o1.x > o2.x){
      return "right"
    }else if(o1.x2 > o2.x && o1.x2 < o2.x2){
      return "left"
    }
  }
  
  return "none"
}

function updateBar(){
  next.innerHTML = swordList[weapon+1].name
  money.innerHTML = coins
  health.innerHTML = p1.health
}

function win(){
  
}

function death(){
  if(deathtimer <= 40){
    p1.image.src = "lenkdown.png"
  }else if(deathtimer > 40 && deathtimer <= 80){
    p1.image.src = "lenkleft.png"
  }else if(deathtimer > 80 && deathtimer <= 120){
    p1.image.src = "lenkup.png"
  }else if(deathtimer > 120 && deathtimer <= 160){
    p1.image.src = "lenkright.png"
  }else if(deathtimer > 160 && deathtimer <= 200){
    p1.image.src = "lenkdead.png"
  }else{
    deathtimer = 201
    deathScreen()
    clearInterval(terrain.interval)
  }
  deathtimer++
  p1.update()
}

function deathScreen(){
  ctx = terrain.context
  terrain.canvas.style.backgroundColor = "black"
  ctx.fillStyle = "darkred"
  ctx.font = "80px Monaco Monospace"
  ctx.fillText("GAME OVER", wW/2-210, wH/2-25)
}

function updateterrain() {
  terrain.clear();
  p1.speedX = 0;
  p1.speedY = 0;
  if(p1.health <= 0){
    p1.x = wW/2
    p1.y = wH/2
    p1.health = 0
    updateBar()
    death()
    return;
  }
  if(atktimer > 40){
    stk.update()
    atktimer--
  }else if(atktimer <= 40 && atktimer > 0){
    atktimer--
  }
  if(hit != 0){
    hit--
  }
  if(minoList.length){
    distance()
  }else if(!minoList.length && !leveling){
    leveling = true
    levelText()
  }
  if(leveling){
    ctx = terrain.context
    ctx.fillStyle = "darkgreen"
    ctx.font = "80px Monaco Monospace"
    if(prestige){
      ctx.fillText(`Next Wave: Wave ${level+1}, Prestige: ${prestige}`, wW/2-420, wH/2-25)
    }else{
      ctx.fillText(`Next Wave: Wave ${level+1}`, wW/2-250, wH/2-25)
    }
  }
  if(numList.length){
    numbers()
  }
  updatemovement()
}

function atk(){
  if(atktimer != 0){return;}
  atktimer = 75
}

function numbers(){
  for(let i = 0; i<numList.length; i++){
    if(numList[i].size <= 2){
      numList.splice(i, 1)
    }else{
      numList[i].newPos()
      numList[i].update()
    }
  }
}

function distance(){
  for(let i = 0; i<minoList.length; i++){
    console.log(i)
    minoList[i].speedX = 0;
    minoList[i].speedY = 0;
    if(minoList[i].health <= 0){
      numList.push(new number(minoList[i], `+${minoList[i].drops} Coins`, "gold"))
      coins += minoList[i].drops
      updateBar()
      minoList.splice(i, 1)
      i--
      continue;
    }
    if(minoList[i].jukeDelay != 0){
      minoList[i].jukeDelay--
    }
    if(minoList[i].delayDelay != 0){
      minoList[i].delayDelay--
    }
    if(minoList[i].immune != 0){
      minoList[i].immune--
    }
    if(minoList[i].beenAtk != 0){
      minoList[i].beenAtk--
    }
    if(minoList[i].y > p1.y-1.5 && minoList[i].y < p1.y+1.5){
      minoList[i].y = p1.y
      minoList[i].speedX = 3.1
    }
    if(minoList[i].jukeDelay == 0){
      if(minoList[i].x < p1.x){
        minoList[i].speedX = 2.8
      }else if(minoList[i].x > p1.x){
        minoList[i].speedX = -2.8
      }
      if(minoList[i].y > p1.y){
        if(minoList[i].dirY == 1){
          minoList[i].dirY = 0
          if(minoList[i].delayDelay == 0){
            minoList[i].jukeDelay = 55
          }
          minoList[i].delayDelay = 65
        }
        minoList[i].speedY = -2.9
      }else if(minoList[i].y < p1.y){
        if(minoList[i].dirY == 0){
          minoList[i].dirY = 1
          if(minoList[i].delayDelay == 0){
            minoList[i].jukeDelay = 55
          }
          minoList[i].delayDelay = 65
        }
        minoList[i].speedY = 2.9
      }
      if(!kb && minoList[i].immune == 0 && atktimer <= 25){
        minoList[i].newPos()
        if(hit == 0){
          minoList[i].collide()
        }
      }else if(atktimer > 25){
        if(minoList[i].beenAtk == 0){
          minoList[i].dmg()
        }
        minoList[i].newPos()
      }
    }
    minoList[i].update()
  }
}

function updatemovement(){
  if(!kb){
    if (terrain.key.has(65)) { p1.speedX = -3; p1.dir = 180 ; p1.image.src = "lenkleft.png"; }
    if (terrain.key.has(68)) { p1.speedX = 3; p1.dir = 0; p1.image.src = "lenkright.png"; }
    if (terrain.key.has(87)) { p1.speedY = -3; p1.dir = 270; p1.image.src = "lenkup.png"; }
    if (terrain.key.has(83)) { p1.speedY = 3; p1.dir = 90; p1.image.src = "lenkdown.png"; }
  }else{
    kb = false
  }
  p1.newPos();
  p1.update();
  s.update();
}