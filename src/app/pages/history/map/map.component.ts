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
  searchBox: any = null;

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

    // 검색 박스 초기화
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.searchBox = new window.google.maps.places.SearchBox(searchInput);

    // 검색 결과가 변경될 때마다 마커 업데이트
    this.searchBox.addListener('places_changed', () => {
      this.clearMarkers();
      const places = this.searchBox.getPlaces();
      this.displaySearchResults(places);
    });

    // 지도 영역이 변경될 때 검색 범위 업데이트
    this.map.addListener('bounds_changed', () => {
      this.searchBox.setBounds(this.map.getBounds());
    });

    // 맵 클릭 이벤트 리스너 추가
    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        this.addPlace(event.latLng);
      }
    });
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  private displaySearchResults(places: any[]): void {
    if (!places || places.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    places.forEach(place => {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new window.google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        title: place.name
      });

      this.markers.push(marker);

      // 마커 클릭 이벤트
      marker.addListener('click', () => {
        this.selectPlace(place);
      });

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    this.map.fitBounds(bounds);
  }

  private selectPlace(place: any): void {
    const selectedPlace: Place = {
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    this.selectedPlaces.push(selectedPlace);
    this.addMarker(place.geometry.location);
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
    const index = this.selectedPlaces.findIndex(p => 
      p.lat === place.lat && p.lng === place.lng
    );
    if (index > -1) {
      this.selectedPlaces.splice(index, 1);
      this.markers[index].setMap(null);
      this.markers.splice(index, 1);
    }
  }

  onBack(): void {
    this.router.navigate(['/history']);
  }

  onSave(): void {
    // 선택한 장소들을 search 페이지로 전달
    this.router.navigate(['/search'], {
      queryParams: {
        places: JSON.stringify(this.selectedPlaces)
      }
    });
  }
}
