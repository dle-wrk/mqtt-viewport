import { Injectable } from '@angular/core';
import { MqttPayload } from './mqtt-payload.model';
import * as Paho from 'paho-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client: Paho.Client;
  private readonly brokerHost = 'your-mqtt-broker-host'; // e.g., 'broker.mqtt.com'
  private readonly brokerPort = 9001; // WebSocket port, adjust as needed
  private readonly clientId = `client_${Math.random().toString(16).slice(3)}`;

  constructor() {
    this.client = new Paho.Client(this.brokerHost, this.brokerPort, this.clientId);
    this.connect();
  }

  private connect() {
    this.client.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
      },
      onFailure: (error: any) => {
        console.error('MQTT connection failed:', error);
      }
    });
  }

  sendMqttMessage(payload: MqttPayload) {
    if (!this.client.isConnected()) {
      console.error('MQTT client is not connected');
      return;
    }
    const topic = 'your/topic/here'; // Define your MQTT topic
    const message = new Paho.Message(JSON.stringify(payload));
    message.destinationName = topic;
    this.client.send(message);
    console.log('Message sent to topic:', topic, payload);
  }
}