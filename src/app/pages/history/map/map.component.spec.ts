import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { Router } from '@angular/router';
import { PlaceService } from '../../../services/place.service';
import { of } from 'rxjs';
import 'jasmine';

// Mock Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let placeServiceSpy: jasmine.SpyObj<PlaceService>;

  beforeEach(() => {
    // Create spy objects
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    placeServiceSpy = jasmine.createSpyObj('PlaceService', [], {
      selectedPlaces$: of([])
    });

    // Mock Google Maps API
    window.google = {
      maps: {
        Map: class {
          constructor(element: HTMLElement, options?: google.maps.MapOptions) {}
          static DEMO_MAP_ID = 'demo-map-id';
        },
        Marker: class {
          constructor(options?: google.maps.MarkerOptions) {}
          static MAX_ZINDEX = 1000;
        },
        LatLng: class {
          lat: number;
          lng: number;
          constructor(lat: number, lng: number) {
            this.lat = lat;
            this.lng = lng;
          }
          equals(other: google.maps.LatLng): boolean {
            return this.lat === other.lat() && this.lng === other.lng();
          }
          toJSON(): google.maps.LatLngLiteral {
            return { lat: this.lat, lng: this.lng };
          }
          toUrlValue(): string {
            return `${this.lat},${this.lng}`;
          }
        }
      }
    } as any;

    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PlaceService, useValue: placeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to history page when back button is clicked', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/history']);
  });

  it('should update markers when selected places change', () => {
    const mockPlaces = [
      { 
        id: 1, 
        name: 'Place 1', 
        address: 'Address 1',
        lat: 37.5665, 
        lng: 126.9780,
        placeId: 'place1'
      },
      { 
        id: 2, 
        name: 'Place 2', 
        address: 'Address 2',
        lat: 37.5512, 
        lng: 126.9882,
        placeId: 'place2'
      }
    ];
    
    placeServiceSpy.selectedPlaces$ = of(mockPlaces);
    component.updateMarkers();
    
    // Verify that markers are created for each place
    expect(component.markers.length).toBe(mockPlaces.length);
  });
});
