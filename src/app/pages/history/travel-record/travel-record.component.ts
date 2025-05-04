import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TravelRecordService } from '../../../services/travel-record.service';
import { ApiService } from '../../../services/api.service';

interface FilePreview {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-travel-record',
  templateUrl: './travel-record.component.html',
  styleUrls: ['./travel-record.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TravelRecordComponent implements OnInit {
  selectedDate: Date = new Date();
  
  travelRecord = {
    startDate: '',
    endDate: '',
    title: '',
    description: '',
    photos: [] as string[]
  };

  selectedFiles: FilePreview[] = [];

  constructor(
    private router: Router,
    private travelRecordService: TravelRecordService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // 현재 여행 기록 상태 로깅
    console.log('Travel Record - Current State:', this.travelRecordService.getTempRecord());

    // 임시 저장된 데이터 가져오기
    const tempRecord = this.travelRecordService.getTempRecord();
    if (tempRecord.title) {
      this.travelRecord.title = tempRecord.title;
    }
    if (tempRecord.content) {
      this.travelRecord.description = tempRecord.content;
    }
    if (tempRecord.startDate) {
      this.travelRecord.startDate = tempRecord.startDate.split('T')[0];
    }
    if (tempRecord.endDate) {
      this.travelRecord.endDate = tempRecord.endDate.split('T')[0];
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.selectedFiles.push({
            file: file,
            preview: result
          });
        };
        
        reader.readAsDataURL(file);
      }
      
      // 입력 필드 초기화
      input.value = '';
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    // 선택된 파일들을 FormData에 추가
    const formData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      formData.append('images', file.file);
    });
    
    // 임시 저장된 데이터 가져오기
    const tempRecord = this.travelRecordService.getTempRecord();
    
    // 최종 여행 기록 데이터 생성 (images 제외)
    const finalRecord = {
      startDate: tempRecord.startDate ? tempRecord.startDate.split('T')[0] : this.selectedDate.toISOString().split('T')[0],
      endDate: tempRecord.endDate ? tempRecord.endDate.split('T')[0] : this.selectedDate.toISOString().split('T')[0],
      title: this.travelRecord.title,
      content: this.travelRecord.description,
      places: tempRecord.places || []
    };

    // JSON 데이터를 FormData에 추가
    formData.append('data', JSON.stringify(finalRecord));

    // API 호출 전 최종 상태 로깅
    console.log('Travel Record - Final State Before API Call:', finalRecord);
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // API 호출
    this.apiService.post('guides', formData).subscribe({
      next: (response) => {
        console.log('Travel Record - API Response:', response);
        const guideId=response;
        // 로딩 페이지로 이동
        this.router.navigate(['/history/loading/' + guideId]);

       
      },
      error: (error) => {
        console.error('Travel Record - API Error:', error);
        // TODO: 에러 처리 (예: 사용자에게 알림 표시)
      }
    });
  }
  
  onBack() {
    // 이전 페이지로 이동 (검색 페이지)
    this.router.navigate(['/history/search']);
  }
}
