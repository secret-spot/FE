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
  isSubmitting: boolean = false;
  
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
    // log current travel record state
    console.log('Travel Record - Current State:', this.travelRecordService.getTempRecord());

    // get temporary saved data
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
      
      // reset input field
      input.value = '';
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    
    // add selected files to FormData
    const formData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      formData.append('images', file.file);
    });
    
    // get temporary saved data
    const tempRecord = this.travelRecordService.getTempRecord();
    
    // create final travel record data (excluding images)
    const finalRecord = {
      startDate: tempRecord.startDate ? tempRecord.startDate.split('T')[0] : this.selectedDate.toISOString().split('T')[0],
      endDate: tempRecord.endDate ? tempRecord.endDate.split('T')[0] : this.selectedDate.toISOString().split('T')[0],
      title: this.travelRecord.title,
      content: this.travelRecord.description,
      places: tempRecord.places || []
    };

    // add JSON data to FormData
    formData.append('data', JSON.stringify(finalRecord));

    // log final state before API call
    console.log('Travel Record - Final State Before API Call:', finalRecord);
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // call API
    this.apiService.post('guides', formData).subscribe({
      next: (response) => {
        console.log('Travel Record - API Response:', response);
        const guideId=response;
        // navigate to loading page
        this.router.navigate(['/history/loading/' + guideId]);
      },
      error: (error) => {
        console.error('Travel Record - API Error:', error);
        this.isSubmitting = false;
        // TODO: handle error (e.g. show notification to user)
      }
    });
  }
  
  onBack() {
    // navigate to previous page (search page)
    this.router.navigate(['/history/search']);
  }
}
