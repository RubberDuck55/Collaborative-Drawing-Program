var socket;
var send;
var message;
var space = 1;
var ussrname;
var colourInp
var sizeInp;

function setup() {

  createCanvas(800, 800);

  Notification.requestPermission();

  colourInp = createColorPicker(color('yellow'));
  colourInp.position(10,10);

  sizeInp = createSelect();
  sizeInp.position(100, 10);
  sizeInp.option(1);
  sizeInp.option(5);
  sizeInp.option(10);
  sizeInp.option(15);
  sizeInp.option(20);
  ussrname = createInput();
  ussrname.attribute('placeholder', "Name");
  message = createInput();
  message.attribute('placeholder', "Message");
  send = createButton("Send");
  send.mousePressed(sendMsg);
  socket = io.connect('/');
  socket.on('mouse', socketDraw);
  socket.on('geted', dispMsg);
  socket.on('clear', clearCanvas);
  fill(0);
  noStroke();
  rect(0, 0, 400, 800);
}

function dispMsg(m){
  if(space == 20){
    space = 1;
    fill(255);
    rect(400, 0, 400, 400);
  }
  //console.log(m);
  fill(0);
  noStroke();
  text(m.nm + ": " + m.txt, 420, space * 20);
  new Notification(m.nm + ": " + m.txt);
  space++;
}

function keyPressed() {
  if(keyIsDown(13)){
    sendMsg();
  }
}

function sendMsg(){
  var msg = {
    nm: ussrname.value(),
    txt: message.value()
  }

  socket.emit('newMsg', msg);
  message.value("");
}

function mouseDragged() {
    var data = {
    x: constrain(mouseX, 5, 400 - 5),
    y: mouseY,
    px: constrain(pmouseX, 5, 400 - 5),
    py: pmouseY,
    c: colourInp.color(),
    size: int(sizeInp.value())
  }
    socket.emit('mouse', data);

    strokeWeight(int(sizeInp.value()));
    stroke(colourInp.value());
    line(constrain(mouseX, -10, 410), mouseY, constrain(pmouseX, -10, 410), pmouseY);
}

function socketDraw(d){
  strokeWeight(d.size);
  stroke(d.c);
  line(d.x, d.y, d.px, d.py)
}

function clearCanvas(){
  fill(0);
  noStroke();
  rect(0,0,400,800);
}

function draw(){
  noStroke();
  fill(255);
  rect(400, 0, 20, 800);
}
