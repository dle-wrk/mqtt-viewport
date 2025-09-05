import { Injectable } from '@angular/core';
import { MqttPayload } from './mqtt-payload.model';
import * as Paho from 'paho-mqtt';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: Paho.Client;
  private readonly brokerHost = 'broker.emqx.io';
  private readonly brokerPort = 8083;
  private readonly clientId = `client_${Math.random().toString(16).slice(3)}`;

  public onMessageArrived: ((topic: string, payload: any) => void) | null =
    null;

  constructor() {
    this.client = new Paho.Client(
      this.brokerHost,
      this.brokerPort,
      this.clientId
    );
    this.client.onMessageArrived = (message: Paho.Message) => {
      if (this.onMessageArrived) {
        try {
          const payload = JSON.parse(message.payloadString);
          this.onMessageArrived(message.destinationName, payload);
        } catch (e) {
          this.onMessageArrived(message.destinationName, message.payloadString);
        }
      }
    };
    this.connect();
  }

  private connect() {
    this.client.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        // Subscribe to response topics after connecting
        this.client.subscribe('BaCaR/Launch/Event/ZS6HJH/AeroLink/Response');
        this.client.subscribe('BaCaR/Launch/Event/ZS6HJH/LuminaS/Response');
      },
      onFailure: (error: any) => {
        console.error('MQTT connection failed:', error);
      },
    });
  }

  sendMqttMessage(payload: MqttPayload, topic: string) {
    if (!this.client.isConnected()) {
      console.error('MQTT client is not connected');
      return;
    }
    const message = new Paho.Message(JSON.stringify(payload));
    message.destinationName = topic;
    this.client.send(message);
    console.log('Message sent to topic:', topic, payload);
  }
}
