# Hardware Implementation
# Pressure Sensor Project

## Overview
This project involves an ESP32-based system that reads pressure values from a sensor and sends the data to a server when the pressure value changes. The system also displays the current pressure value on an OLED screen. This README provides detailed information on the setup, configuration, and operation of the project.

## Hardware Requirements
- ESP32 Development Board
- Pressure Sensor (connected to pin 34)
- SSD1306 128x64 I2C OLED Display
- Connection wires

## Software Dependencies
- [Arduino IDE](https://www.arduino.cc/en/Main/Software)
- Libraries:
  - HTTPClient.h
  - WiFi.h
  - WiFiClient.h
  - U8g2lib.h

## Setup and Configuration
1. **WiFi Configuration**:
   - Update `ssid` and `pass` with your WiFi credentials.
   ```cpp
   char ssid[] = "Your_WiFi_SSID";
   char pass[] = "Your_WiFi_Password";
   ```

2. **Server Configuration**:
   - Set `serverAddress` to the address of your server where data will be sent.
   ```cpp
   const char* serverAddress = "http://your.server.address/path";
   ```

3. **Hardware Connections**:
   - Connect the pressure sensor to pin 34 of the ESP32.
   - Connect the OLED display to the I2C pins (SDA, SCL) of the ESP32.

4. **Threshold Setting**:
   - Adjust `PRESSURE_THRESHOLD` based on your requirement.
   ```cpp
   #define PRESSURE_THRESHOLD 500
   ```

## Operation
Once powered on, the ESP32 will:
- Connect to the specified WiFi network.
- Continually read the pressure value from the sensor.
- If the pressure value changes, it will send this new value to the server.
- Display the current pressure value on the OLED screen.

## Troubleshooting
- Ensure that all connections are secure.
- Verify that the correct WiFi credentials are provided.
- Check the server address and its availability.
- Confirm that the OLED display and pressure sensor are functioning correctly.

## Contributing
Your contributions to improve this project are welcome. Please feel free to fork, make changes, and submit pull requests.

# Airflow Sensor Project

## Overview
This project involves an ESP32-based system designed to read airflow sensor data and send this information to a server. The system utilizes a simple digital sensor to determine airflow status and communicates the data via HTTP POST requests. This README provides a detailed guide on setting up and operating this project.

## Hardware Requirements
- ESP32 Development Board
- Airflow Sensor (connected to digital pin 4)
- WiFi Connection

## Software Dependencies
- Arduino IDE (https://www.arduino.cc/en/Main/Software)
- Libraries Required:
  - HTTPClient.h
  - WiFi.h
  - WiFiClient.h

## Setup and Configuration
1. **WiFi Configuration**:
   - Update the `ssid` and `pass` variables with your WiFi network's SSID and password.
   ```cpp
   char ssid[] = "Your_WiFi_SSID";
   char pass[] = "Your_WiFi_Password";
   ```

2. **Server Configuration**:
   - Set `serverAddress` to your server's URL where the data will be sent.
   ```cpp
   const char* serverAddress = "http://your.server.address/path";
   ```

3. **Sensor Pin Configuration**:
   - Connect your airflow sensor to pin 4 of the ESP32.
   - The pin number can be changed in the `#define AIRFLOW_SENSOR_PIN 4` line if a different pin is used.

## Operation
Once the setup is complete and the code is uploaded to the ESP32, the system will:
- Connect to the specified WiFi network.
- Continuously read the status from the airflow sensor.
- Send an HTTP POST request to the configured server address with airflow status, sensor ID, and room ID as parameters.

## Code Explanation
- `setup()`: Initializes serial communication, connects to WiFi, and sets the sensor pin as input.
- `loop()`: Reads the airflow sensor, builds the POST data, sends an HTTP request, and waits for a response from the server.

## Troubleshooting
- Ensure that all connections are secure.
- Check the WiFi credentials and server address for accuracy.
- Verify that the ESP32 is correctly configured and functioning.

## Contributing
Feel free to fork this project, make improvements, and submit pull requests. Your contributions are greatly appreciated!


