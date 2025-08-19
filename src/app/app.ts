import { Component, signal } from '@angular/core';
import { MqttService } from './mqtt.service';
import { MqttPayload } from './mqtt-payload.model';
import { FormsModule } from '@angular/forms';
import { Connection } from 'cordova-plugin-network-information';
import { RouterOutlet } from "@angular/router"; // Import Connection type

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet], // Removed RouterOutlet
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('MQTTAndroidApp');
  protected payload: MqttPayload = {
    addressTo: '',
    addressFrom: '',
    command: '',
    rpiStatus: '',
    wifiStatus: '',
    gsmStatus: '',
    gpsLat: 0,
    gpsLon: 0,
    aprsCount: 0,
    cubeCount: 0,
    tempOutside: 0,
    tempInside: 0,
    humidityOutside: 0,
    humidityInside: 0,
    altitude: 0,
    pressure: 0,
    accelerometer: [0, 0, 0],
    gyroscope: [0, 0, 0],
    magneto: [0, 0, 0],
    uvIndex: 0,
    batVoltageLvl: 0,
    batMaxCurrent: 0,
    batAvgCurrent: 0,
    batTemp: 0,
    batHeaterStatus: '',
    dra818vFrequency: 0,
    dra818uFrequency: 0,
    runtime: 0
  };

  constructor(private mqttService: MqttService) {
    document.addEventListener('deviceready', () => {
      console.log('Cordova device ready');
      this.getGeolocation();
      this.getNetworkStatus();
    }, false);
  }

  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.payload.gpsLat = position.coords.latitude;
          this.payload.gpsLon = position.coords.longitude;
          this.payload.altitude = position.coords.altitude || 0;
        },
        (error) => {
          console.error('Geolocation error:', error.message);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }

  getNetworkStatus() {
    if (navigator.connection) {
      const networkState = navigator.connection.type;
      this.payload.wifiStatus = networkState === Connection.WIFI ? 'Connected' : 'Disconnected';
      this.payload.gsmStatus = [Connection.CELL_2G, Connection.CELL_3G, Connection.CELL_4G].includes(networkState) ? 'Connected' : 'Disconnected';
    } else {
      console.error('Network Information not supported');
    }
  }

  sendPayload() {
    this.mqttService.sendMqttMessage(this.payload);
    console.log('MQTT Payload Sent:', this.payload);
  }
}