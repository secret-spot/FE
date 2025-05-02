/// <reference types="google.maps" />

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PlaceService, Place } from '../../../services/place.service';
import { TravelRecordService } from '../../../services/travel-record.service';
import { CommonModule } from '@angular/common';

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
    private placeService: PlaceService,
    private travelRecordService: TravelRecordService
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
    // 현재 여행 기록 상태 로깅
    console.log('Map - Current Travel Record State:', this.travelRecordService.getTempRecord());

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
    if (this.isGoogleMapsLoaded) {
      this.initializeMap();
    }
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
      const placeData = this.autocomplete?.getPlace();
      const photo = placeData?.photos?.[0];
      const imageUrl=photo?.getUrl({maxWidth:400});
      const enrichedPlace: Place = {
        ...place,
        imageUrl:imageUrl};
      this.placeService.addPlace(enrichedPlace);
      this.placeService.cachePlace(enrichedPlace);
      
      // 장소 선택 후 현재 상태 로깅
      console.log('Map - After Place Selection:', this.travelRecordService.getTempRecord());
    }, this.searchDebounceTime);
  }

  removePlace(place: Place): void {
    this.placeService.removePlace(place);
    
    // 장소 제거 후 현재 상태 로깅
    console.log('Map - After Place Removal:', this.travelRecordService.getTempRecord());
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
