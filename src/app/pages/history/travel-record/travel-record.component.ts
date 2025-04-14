import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  }
}
