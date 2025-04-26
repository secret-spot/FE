import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
export class TravelRecordComponent {
  @Input() selectedDate: Date = new Date();
  
  travelRecord = {
    title: '',
    description: '',
    photos: [] as string[]
  };

  selectedFiles: FilePreview[] = [];

  constructor(private router: Router) {}

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
    // 선택된 파일들을 travelRecord.photos에 추가
    this.travelRecord.photos = this.selectedFiles.map(file => file.preview);
    
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
