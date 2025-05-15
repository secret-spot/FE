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

  // create travel record
  createTravelRecord(formData: FormData): Observable<any> {
    console.log('TravelRecordService - Creating Travel Record:', formData);
    return this.apiService.post('guides', formData);
  }

  // set dates
  setDates(startDate: string, endDate: string) {
    this.tempRecord.startDate = startDate;
    this.tempRecord.endDate = endDate;
    console.log('TravelRecordService - Dates Set:', this.tempRecord);
  }

  // set title
  setTitle(title: string): void {
    this.tempRecord.title = title;
  }

  // set content
  setContent(content: string): void {
    this.tempRecord.content = content;
  }

  // set images
  setImages(images: string[]): void {
    this.tempRecord.images = images;
  }

  // set places
  setPlaces(places: TravelPlace[]) {
    // keep original date information
    const startDate = this.tempRecord.startDate;
    const endDate = this.tempRecord.endDate;
    
    // update with new places
    this.tempRecord.places = places;
    
    // restore date information
    this.tempRecord.startDate = startDate;
    this.tempRecord.endDate = endDate;
    
    console.log('TravelRecordService - Places Set:', this.tempRecord);
  }

  // get temporary saved data
  getTempRecord(): TravelRecord {
    return this.tempRecord;
  }

  // clear temporary saved data
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