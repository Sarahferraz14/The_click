#include <Servo.h>

const int PIN_LUZ = 13;
const int PIN_MOTOR = 9;
Servo portao;

void setup() {
  Serial.begin(9600);
  pinMode(PIN_LUZ, OUTPUT);
  portao.attach(PIN_MOTOR);
  portao.write(0);
}

void loop() {
  if (!Serial.available()) return;
  String cmd = Serial.readStringUntil('\n');
  cmd.trim();

  if (cmd == "LIGHT:ON")        digitalWrite(PIN_LUZ, HIGH);
  else if (cmd == "LIGHT:OFF")  digitalWrite(PIN_LUZ, LOW);
  else if (cmd == "GATE:OPEN")  portao.write(90);
  else if (cmd == "GATE:CLOSE") portao.write(0);
}