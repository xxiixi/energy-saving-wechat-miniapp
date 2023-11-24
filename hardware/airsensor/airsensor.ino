#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClient.h>

char ssid[] = "春草梦";
char pass[] = "12345678Aa";

// 将原来的服务器地址改为文档中提及的地址之一作为示例
const char* serverAddress = "http://175.178.194.182:8080/airconditioner/status/set";

// 定义气流传感器引脚
#define AIRFLOW_SENSOR_PIN 4

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    Serial.print("WiFi Status: ");
    Serial.println(WiFi.status()); // 打印WiFi连接状态
  }

  pinMode(AIRFLOW_SENSOR_PIN, INPUT); // 设置气流传感器引脚为输入模式
}

void loop() {
  int airflowValue = digitalRead(AIRFLOW_SENSOR_PIN);

  HTTPClient http;
  // 根据文档要求构建POST数据
  String postData = "status=" + String(airflowValue > 0 ? 1 : 0); // 假设气流值大于0表示开启
  postData += "&sensor_id=123";  // 假设传感器ID为123
  postData += "&room_id=456";    // 假设房间ID为456

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
  delay(1000);
}
