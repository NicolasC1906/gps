import { Injectable } from '@angular/core';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class TimingService {
  public startPoint: {latitude: number, longitude: number} | null = null;
  public endPoint: {latitude: number, longitude: number} | null = null;
  private startTime: number = 0;
  private endTime: number = 0;
  public timeElapsed: number = 0;

  constructor(private locationService: LocationService) {}

  private interval: any; // Para almacenar el intervalo

  setStartPoint(latitude: number, longitude: number) {
    this.startPoint = {latitude, longitude};
    this.startTime = Date.now();

    this.interval = setInterval(() => {
      this.timeElapsed = (Date.now() - this.startTime) / 1000; // Actualiza cada segundo
    }, 1000);
  }

  setEndPoint(latitude: number, longitude: number) {
    this.endPoint = {latitude, longitude};
    clearInterval(this.interval); // Detiene el intervalo cuando se establece el punto final
    this.endTime = Date.now();
    this.timeElapsed = (this.endTime - this.startTime) / 1000;
  }

  reset() {
    clearInterval(this.interval);
    this.startPoint = null;
    this.endPoint = null;
    this.startTime = 0;
    this.endTime = 0;
    this.timeElapsed = 0;
  }
}
