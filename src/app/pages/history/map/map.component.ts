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
  rating?: number;      // 별점
  reviewCount?: number; // 리뷰 수
  placeId: string;      // Google Place ID
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
  placesService: any = null;

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
    this.placesService = new window.google.maps.places.PlacesService(this.map);

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
    // 장소의 상세 정보를 가져옴
    const request = {
      placeId: place.place_id,
      fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total']
    };

    this.placesService.getDetails(request, (result: any, status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const selectedPlace: Place = {
          name: result.name,
          address: result.formatted_address,
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          rating: result.rating,
          reviewCount: result.user_ratings_total,
          placeId: result.place_id
        };

        this.selectedPlaces.push(selectedPlace);
        this.addMarker(result.geometry.location);
      }
    });
  }

  private addPlace(latLng: any): void {
    // Geocoder를 사용하여 좌표를 주소로 변환
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        // 장소 ID가 있는 경우 상세 정보를 가져옴
        if (results[0].place_id) {
          const request = {
            placeId: results[0].place_id,
            fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total']
          };

          this.placesService.getDetails(request, (placeResult: any, placeStatus: string) => {
            if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK) {
              const place: Place = {
                name: placeResult.name,
                address: placeResult.formatted_address,
                lat: placeResult.geometry.location.lat(),
                lng: placeResult.geometry.location.lng(),
                rating: placeResult.rating,
                reviewCount: placeResult.user_ratings_total,
                placeId: placeResult.place_id
              };

              this.selectedPlaces.push(place);
              this.addMarker(placeResult.geometry.location);
            }
          });
        } else {
          // 장소 ID가 없는 경우 기본 정보만 사용
          const place: Place = {
            name: results[0].formatted_address,
            address: results[0].formatted_address,
            lat: latLng.lat(),
            lng: latLng.lng(),
            placeId: ''
          };

          this.selectedPlaces.push(place);
          this.addMarker(latLng);
        }
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
    this.router.navigate(['/history/search'], {
      queryParams: {
        places: JSON.stringify(this.selectedPlaces)
      }
    });
  }
}
