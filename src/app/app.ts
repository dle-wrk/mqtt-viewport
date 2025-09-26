import { Component, signal } from '@angular/core';
import { MqttService } from './mqtt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  public readonly title = signal('MQTTAndroidApp');

  public responseItems = [
    {
      name: 'AeroLink',
      topic: '/AeroLink/Response',
      status: 'Waiting...',
      response: null,
      timer: 0,
      highlight: false
    },
    {
      name: 'LuminaS',
      topic: '/LuminaS/Response',
      status: 'Waiting...',
      response: null,
      timer: 0,
      highlight: false
    }
  ];

  private intervals: { [key: string]: any } = {};
  private highlightTimeouts: { [key: string]: any } = {};
  private readonly countdownSeconds = 10;

  constructor(private mqttService: MqttService) {
    this.mqttService.onMessageArrived = (topic, payload) => {
      const item = this.responseItems.find(item => topic.endsWith(item.topic));
      if (item) {
        item.response = payload;
        item.status = 'Received';
        this.resetTimer(item);
        this.highlightItem(item);
      }
    };
  }

  private highlightItem(item: any) {
    item.highlight = true;
    if (this.highlightTimeouts[item.name]) {
      clearTimeout(this.highlightTimeouts[item.name]);
    }
    this.highlightTimeouts[item.name] = setTimeout(() => {
      item.highlight = false;
    }, 3000);
  }

  private resetTimer(item: any) {
    item.timer = this.countdownSeconds;
    if (this.intervals[item.name]) {
      clearInterval(this.intervals[item.name]);
    }
    this.intervals[item.name] = setInterval(() => {
      if (item.timer > 0) {
        item.timer--;
      }
    }, 1000);
  }

  public objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  public isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
