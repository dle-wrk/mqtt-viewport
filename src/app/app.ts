import { Component, signal } from '@angular/core';
import { MqttService } from './mqtt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  public readonly title = signal('MQTTAndroidApp');

  public aerolinkResponse: any = null;
  public luminaSResponse: any = null;

  public aerolinkTimer: number = 0;
  public luminaSTimer: number = 0;

  private aerolinkInterval: any = null;
  private luminaSInterval: any = null;
  private readonly countdownSeconds = 10;

  constructor(private mqttService: MqttService) {
    this.mqttService.onMessageArrived = (topic, payload) => {
      if (topic.endsWith('/AeroLink/Response')) {
        this.aerolinkResponse = payload;
        this.resetAeroLinkTimer();
      } else if (topic.endsWith('/LuminaS/Response')) {
        this.luminaSResponse = payload;
        this.resetLuminaSTimer();
      }
    };
  }

  private resetAeroLinkTimer() {
    this.aerolinkTimer = this.countdownSeconds;
    if (this.aerolinkInterval) {
      clearInterval(this.aerolinkInterval);
    }
    this.aerolinkInterval = setInterval(() => {
      if (this.aerolinkTimer > 0) {
        this.aerolinkTimer--;
      }
    }, 1000);
  }

  private resetLuminaSTimer() {
    this.luminaSTimer = this.countdownSeconds;
    if (this.luminaSInterval) {
      clearInterval(this.luminaSInterval);
    }
    this.luminaSInterval = setInterval(() => {
      if (this.luminaSTimer > 0) {
        this.luminaSTimer--;
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