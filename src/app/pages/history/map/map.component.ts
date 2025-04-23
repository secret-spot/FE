/// <reference types="google.maps" />

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PlaceService, Place } from '../../../services/place.service';
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
export class MapComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchDebounceTime = 300; // API 호출 제한을 위한 디바운스 시간

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
