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

  public aerolinkResponse: any = null;
  public luminaSResponse: any = null;

  public aerolinkTimer: number = 0;
  public luminaSTimer: number = 0;

  public aerolinkHighlight = false;
  public luminaSHighlight = false;

  private aerolinkInterval: any = null;
  private luminaSInterval: any = null;
  private aerolinkHighlightTimeout: any = null;
  private luminaSHighlightTimeout: any = null;
  private readonly countdownSeconds = 10;

  constructor(private mqttService: MqttService) {
    this.mqttService.onMessageArrived = (topic, payload) => {
      if (topic.endsWith('/AeroLink/Response')) {
        this.aerolinkResponse = payload;
        this.resetAeroLinkTimer();
        this.highlightAeroLink();
      } else if (topic.endsWith('/LuminaS/Response')) {
        this.luminaSResponse = payload;
        this.resetLuminaSTimer();
        this.highlightLuminaS();
      }
    };
  }

  private highlightAeroLink() {
    this.aerolinkHighlight = true;
    if (this.aerolinkHighlightTimeout) {
      clearTimeout(this.aerolinkHighlightTimeout);
    }
    this.aerolinkHighlightTimeout = setTimeout(() => {
      this.aerolinkHighlight = false;
    }, 3000);
  }

  private highlightLuminaS() {
    this.luminaSHighlight = true;
    if (this.luminaSHighlightTimeout) {
      clearTimeout(this.luminaSHighlightTimeout);
    }
    this.luminaSHighlightTimeout = setTimeout(() => {
      this.luminaSHighlight = false;
    }, 3000);
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
