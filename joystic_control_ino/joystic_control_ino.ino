// HW 11: Arduino Serial Commun. interface between an arduino and P5.js.
// CSC2463 Spring 2022 Colin Hebert
//
// https://www.youtube.com/watch?v=a49-VVJCpIY

#include "PDMSerial.h"
// #include <PDMSerial.h>   // use if PDMSerial is in your libraries folder
#include "math.h"

PDMSerial pdm;

// logic boolean variables for whether buzzer is to make an passive sound.

// response from button being pressed down and released
boolean toggled_button_state = false;

// INPUT

// joystick input
const int X_analogIN_pin = A2;
const int Y_analogIN_pin = A0;


// primitive/tiny button press input
const int button_analogIN_pin = A4;




// OUTPUT

// digital output
const int passive_buzzer_output_PWM_pin = 9;  // a pwm output pin


// the value to end the buzzer will be 12.
int end_buzzer_sound_code = 0;



void setup() {
  //---set pin direction
  pinMode(X_analogIN_pin,INPUT);
  pinMode(Y_analogIN_pin,INPUT);

  pinMode(button_analogIN_pin,INPUT);

  pinMode(passive_buzzer_output_PWM_pin,OUTPUT);

  Serial.begin(9600);
}

void loop() {

  int x;
  
  x = analogRead(X_analogIN_pin);


  
  int y;
  
  y = analogRead(Y_analogIN_pin);




  int button_state_int;
  
  button_state_int = analogRead(button_analogIN_pin);

  if(button_state_int == HIGH){

    toggled_button_state = !toggled_button_state;

    pdm.transmitSensor("a4", 1);

  } else {
    pdm.transmitSensor("a4", 0);
  }


  //Serial.print("val_X=");
  //Serial.println(x);
  
  //Serial.print("val_Y=");
  //Serial.println(y);

  //Serial.print("button_input=");
  
  //if(toggled_button_state){
    //Serial.println("true");
  //} else {
    //Serial.println("false");
  //}
  //Serial.println(y);



   if(toggled_button_state){

      delay(1000);
      
      toggled_button_state = !toggled_button_state;
      
   }


   // Transmit whatever sensors you like. When you are done, transmit end for the default ";" or your own separator.
   pdm.transmitSensor("a2", x);

   // Transmit whatever sensors you like. When you are done, transmit end for the default ";" or your own separator.
   pdm.transmitSensor("a0", y);


     // resize the range of the sensor data if wanted...
  //new_Mapped_SENSOR_Value = map(new_sensorValue, 0, 1023, 0, 255); //Convert from 0-1023 proportional to the number of a number of from 0 to 255


   pdm.transmitSensor("end");

// dummy values

   int buzzer_frequency_val = 300;

   int buzzer_duration_val = 800;


  boolean newData = pdm.checkSerial();

  if (newData) {

    noTone(passive_buzzer_output_PWM_pin);
    
    if (pdm.getName().equals(String("buzzer_freq"))) {
      
      buzzer_frequency_val = pdm.getValue();
      
    }
    else if (pdm.getName().equals(String("buzzer_duration"))) {

      buzzer_duration_val = pdm.getValue();

      if(buzzer_duration_val == 670){
        
         tone(passive_buzzer_output_PWM_pin, buzzer_frequency_val, buzzer_duration_val);
      
         delay(360);
      
         noTone(passive_buzzer_output_PWM_pin);

         delay(400);
      }
      
    } 
    else if (pdm.getName().equals(String("end_buzzer"))){
      end_buzzer_sound_code = pdm.getValue();

      if(end_buzzer_sound_code == 12){
        noTone(passive_buzzer_output_PWM_pin);        
      }
    }
    
  }
  
}
   
