import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Place {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;      // 별점
  reviewCount?: number; // 리뷰 수
  placeId: string;      // Google Place ID
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  // 선택한 장소 목록을 관리하는 BehaviorSubject
  private selectedPlacesSubject = new BehaviorSubject<Place[]>([]);
  selectedPlaces$ = this.selectedPlacesSubject.asObservable();

  // 장소 정보 캐시
  private placeCache = new Map<string, Place>();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      // 로컬 스토리지에서 선택된 장소들을 복원
      const savedPlaces = localStorage.getItem('selectedPlaces');
      if (savedPlaces) {
        this.selectedPlacesSubject.next(JSON.parse(savedPlaces));
      }

      // 장소 목록이 변경될 때마다 로컬 스토리지에 저장
      this.selectedPlaces$.subscribe(places => {
        localStorage.setItem('selectedPlaces', JSON.stringify(places));
      });
    }
  }

  // 선택한 장소 목록 가져오기
  getSelectedPlaces(): Place[] {
    return this.selectedPlacesSubject.value;
  }

  // 장소 추가
  addPlace(place: Place): void {
    const currentPlaces = this.selectedPlacesSubject.value;
    const exists = currentPlaces.some(p => 
      p.lat === place.lat && p.lng === place.lng
    );

    if (!exists) {
      this.selectedPlacesSubject.next([...currentPlaces, place]);
    }
    
    // 캐시에 저장
    if (place.placeId) {
      this.placeCache.set(place.placeId, place);
    }
  }

  // 장소 제거
  removePlace(place: Place): void {
    const currentPlaces = this.selectedPlacesSubject.value;
    const updatedPlaces = currentPlaces.filter(p => 
      p.lat !== place.lat || p.lng !== place.lng
    );
    this.selectedPlacesSubject.next(updatedPlaces);
  }

  // 장소 목록 초기화
  clearPlaces(): void {
    this.selectedPlacesSubject.next([]);
  }

  // 캐시에서 장소 정보 가져오기
  getCachedPlace(placeId: string): Place | undefined {
    return this.placeCache.get(placeId);
  }

  // 캐시에 장소 정보 저장
  cachePlace(place: Place): void {
    if (place.placeId) {
      this.placeCache.set(place.placeId, place);
    }
  }

  clearCache(): void {
    this.placeCache.clear();
  }
} 