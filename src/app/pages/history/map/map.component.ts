/// <reference types="google.maps" />

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PlaceService, Place } from '../../../services/place.service';
import { TravelRecordService } from '../../../services/travel-record.service';
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
    private placeService: PlaceService,
    private travelRecordService: TravelRecordService
  ) {
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript(): void {
    if (typeof window.google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isGoogleMapsLoaded = true;
        this.initializeMap();
      };
      document.head.appendChild(script);
    } else {
      this.isGoogleMapsLoaded = true;
    }
  }

  ngOnInit(): void {
    // log current travel record state
    console.log('Map - Current Travel Record State:', this.travelRecordService.getTempRecord());

    // subscribe to selected places from PlaceService
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
        center: { lat: 37.5665, lng: 126.9780 }, // seoul center coordinates
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      };

      this.map = new google.maps.Map(mapElement, mapOptions);

      // initialize search feature - use Autocomplete instead of SearchBox
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

      // initialize Autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(searchInput, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'kr' } // limit to korea
      });

      // handle place selection event
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete?.getPlace();
        if (!place || !place.geometry?.location) {
          console.log('No place details available');
          return;
        }

        // create selected place information
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
    // check cached place information
    const cachedPlace = this.placeService.getCachedPlace(place.placeId);
    if (cachedPlace) {
      this.placeService.addPlace(cachedPlace);
      // move map center to selected location
      this.map.panTo({ lat: cachedPlace.lat, lng: cachedPlace.lng });
      return;
    }

    // apply debounce to limit API calls
    setTimeout(() => {
      const placeData = this.autocomplete?.getPlace();
      const photo = placeData?.photos?.[0];
      const imageUrl=photo?.getUrl({maxWidth:400});
      const enrichedPlace: Place = {
        ...place,
        imageUrl:imageUrl};
      this.placeService.addPlace(enrichedPlace);
      this.placeService.cachePlace(enrichedPlace);
      
      // move map center to selected location
      this.map.panTo({ lat: place.lat, lng: place.lng });
      
      // log current state after place selection
      console.log('Map - After Place Selection:', this.travelRecordService.getTempRecord());
    }, this.searchDebounceTime);
  }

  removePlace(place: Place): void {
    this.placeService.removePlace(place);
    
    // log current state after place removal
    console.log('Map - After Place Removal:', this.travelRecordService.getTempRecord());
  }

  updateMarkers(): void {
    if (!this.isGoogleMapsLoaded || !this.map) {
      return;
    }

    // remove existing markers
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    // add new markers
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
