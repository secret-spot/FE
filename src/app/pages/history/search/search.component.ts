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
    // 현재 여행 기록 상태 로깅
    console.log('Search - Current Travel Record State:', this.travelRecordService.getTempRecord());

    // PlaceService에서 선택된 장소들을 구독
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
    // TODO: 실제 검색 API 연동
    this.searchQuery = '';
  }

  onMapClick(): void {
    this.router.navigate(['/history/map']);
  }

  onNext(): void {
    // 현재 저장된 여행 기록 가져오기
    const currentRecord = this.travelRecordService.getTempRecord();
    
    // 선택된 장소들을 TravelPlace 형식으로 변환
    const places = this.selectedPlaces.map(place => ({
      googlePlaceId: place.placeId,
      name: place.name,
      address: place.address,
      reviewNum: place.reviewCount || 0
    }));

    // 기존 날짜 정보를 유지하면서 장소 정보만 업데이트
    this.travelRecordService.setPlaces(places);
    
    // 저장 후 상태 로깅
    console.log('Search - State After Setting Places:', this.travelRecordService.getTempRecord());
    
    // 여행 기록 페이지로 이동
    this.router.navigate(['/history/record']);
  }
  
  onBack(): void {
    this.router.navigate(['/history']);
  }

  removePlace(place: Place): void {
    this.placeService.removePlace(place);
  }
}
