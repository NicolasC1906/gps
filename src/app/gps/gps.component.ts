import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from '../services/location.service';
import * as L from 'leaflet';
import { TimingService } from '../services/timing.service';


@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit, OnDestroy {

  public currentLatitude: number = 0;
  public currentLongitude: number = 0;
  private map: L.Map | null = null;
  private startPointMarker: L.Marker | null = null;
  private endPointMarker: L.Marker | null = null;
  private currentLocationMarker: L.Marker | null = null;
  private routePolyline: L.Polyline | null = null; // Campo para la polilínea

  constructor(public timingService: TimingService, private locationService: LocationService) {}

  ngOnInit(): void {
    // Corrige el enlace a las imágenes de los marcadores
    const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png';
    const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png';
    const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map(document.querySelector('.gps-map') as HTMLElement).setView([this.currentLatitude, this.currentLongitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.locationService.watchLocation((speed, timestamp, latitude, longitude) => {
      this.currentLatitude = latitude;
      this.currentLongitude = longitude;

      if (this.currentLocationMarker) {
        this.currentLocationMarker.setLatLng(new L.LatLng(latitude, longitude));
      } else {
        if (this.map) {
          this.currentLocationMarker = L.marker([latitude, longitude]).addTo(this.map);
          this.currentLocationMarker.bindPopup('Ubicación actual').openPopup();
        }
      }

      if (this.timingService.startPoint && !this.timingService.endPoint) {
        if (this.routePolyline) {
          this.routePolyline.addLatLng(new L.LatLng(latitude, longitude));
        } else {
          if (this.map) {
            this.routePolyline = L.polyline([[latitude, longitude]], {color: 'red'}).addTo(this.map);
          }
        }
      }
    }, (error) => {
      console.error(error);
    });
  }

  setStartPoint() {
    this.timingService.setStartPoint(this.currentLatitude, this.currentLongitude);

    if (this.map) {
      this.startPointMarker = L.marker([this.currentLatitude, this.currentLongitude]).addTo(this.map);
      this.startPointMarker.bindPopup('Punto de inicio').openPopup();
    }
  }

  setEndPoint() {
    this.timingService.setEndPoint(this.currentLatitude, this.currentLongitude);

    if (this.map) {
      this.endPointMarker = L.marker([this.currentLatitude, this.currentLongitude]).addTo(this.map);
      this.endPointMarker.bindPopup('Punto final').openPopup();
    }
  }

  reset() {
    this.timingService.reset();

    if (this.startPointMarker) this.startPointMarker.remove();
    if (this.endPointMarker) this.endPointMarker.remove();

    if (this.routePolyline) { // Restablecer la polilínea aquí
      this.routePolyline.remove();
      this.routePolyline = null;
    }
  }

  ngOnDestroy(): void {
    this.locationService.stopWatching();
  }
}
