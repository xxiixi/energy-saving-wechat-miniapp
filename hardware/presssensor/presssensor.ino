#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <U8g2lib.h>

char ssid[] = "春草梦";
char pass[] = "12345678Aa";
const char* serverAddress = "http://175.178.194.182:8080/switch/status/set";

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

#define PRESSURE_SENSOR_PIN 34
#define PRESSURE_THRESHOLD 500  // 压力阈值

int lastPressureValue = -1; // 存储上一次的压力值

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    Serial.print("WiFi Status: ");
    Serial.println(WiFi.status()); // 打印WiFi连接状态
  }
  u8g2.setI2CAddress(0x3C*2);
  u8g2.begin();
  u8g2.enableUTF8Print();
}

void loop() {
  int pressureValue = analogRead(PRESSURE_SENSOR_PIN);

  // 只有在压力值发生变化时才发送POST请求
  if (pressureValue != lastPressureValue) {
    int status = pressureValue > PRESSURE_THRESHOLD ? 1 : 0; // 根据阈值设置状态

    HTTPClient http;
    String postData = "status=" + String(status);
    postData += "&sensor_id=123";  // 示例传感器ID
    postData += "&room_id=456";    // 示例房间ID

    http.begin(serverAddress);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response Code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("HTTP POST failed. Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();

    // 更新上一次的压力值
    lastPressureValue = pressureValue;
  }

  // 显示当前的压力值到OLED屏幕
  u8g2.firstPage();
  do {
    u8g2.setFont(u8g2_font_ncenB08_tr);
    u8g2.setCursor(0, 10);
    u8g2.print("Pressure: ");
    u8g2.print(pressureValue);
  } while (u8g2.nextPage());

  delay(1000); // 可以根据需要调整延时
}
