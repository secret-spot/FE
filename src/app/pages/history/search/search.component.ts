import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlaceService, Place } from '../../../services/place.service';

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
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    // PlaceService에서 선택된 장소들을 구독
    this.placeService.selectedPlaces$
      .pipe(takeUntil(this.destroy$))
      .subscribe(places => {
        this.selectedPlaces = places;
        console.log('Selected Places:', places);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    // TODO: 실제 검색 API 연동
    this.searchQuery = '';
  }

  onMapClick(): void {
    this.router.navigate(['/history/map']);
  }

  onNext(): void {
    this.router.navigate(['/history/record']);
  }
  
  onBack(): void {
    this.router.navigate(['/history']);
  }
}
