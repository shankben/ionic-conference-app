import { Platform } from '@ionic/angular';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild
} from '@angular/core';

import { DOCUMENT} from '@angular/common';

import Repository from '../../repository';
import darkStyle from './map-dark-style';

import firebaseAppConfig from '../../../../secrets/firebase-app-config';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapElement: ElementRef;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public repository: Repository,
    public platform: Platform
  ) { }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?' +
      `key=${firebaseAppConfig.apiKey}&libraries=&v=weekly`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return new Promise((resolve, reject) => script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject('google maps not available');
      }
    });
  }

  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    let style = [];
    if (appEl.classList.contains('dark-theme')) {
      style = darkStyle;
    }

    const googleMaps = await this.getGoogleMaps();

    let map: any;

    (await this.repository.listLocations()).subscribe((locations: any) => {
      const mapEle = this.mapElement.nativeElement;

      map = new googleMaps.Map(mapEle, {
        center: locations.find((d: any) => d.center),
        zoom: 16,
        styles: style
      });

      locations.forEach((markerData: any) => {
        const infoWindow = new googleMaps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });

        const marker = new googleMaps.Marker({
          position: markerData,
          map,
          title: markerData.name
        });

        marker.addListener('click', () => infoWindow.open(map, marker));
      });

      googleMaps.event.addListenerOnce(
        map,
        'idle',
        () => mapEle.classList.add('show-map')
      );
    });

    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      const { isDark } = ev.detail;
      if (map && isDark) {
        map.setOptions({styles: darkStyle});
      } else if (map) {
        map.setOptions({styles: []});
      }
    });
  }
}
