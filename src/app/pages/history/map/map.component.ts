/// <reference types="google.maps" />

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PlaceService, Place } from '../../../services/place.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    google: typeof google;
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private searchDebounceTime = 300;
  private autocomplete: google.maps.places.Autocomplete | null = null;

  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  selectedPlaces: Place[] = [];
  isGoogleMapsLoaded = false;

  constructor(
    private router: Router,
    private placeService: PlaceService
  ) {
    // Google Maps API가 로드되었는지 확인
    if (typeof window.google !== 'undefined') {
      this.isGoogleMapsLoaded = true;
    } else {
      // Google Maps API가 로드되지 않았다면 로드 이벤트를 기다림
      window.addEventListener('load', () => {
        if (typeof window.google !== 'undefined') {
          this.isGoogleMapsLoaded = true;
        }
      });
    }
  }

  ngOnInit(): void {
    // PlaceService에서 선택된 장소들을 구독
    this.placeService.selectedPlaces$
      .pipe(takeUntil(this.destroy$))
      .subscribe((places: Place[]) => {
        this.selectedPlaces = places;
        if (this.isGoogleMapsLoaded && this.map) {
          this.updateMarkers();
        }
      });
  }

  ngAfterViewInit(): void {
    // DOM이 완전히 로드된 후에 맵 초기화
    setTimeout(() => {
      this.initializeMap();
    }, 500); // 시간을 더 늘려 DOM이 완전히 로드될 때까지 기다림
  }

  private initializeMap(): void {
    try {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map element not found');
        return;
      }

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심 좌표
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      };

      this.map = new google.maps.Map(mapElement, mapOptions);

      // 검색 기능 초기화 - SearchBox 대신 Autocomplete 사용
      this.initializeAutocomplete();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private initializeAutocomplete(): void {
    try {
      const searchInput = document.getElementById('search-input') as HTMLInputElement;
      if (!searchInput) {
        console.error('Search input element not found');
        return;
      }

      // Autocomplete 초기화
      this.autocomplete = new google.maps.places.Autocomplete(searchInput, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'kr' } // 한국으로 제한
      });

      // 장소 선택 이벤트 처리
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete?.getPlace();
        if (!place || !place.geometry?.location) {
          console.log('No place details available');
          return;
        }

        // 선택된 장소 정보 생성
        const selectedPlace: Place = {
          name: place.name || '',
          address: place.formatted_address || '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id || '',
          rating: place.rating,
          reviewCount: place.user_ratings_total
        };

        this.selectPlace(selectedPlace);
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMapReady(map: google.maps.Map): void {
    this.map = map;
    this.isGoogleMapsLoaded = true;
    this.updateMarkers();
  }

  selectPlace(place: Place): void {
    // 캐시된 장소 정보 확인
    const cachedPlace = this.placeService.getCachedPlace(place.placeId);
    if (cachedPlace) {
      this.placeService.addPlace(cachedPlace);
      return;
    }

    // API 호출 제한을 위한 디바운스 적용
    setTimeout(() => {
      this.placeService.addPlace(place);
      this.placeService.cachePlace(place);
    }, this.searchDebounceTime);
  }

  removePlace(place: Place): void {
    this.placeService.removePlace(place);
  }

  updateMarkers(): void {
    if (!this.isGoogleMapsLoaded || !this.map) {
      return;
    }

    // 기존 마커 제거
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    // 새로운 마커 추가
    this.selectedPlaces.forEach(place => {
      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: this.map,
        title: place.name
      });

      this.markers.push(marker);
    });
  }

  onSave(): void {
    this.router.navigate(['/history/search']);
  }

  onBack(): void {
    this.router.navigate(['/history/search']);
  }
}
