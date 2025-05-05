import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { GuideTabComponent } from './guide-tab/guide-tab.component';
import { QnaTabComponent } from './qna-tab/qna-tab.component';
import { ReviewTabComponent } from './review-tab/review-tab.component'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guide-page',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, GuideTabComponent, QnaTabComponent, ReviewTabComponent]
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
  userName: string = '';
  userImage: string = '';
  regions: string[] = [];
  places: any[] = [];
  isMyGuide: boolean = false;
  currentImageIndex: number = 0;
  touchStartX: number = 0;
  touchEndX: number = 0;
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
        this.userName = data.userName;
        this.userImage = data.userImage;
        this.isMyGuide = data.isMyGuide;


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
  
  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && this.currentImageIndex < this.images.length - 1) {
        // Swipe left
        this.currentImageIndex++;
      } else if (diff < 0 && this.currentImageIndex > 0) {
        // Swipe right
        this.currentImageIndex--;
      }
    }
  }
}