
// Student :  Colin H Hebert     in CSC 2463  (at LSU Spring 2022)

//  HW 12 (Physical Project)
//
//  In order to hear sound playback, the user must press a key from the keyboard at the 'sketch.js' programs start page. 
//
// github uploaded project stuff:
// https://github.com/chebert2/Extended_BUG_SQUISH_APP__Controller_P5_Integration_Project__hw12_ColinHebert__CSC_2463_J_Allison




// serial data port
let portName = 'COM4';    // Fill in  serial port name here


// Set up the serial data global variables for communication

let sensorData = null;
let pastSensorData = null;
let inData = "bob";                               // For incoming serial data
let outData;                              // For outgoing serial data
 
// serialEvent = this.serialEvent.bind(this);
// transmit = this.transmit.bind(this);
// sensorCheck = this.sensorCheck.bind(this);
// sensorsConnected = this.sensorsConnected.bind(this);
  
let serial;


// excluding the audio file path name, .. the below line of code came
//  from the first and most popular answer on the website "www.stackoverflow.com"
//  ::  < https://stackoverflow.com/questions/9419263/how-to-play-audio >  ::
var audio = new Audio("audio_media/08- Space Quest IV (MT-32)- Xenon Sewers.ogg");

let in_preGamePhase_bool = 1;

let have_interacted_with_keyboard_starting_background_music = 0;

let j_STICK_x_val = 0;

let j_STICK_y_val = 0;

let x_location_selected = Math.round(1300/2);

let y_location_selected = Math.round(900/2);

let button_pressed_for_adjusting_game_phase = 0;

let button_switch_set_to_ON = 0;

let squash_Mode_is_set_ON = 0;

let initial_button_duration_length = 23;

let future_scheduleTime_to_turnOff_SquashMode = 0;

let wait_three_frames__to_end_buzzer = 0;

let wait_three_count = 0;


let run_prebeginning_game_audio = 1;


let restart_duration_lapse = 1.4;

let counter_for__restart_Time_lapse = 0.09;


let ant_image;

let soundWaveAnimation;

let boolStart_the_app_BUTTON_pressed = 0;
let app_just_started = 0;
let do_once__begin_underneath_layer_of_music__bool = 1;

let startTime = 0.26;
let gameState = 'wait';

let int_bugs_killed_in_game = 0;

let old_x = 0;
let old_y = 0;

let sx;
let spriteSheet_01;
let character = [];

let count = 47;


let players;

let delayTimeGiven = [0.0003, 0.0006, 0.0009, 0.0012, 0.0015];

let initialStart = 1;

let newGameStartupFlag = 0;

// globally assigned variable for whether [a] track/s loop/s.
let loop_enabled = 1;

function preload(){

    ant_image = loadImage("visual_media/ant_background.jpg");

    soundWaveAnimation = loadImage("visual_media/tumblr_n98y5nl9k21rpco88o1_500.gif");

    spriteSheet_01 = loadImage("visual_media/spriteSheet_width_384__height_83.png");

    players = new Tone.Players({
       't_01': "audio_media/deteriorated_as_to__excerpt.ogg",
       't_02': "audio_media/380381__cribbler__squashing-sallad.ogg",
       't_03': "audio_media/472399__joseagudelo__16-raton-chillando.ogg",
       't_04': "audio_media/missBugHitSound.ogg",
       't_05': "audio_media/ninja_running_out_of_time.ogg"
    }).toDestination();


}

function setup() {


  serial = new p5.SerialPort();           // Make new instance of serialport library

  serial.on('list', printList); // set a callback function for the serialport list event
 
  serial.list(); // list the serial ports

  serial.on('data', serialEvent);         // Callback when new data arrives
  serial.on('error', gotError);        // Callback for errors


  serial.on('connected', () => { console.log('Connected to P5SerialControl Server') });
  serial.on('open', () => { console.log("Serial Port is open!"); });



  

  console.log("port: "+ portName);

  serial.open(portName);                  // Open serial port
  // this.serial.on('open', this.gotError);

  console.log(inData);

  createCanvas(1300, 900);

  imageMode(CENTER);

  image(ant_image, 1300/2, 900/2);

  image(soundWaveAnimation, 1300/2, 665);

  for(i = 0; i < count; i++){

      character[i] = new Character(spriteSheet_01, random(42, 1150), random(42, 867), random(2.3, 4.6));

   }


   players.player('t_01').loop = 1;
   players.player('t_03').loop = 1;


  
}


function timer(){
    return int(millis() - startTime) / 1000;
}


// this will be done away with
function mousePressed() {

}

function mouseDragged() {
    //for(i = 0; i < count; i++){
    //  character[i].drag();
   // }
}

function mouseReleased() {
     //for(i = 0; i < count; i++){
     //  character[i].drop();
     //}
}


function keyPressed(){

  have_interacted_with_keyboard_starting_background_music = 1;
}

function draw() {
  background(255, 255, 255);

  if( wait_three_frames__to_end_buzzer ){
    wait_three_count += 1;
  }
  
  if(wait_three_count == 3){

    wait_three_frames__to_end_buzzer = 0;

    wait_three_count = 0;

    transmit('buzzer_duration', 0);

    transmit('end_buzzer', 12);

    transmit('end_buzzer', 0);

  }
  

  if ( pastSensorData != null ){
     
    x_location_selected = plot_x_position(j_STICK_x_val);

    y_location_selected = plot_y_position(j_STICK_y_val);

    strokeWeight(4);
    stroke(255, 204, 0);
    circle(x_location_selected, y_location_selected, 32);

    strokeWeight(0);
    stroke(32, 32, 32);
    circle(0, 0, 32);

  }

  if (newGameStartupFlag) {
    play1(3);
    play1(5);
    newGameStartupFlag = 0;
  }

  if (button_switch_set_to_ON){

    squash_Mode_is_set_ON = 1;

    future_scheduleTime_to_turnOff_SquashMode = millis() + initial_button_duration_length * 1000 ;

    button_switch_set_to_ON = 0;

  }

  if(millis() >= future_scheduleTime_to_turnOff_SquashMode){

    squash_Mode_is_set_ON = 0;

  }


  if (squash_Mode_is_set_ON && boolStart_the_app_BUTTON_pressed && app_just_started) {


    let haveGrabbed = 0;
    let dmin = -1;
    let character_id = -1;

    for (i = 0; i < count; i++) {
      let d = character[i].grabCheck();
      if (d != -1) {
        if (dmin == -1 || d < dmin) {
          dmin = d;
          character_id = i;
          haveGrabbed = 1;
        }
      }
    }
    if (haveGrabbed) {
      character[character_id].grab();
    }
    else if (haveGrabbed != 1) {
      play1(4);
    }
  }

  // console.log("x_val:");
  // console.log(sensors.a2);

  if (boolStart_the_app_BUTTON_pressed) {

    app_just_started = 1;

    if (gameState == 'wait') {


      button_switch_set_to_ON = 0;

      textSize(30);
      text("Press the physical button to start playing.", 150, 300);
      if (button_pressed_for_adjusting_game_phase) {
        startTime = millis();
        gameState = 'playing';
        newGameStartupFlag = 1;
        for (i = 0; i < count; i++) {

          // 0 means up and down  and other than that means left or right.
          let one_or_zero = int(random(1, 4));

          character[i].move = 1;

          if (one_or_zero == 1) {
            character[i].go(1);
          } else if (one_or_zero == 2) {
            character[i].go(-1);
          } else if (one_or_zero == 3) {
            character[i].go(2);
          } else if (one_or_zero == 4) {
            character[i].go(-2);
          }
        }
        button_pressed_for_adjusting_game_phase = 0;
      }
    }
    else if (gameState == 'playing') {

      let time = timer();

      textSize(18);
      text("time: " + (20 - time), 10, 30);

      textSize(17);
      text("Number Bugs Killed : " + int_bugs_killed_in_game, 945, 29);


      if (time >= 20) {
        gameState = 'end';
      }
    } else if (gameState == 'end') {

      let time = timer();

      textSize(18);
      text("time: " + (20 - time), 10, 30);

      textSize(17);
      text("Number Bugs Killed : " + int_bugs_killed_in_game, 945, 29);

      textSize(38);
      text("Game is OVER.", 150, 300);
      textSize(34);
      text("Press physical button to RESTART.", 150, 400);

      if (button_pressed_for_adjusting_game_phase && millis() >= counter_for__restart_Time_lapse) {

        

        startTime = millis();

        gameState = 'playing';

        int_bugs_killed_in_game = 0;

        character = [];

        newGameStartupFlag = 1;

        run_prebeginning_game_audio = 1;

        for (i = 0; i < count; i++) {

          character[i] = new Character(spriteSheet_01, random(42, 1150), random(42, 867), random(2.3, 10));


          // 0 means up and down  and other than that means left or right.
          let one_or_zero = int(random(1, 4));

          character[i].move = 1;

          if (one_or_zero == 1) {
            character[i].go(1);
          } else if (one_or_zero == 2) {
            character[i].go(-1);
          } else if (one_or_zero == 3) {
            character[i].go(2);
          } else if (one_or_zero == 4) {
            character[i].go(-2);
          }


        }
        button_pressed_for_adjusting_game_phase = 0;
      }

    }

    for (i = 0; i < count; i++) {
      character[i].draw();
    }
  } else {

    image(ant_image, 1300/2, 900/2);

    image(soundWaveAnimation, 1300/2, 655);



    // paint a rectangle to make the next text
    // rendering piece (that follows) standout!
    fill(175, 08, 0);
    rect(85, 862, 1262, 150);

    fill(15, 15, 15);
    textSize(27);
    text("To Play Intro Music, first Tap a key on the keyBoard, and then \" Press the Physical arduino Button. \"", 88, 890); 




    fill(15, 15, 15);
    textSize(27);
    text("To Start App, \" Push the joystick's x position all the way to the left.  \"", 512, 450); 
  }

}

class Character {
  constructor(spriteSheet, x, y, speed){
    this.spriteSheet = spriteSheet;
    this.sx = 0;
    this.boolRotated = false;
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.move = 0;
    
    this.rotateParamFLAG = 0;
    this.speed = speed;
    
    this.offsetX = 0;
    this.offsetY = 0;

    this.grabbed = false;

    this.spriteFrame = 0;

    this.next_x_special = 0;
    this.next_y_special = 0;

  }

  animate(){
    let sx, sy;
    if(this.move == 0){
      
      if(this.grabbed){
         // animation for grabbing
         this.sx = 5;
         sy = 0;
      } else {
        // animation for standing still
        sx = 0;
        sy = 0;
      }

    } else {
      // animation for walking.
      sx = this.spriteFrame % 5;
      sy = 0;

    }

    return [sx, sy];

  }


  draw() {

    //console.log(sensors.a4);

    old_x = this.x;
    old_y = this.y;
    //this.next_x_special = 0;
    //this.next_y_special = 0;

    push();
    translate(this.x, this.y);

    // this is for rotating the bugs to facing leftward or rightward

    // 2 == left to right, -2 == right to left
    if(this.facing == 2 || this.facing == -2){
      // rightward
      if(this.facing == 2){
        this.rotateParamFLAG = this.facing - 1
      }
      //leftward 
       else {
        this.rotateParamFLAG = this.facing + 1
      }
      //  scaling parameter to reflect the bug's head orientation
      scale(this.rotateParamFLAG, 1);
      // omit maybe
      rotate(radians(90));

    } 
    
    if(this.facing == -1){
      // omit maybe
      rotate(radians(180));
    }
    
    let [sx, sy] = this.animate();
    
    image(this.spriteSheet, 0, 0, 89, 115, 64 * (this.sx), 0, 64, 83);

    
    if(this.facing == 1 || this.facing == -1) {
      this.y -= this.speed * this.move;
    } // right and left are this.facing == 2  , and this.facing == -2
     else {
      this.x += this.speed * this.move;
    }

    if (frameCount % 4 == 0) {
       this.sx = (this.sx + 1) % 5;
    }

    // increase speed through game
    if(this.speed >= 19.2){
      this.speed = 19.6;
    } else if (frameCount % 257 == 0) {
      this.speed += this.speed * (0.182);
   }
    
    
    this.spriteFrame += 1;


     pop();


     push();

     if(this.move == 1 || this.move == -1){

       if(this.facing == 1) {
        this.next_y_special = old_y + 5 * 1;
      } else if(this.facing == -1){
        this.next_y_special = old_y + 5 * -1;
      } else if(this.facing == 2){
        this.next_x_special = old_x + 5 * 1;
      } else if(this.facing == -2){
        this.next_x_special = old_x + 5 * -1;
      }

      if (this.next_y_special < 13) {
        //console.log(" y < 13:", this.next_y_special);
        this.move = -1;
        this.facing = -1;
     } else if (this.next_y_special > 874){
      //console.log(" y > 787:", this.next_y_special);
       this.move = 1;
       this.facing = 1;
     } else if (this.next_x_special < 13){
      //console.log(" x < 13:", this.next_x_special);
       this.move = 1;
       this.facing = 2;

     } else if (this.next_x_special > 1278){
      //console.log(" x > 787:", this.next_x_special);
       this.move = -1;
       this.facing = -2
     }
    }

    pop();

  }

  go(goNumericVAL){
    if(goNumericVAL == 1){
      this.move = 1;
      this.facing = 1;
      this.sx = 0;
    } else if(goNumericVAL == -1){
      this.move = -1;
      this.facing = -1;
      this.sx = 0;
    } else if(goNumericVAL == -2){
      this.move = -1;
      this.facing = -2;
      this.sx = 0;
    } else if(goNumericVAL == 2){
      this.move = 1;
      this.facing = 2;
      this.sx = 0;
    }
  }

  stop(){
    this.move = 0;
  }

  grabCheck(){
    let d = -1;
    if(x_location_selected  > this.x - 166 && x_location_selected < this.x + 166 &&
      y_location_selected > this.y - 166 && y_location_selected < this.y + 166){

        d = dist(x_location_selected, y_location_selected, this.x, this.y);
      }
      return d;
  }

  grab() {
        this.stop();
        this.grabbed = true;
        //this.offsetX = this.x - mouseX;
        //this.offsetY = this.y - mouseY;

        // animation squashed bug 'audio effect' will play now
        //play1(2);

        transmit('buzzer_freq', 780);
        transmit('buzzer_duration', 670);

        wait_three_frames__to_end_buzzer = 1;


        int_bugs_killed_in_game += 1;
       
  }

  
}

function startProgram(){
  
  boolStart_the_app_BUTTON_pressed = 1 ; 

  audio.pause();
  
}

function play1(input_int){
  if(input_int == 1){
      //players.player('t_01').start();
      players.player('t_01').start(delayTimeGiven[0] + 0.0053);
      // console.log("initial p1:" + (delayTimeGiven[0] + 0.0053));
  } else if(input_int == 2){
      //players.player('t_02').start();
      players.player('t_02').start(delayTimeGiven[1] + 0.0053);
      // console.log("initial p2:" + (delayTimeGiven[1] + 0.0053));
  } else if(input_int == 3){
      //players.player('t_03').start();
      players.player('t_03').start(delayTimeGiven[2] + 0.0053);
      // console.log("initial p3:" + (delayTimeGiven[2] + 0.0053));
  } else if(input_int == 4){
      //players.player('t_04').start();
      players.player('t_04').start(delayTimeGiven[3] + 0.0053);
      // console.log("initial p4:" + (delayTimeGiven[3] + 0.0053));
  } else if(input_int == 5){
      //players.player('t_05').start();
      players.player('t_05').start(delayTimeGiven[4] + 0.0053);
      // console.log("initial p5:" + (delayTimeGiven[4] + 0.0053));
  }
}







  // Read data from the serial port

  function serialEvent() {

    // analogue input 'a2' holds the x joystick axis input value.
    if (pastSensorData != null) {

      if (in_preGamePhase_bool) {
        if (do_once__begin_underneath_layer_of_music__bool) {
          if (pastSensorData.hasOwnProperty("a2")) {


            if (pastSensorData.a2 <= 134) {


              in_preGamePhase_bool = 0;

              startProgram();
              play1(1);
              do_once__begin_underneath_layer_of_music__bool = 0;

            }

          }
        }
        // analogue input 'a4' holds the physical button input value.
        if (have_interacted_with_keyboard_starting_background_music && pastSensorData.hasOwnProperty("a4")) {

          if (pastSensorData.a4 == 1) {

            if(run_prebeginning_game_audio && gameState == 'wait')
            {

               audio.play();

               run_prebeginning_game_audio = 0;
            }
      
          }
        }
      }
    }

    else if ( pastSensorData == null ){

       sensorData = {};
       pastSensorData = {};

    }
    
    
    inData = serial.readStringUntil(";\n"); 

    let sensors_received = inData.split(',');
      // ['a0:997','d7:0']  =>  {'a0':997,'d7':0}
      sensors_received.forEach ((element) => {
      let el = element.split(':');
      if (el[0]) {
        sensorData[el[0]] = parseFloat(el[1]);
      }
    });


    if (sensorData != null) {

      // joystick x input value
      if (sensorData.hasOwnProperty("a2")) {

        j_STICK_x_val = sensorData.a2;

      }

      // joystick y input value
      if (sensorData.hasOwnProperty("a0")) {

        j_STICK_y_val = sensorData.a0;

      }

      // analogue input 'a4' holds the physical button input value.
      if (sensorData.hasOwnProperty("a4") &&  ( gameState != 'wait' ) && (  gameState != 'end'  )  ) {

        if (sensorData.a4 == 1) {

          button_switch_set_to_ON = 1;


        }

 

    
      }

      // analogue input 'a4' holds the physical button input value.
      if (sensorData.hasOwnProperty("a4") && gameState == 'wait'  ) {

        if (sensorData.a4 == 1 && boolStart_the_app_BUTTON_pressed ) {

          button_pressed_for_adjusting_game_phase = 1;

        }

      }

       // analogue input 'a4' holds the physical button input value.
       if (sensorData.hasOwnProperty("a4") && gameState == 'end'  ) {

        if (sensorData.a4 == 1 ) {

          button_pressed_for_adjusting_game_phase = 1;
          
          counter_for__restart_Time_lapse = millis() + restart_duration_lapse * 830;

        }

      }

    }
    
    // check for changes
    //let flags = this.sensorCheck();
    
    pastSensorData = sensorData;

    // sensorData = sensors.reduce((accumulator, currentSensor) => {
    //   let el = element.split(':');
    //   accumulator[el[0]] = el[1];
    // });

    //console.log("changes: ", flags.toString());
    
    // console.log(sensors);                      // Log incoming data
    
  }


// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + portList[i]);
  }
}

  
  function sensorCheck(){
    
    let obj1 = sensorData;
      // console.log("SensorData: ", obj1);
    let obj2 = pastSensorData;
      // console.log("pastSensorData: ", obj2);
    let flags = [];

    if(Object.keys(obj1).length==Object.keys(obj2).length){
        for(key in obj1) { 
          console.log("key ",key, obj1[key]);
            if(obj1[key] == obj2[key]) {
                continue;
            }
            else {
                flags.push(key);
                // console.log(key);
                // break;
            }
        }
    }
    else {
        flags.push(false);
    }
    
    return flags;
  }

  
  function sensorsConnected() {
    let sensorList = Object.keys(sensorData);
    return sensorList;
  }
  
  // Error Logging

  function gotError(theerror) {
    console.log('Error in PDM Serial:' + theerror);
  }
  
  
  // ********* LSU DDEM Transmit to Arduino

  function transmit(name,value) {
    outData = name + ":" + value +','; 
    // console.log("Writing to Serial Port: " + this.outData);
    serial.write(outData); 
  }


  function plot_x_position(jStick_X_factor){

    let iterim_x_location_selected = x_location_selected;


    // cases with positive change
    

    if(j_STICK_x_val >= 894){

      iterim_x_location_selected = Math.round(  iterim_x_location_selected +   ( ((j_STICK_x_val - 894) * 0.0274) + 
      
      ((125) * 0.041) + ((158) * 0.047) + ((94) * 0.059) )   );

    }
    else if(j_STICK_x_val >= 768){

      iterim_x_location_selected = Math.round(  iterim_x_location_selected +   ( ((j_STICK_x_val - 768) * 0.041) +
      
      ((158) * 0.047) + ((94) * 0.059) )   );

    }
    else if(j_STICK_x_val >= 609){

      iterim_x_location_selected = Math.round(iterim_x_location_selected +   ( ((j_STICK_x_val - 609) * 0.047) + 
      
      ((94) * 0.059) )  );

    }
    else if(j_STICK_x_val >= 514){

      iterim_x_location_selected = Math.round(iterim_x_location_selected + ( (j_STICK_x_val - 514) * 0.059 )   );

    } 


    // set zero zone for x-joystick's marginal influence
    else if (j_STICK_x_val < 514 && j_STICK_x_val > 507) {
      // leave iterim_x_location_selected's  'value'  alone
    }




    // cases with negative change

    else if (j_STICK_x_val < 129) {

      iterim_x_location_selected = Math.round(iterim_x_location_selected - (  ((128 - j_STICK_x_val ) * 0.0274) + 
      
      ((125) * 0.041) + ((158) * 0.047) + ((93) * 0.059) )  );

    }

    else if (j_STICK_x_val < 255) {

      iterim_x_location_selected = Math.round(iterim_x_location_selected - (  ((254 - j_STICK_x_val ) * 0.041) 
      
      + ((158) * 0.047) + ((93) * 0.059) )  );

    }

    else if (j_STICK_x_val < 414) {

      iterim_x_location_selected = Math.round(iterim_x_location_selected - (  ((413 - j_STICK_x_val) * 0.047) 
      
      + ((93) * 0.059) )  );

    }

    else if (j_STICK_x_val < 508) {

      iterim_x_location_selected = Math.round(iterim_x_location_selected - ( (507 - j_STICK_x_val) * 0.059 )  );

    } 
     

    if(iterim_x_location_selected < 0){
      iterim_x_location_selected = 0;
    } else if(iterim_x_location_selected > 1300){
      iterim_x_location_selected = 1300;
    }



    return iterim_x_location_selected;

  }

  function plot_y_position(jStick_Y_factor){

    
    let iterim_y_location_selected = y_location_selected;
   

    // cases with positive change


    if(j_STICK_y_val >= 894){

      iterim_y_location_selected = Math.round(  iterim_y_location_selected +   ( ((j_STICK_y_val - 894) * 0.0274) + 
      
      ((125) * 0.041) + ((158) * 0.047) + ((94) * 0.059) )   );

    }
    else if(j_STICK_y_val >= 768){

      iterim_y_location_selected = Math.round(  iterim_y_location_selected +   ( ((j_STICK_y_val - 768) * 0.041) +
      
      ((158) * 0.047) + ((94) * 0.059) )   );

    }
    else if(j_STICK_y_val >= 609){

      iterim_y_location_selected = Math.round(iterim_y_location_selected +   ( ((j_STICK_y_val - 609) * 0.047) + 
      
      ((94) * 0.059) )  );

    }
    else if(j_STICK_y_val >= 514){

      iterim_y_location_selected = Math.round(iterim_y_location_selected + ( (j_STICK_y_val - 514) * 0.059 )   );

    } 


    // set zero zone for y-joystick's marginal influence
    else if (j_STICK_y_val < 514 && j_STICK_y_val > 507) {
      // leave iterim_y_location_selected's  'value'  alone
    }




    // cases with negative change

    else if (j_STICK_y_val < 129) {

      iterim_y_location_selected = Math.round(iterim_y_location_selected - (  ((128 - j_STICK_y_val ) * 0.0274) + 
      
      ((125) * 0.041) + ((158) * 0.047) + ((93) * 0.059) )  );

    }

    else if (j_STICK_y_val < 255) {

      iterim_y_location_selected = Math.round(iterim_y_location_selected - (  ((254 - j_STICK_y_val ) * 0.041) 
      
      + ((158) * 0.047) + ((93) * 0.059) )  );

    }

    else if (j_STICK_y_val < 414) {

      iterim_y_location_selected = Math.round(iterim_y_location_selected - (  ((413 - j_STICK_y_val) * 0.047) 
      
      + ((93) * 0.059) )  );

    }

    else if (j_STICK_y_val < 508) {

      iterim_y_location_selected = Math.round(iterim_y_location_selected - ( (507 - j_STICK_y_val) * 0.059 )  );

    } 
    

    if(iterim_y_location_selected < 0){
      iterim_y_location_selected = 0;
    } else if(iterim_y_location_selected > 900){
      iterim_y_location_selected = 900;
    }



    return iterim_y_location_selected;

  }





