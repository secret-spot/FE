import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

// 구글 맵 타입 선언
declare global {
  interface Window {
    google: any;
  }
}

interface Place {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MapComponent implements OnInit, AfterViewInit {
  map: any = null;
  markers: any[] = [];
  selectedPlaces: Place[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // 구글 맵 API 키를 environment.ts에서 가져와서 동적으로 로드
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  ngAfterViewInit(): void {
    // 구글 맵 초기화
    setTimeout(() => {
      this.initMap();
    }, 1000);
  }

  private initMap(): void {
    if (typeof window.google === 'undefined') {
      console.error('Google Maps API가 로드되지 않았습니다.');
      return;
    }

    const mapOptions = {
      center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심 좌표
      zoom: 13
    };

    this.map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    // 맵 클릭 이벤트 리스너 추가
    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        this.addPlace(event.latLng);
      }
    });
  }

  private addPlace(latLng: any): void {
    // Geocoder를 사용하여 좌표를 주소로 변환
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        const place: Place = {
          name: results[0].formatted_address,
          address: results[0].formatted_address,
          lat: latLng.lat(),
          lng: latLng.lng()
        };

        this.selectedPlaces.push(place);
        this.addMarker(latLng);
      }
    });
  }

  private addMarker(latLng: any): void {
    if (this.map) {
      const marker = new window.google.maps.Marker({
        position: latLng,
        map: this.map,
        title: '선택한 장소'
      });
      this.markers.push(marker);
    }
  }

  removePlace(place: Place): void {
    const index = this.selectedPlaces.findIndex(p => p.lat === place.lat && p.lng === place.lng);
    if (index !== -1) {
      this.selectedPlaces.splice(index, 1);
      this.markers[index].setMap(null);
      this.markers.splice(index, 1);
    }
  }

  onBack(): void {
    this.router.navigate(['/history/search']);
  }

  onSave(): void {
    // TODO: 선택한 장소들을 저장하고 검색 화면으로 돌아가기
    this.router.navigate(['/history/search']);
  }
}
