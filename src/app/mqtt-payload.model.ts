export interface MqttPayload {
  a: {
    [key: string]: string | number | boolean | Array<any> | null;
  }
}