import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { GuideTabComponent } from './guide-tab/guide-tab.component';
import { QnaTabComponent } from './qna-tab/qna-tab.component';
import { ReviewTabComponent } from './review-tab/review-tab.component'

@Component({
  selector: 'app-guide-page',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  standalone: true,
  imports: [CommonModule, GuideTabComponent, QnaTabComponent, ReviewTabComponent]
})
export class PostComponent implements OnInit{
  activeTab = 'guide';
  tripDuration: number = 0;
  title: string = '';
  startDate: string = '';
  endDate: string = '';
  content: string = '';
  keywords: string[] = [];
  reviewRating: number = 0;
  images: string[] = [];
  nickname: string = '사용자';
  regions: string[] = [];
  places: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID가 존재하지 않습니다.');
      return;
    }
    this.apiService.get<any>(`guides/${id}`).subscribe({
      next: (data) => {
        console.log(data);
        this.title = data.title;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.content = data.content;
        this.keywords = data.keywords;
        this.reviewRating = data.reviewRating;
        this.images = data.images;
        this.regions = data.regions.map((region: any) => region.region);
        this.places = data.places;


        const start = new Date(this.startDate + 'T00:00:00');
        const end = new Date(this.endDate + 'T00:00:00');
        const diffTime = end.getTime() - start.getTime();
        this.tripDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        
     
      },
      error: (err) => {
        console.error('여행 기록 요약 중 오류 발생:', err);
      }
    });
  }

  onBack(){
    this.router.navigate(['/home']);
  }
  
  
}