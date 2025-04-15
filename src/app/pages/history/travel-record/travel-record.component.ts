import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-travel-record',
  templateUrl: './travel-record.component.html',
  styleUrls: ['./travel-record.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TravelRecordComponent {
  @Input() selectedDate: Date = new Date();
  
  travelRecord = {
    title: '',
    location: '',
    description: '',
    photos: [] as string[]
  };

  constructor(private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // TODO: 파일 처리 로직 구현
      console.log('Selected files:', input.files);
    }
  }

  onSubmit() {
    // TODO: 여행 기록 저장 로직 구현
    console.log('여행 기록 저장:', this.travelRecord);
    
    // 로딩 페이지로 이동
    this.router.navigate(['/history/loading']);
    
    // 3초 후 요약 페이지로 이동 (실제로는 API 호출 후 이동해야 함)
    setTimeout(() => {
      this.router.navigate(['/history/summary']);
    }, 3000);
  }
  
  onBack() {
    // 이전 페이지로 이동 (검색 페이지)
    this.router.navigate(['/history/search']);
  }
}
