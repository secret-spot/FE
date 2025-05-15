import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Place {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;      // rating
  reviewCount?: number; // reviewCount
  placeId: string;      // Google Place ID
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  // selectedPlacesSubject
  private selectedPlacesSubject = new BehaviorSubject<Place[]>([]);
  selectedPlaces$ = this.selectedPlacesSubject.asObservable();

  // placeCache
  private placeCache = new Map<string, Place>();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      // restore selected places from localStorage
      const savedPlaces = localStorage.getItem('selectedPlaces');
      if (savedPlaces) {
        this.selectedPlacesSubject.next(JSON.parse(savedPlaces));
      }

      // save selected places to localStorage when it changes
      this.selectedPlaces$.subscribe(places => {
        localStorage.setItem('selectedPlaces', JSON.stringify(places));
      });
    }
  }

  // get selected places
  getSelectedPlaces(): Place[] {
    return this.selectedPlacesSubject.value;
  }

  // add place
  addPlace(place: Place): void {
    const currentPlaces = this.selectedPlacesSubject.value;
    const exists = currentPlaces.some(p => 
      p.lat === place.lat && p.lng === place.lng
    );

    if (!exists) {
      this.selectedPlacesSubject.next([...currentPlaces, place]);
    }
    
    // save to cache
    if (place.placeId) {
      this.placeCache.set(place.placeId, place);
    }
  }

  // remove place
  removePlace(place: Place): void {
    const currentPlaces = this.selectedPlacesSubject.value;
    const updatedPlaces = currentPlaces.filter(p => 
      p.lat !== place.lat || p.lng !== place.lng
    );
    this.selectedPlacesSubject.next(updatedPlaces);
  }

  // clear places
  clearPlaces(): void {
    this.selectedPlacesSubject.next([]);
  }

  // get place from cache
  getCachedPlace(placeId: string): Place | undefined {
    return this.placeCache.get(placeId);
  }

  // save place to cache
  cachePlace(place: Place): void {
    if (place.placeId) {
      this.placeCache.set(place.placeId, place);
    }
  }

  clearCache(): void {
    this.placeCache.clear();
  }
} 