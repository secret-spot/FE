import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TravelPlace {
  googlePlaceId: string;
  name: string;
  address: string;
  reviewNum: number;
}

export interface TravelRecord {
  startDate: string;
  endDate: string;
  title: string;
  content: string;
  images: string[];
  places: TravelPlace[];
}

@Injectable({
  providedIn: 'root'
})
export class TravelRecordService {
  private tempRecord: TravelRecord = {
    startDate: '',
    endDate: '',
    title: '',
    content: '',
    images: [],
    places: []
  };

  constructor(private apiService: ApiService) {}

  // 여행 기록 생성
  createTravelRecord(record: TravelRecord): Observable<any> {
    return this.apiService.post('guides', record);
  }

  // 날짜 설정
  setDates(startDate: string, endDate: string) {
    this.tempRecord.startDate = startDate;
    this.tempRecord.endDate = endDate;
    console.log('TravelRecordService - Dates Set:', this.tempRecord);
  }

  // 제목 설정
  setTitle(title: string): void {
    this.tempRecord.title = title;
  }

  // 내용 설정
  setContent(content: string): void {
    this.tempRecord.content = content;
  }

  // 이미지 설정
  setImages(images: string[]): void {
    this.tempRecord.images = images;
  }

  // 장소 설정
  setPlaces(places: TravelPlace[]) {
    // 기존 날짜 정보 유지
    const startDate = this.tempRecord.startDate;
    const endDate = this.tempRecord.endDate;
    
    // 새로운 places로 업데이트
    this.tempRecord.places = places;
    
    // 날짜 정보 복원
    this.tempRecord.startDate = startDate;
    this.tempRecord.endDate = endDate;
    
    console.log('TravelRecordService - Places Set:', this.tempRecord);
  }

  // 임시 저장된 데이터 가져오기
  getTempRecord(): TravelRecord {
    return this.tempRecord;
  }

  // 임시 저장된 데이터 초기화
  clearTempRecord(): void {
    this.tempRecord = {
      startDate: '',
      endDate: '',
      title: '',
      content: '',
      images: [],
      places: []
    };
  }
} 