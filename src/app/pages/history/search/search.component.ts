import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlaceService, Place } from '../../../services/place.service';
import { TravelRecordService, TravelPlace } from '../../../services/travel-record.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchQuery: string = '';
  selectedPlaces: Place[] = [];

  constructor(
    private router: Router,
    private placeService: PlaceService,
    private travelRecordService: TravelRecordService
  ) {}

  ngOnInit(): void {
    // log current travel record state
    console.log('Search - Current Travel Record State:', this.travelRecordService.getTempRecord());

    // subscribe to selected places from PlaceService
    this.placeService.selectedPlaces$
      .pipe(takeUntil(this.destroy$))
      .subscribe(places => {
        this.selectedPlaces = places;
        console.log('Search - Selected Places:', places);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    // TODO: connect actual search API
    this.searchQuery = '';
  }

  onMapClick(): void {
    this.router.navigate(['/history/map']);
  }

  onNext(): void {
    // get current saved travel record
    const currentRecord = this.travelRecordService.getTempRecord();
    
    // convert selected places to TravelPlace format
    const places = this.selectedPlaces.map(place => ({
      googlePlaceId: place.placeId,
      name: place.name,
      address: place.address,
      reviewNum: place.reviewCount || 0
    }));

    // update places information while keeping existing date information
    this.travelRecordService.setPlaces(places);
    
    // log current state after saving
    console.log('Search - State After Setting Places:', this.travelRecordService.getTempRecord());
    
    // navigate to travel record page
    this.router.navigate(['/history/record']);
  }
  
  onBack(): void {
    this.router.navigate(['/history']);
  }

  removePlace(place: Place): void {
    this.placeService.removePlace(place);
  }
}
