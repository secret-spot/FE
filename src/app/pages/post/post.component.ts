import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { GuideTabComponent } from './guide-tab/guide-tab.component';
import { QnaTabComponent } from './qna-tab/qna-tab.component';
import { ReviewTabComponent } from './review-tab/review-tab.component'
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google: typeof google;
  }
}

@Component({
  selector: 'app-guide-page',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, GuideTabComponent, QnaTabComponent, ReviewTabComponent]
})
export class PostComponent implements OnInit {
  id: string = '';
  isScraped: boolean = false;
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
  private placesService: google.maps.places.PlacesService | null = null;

  // Q&A 데이터
  questions: any[] = [];
  // 리뷰 데이터
  reviews: any[] = [];
  myReview: any = null;
  summaryReview: string = '요약할 리뷰 수가 충분하지 않습니다.';
  myReviewStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript(): void {
    if (typeof window.google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const map = new google.maps.Map(document.createElement('div'));
        this.placesService = new google.maps.places.PlacesService(map);
      };
      document.head.appendChild(script);
    } else {
      const map = new google.maps.Map(document.createElement('div'));
      this.placesService = new google.maps.places.PlacesService(map);
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('ID does not exist.');
      return;
    }
    this.id = id;
    
    // get guide basic information
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
        this.isScraped = data.isScraped;

        const start = new Date(this.startDate + 'T00:00:00');
        const end = new Date(this.endDate + 'T00:00:00');
        const diffTime = end.getTime() - start.getTime();
        this.tripDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // get place image URL
        this.loadPlacesImages();

        // get Q&A data
        this.loadQuestions();
        // get review data
        this.loadReviews();
      },
      error: (err) => {
        console.error('Error occurred while summarizing travel record:', err);
      }
    });
  }

  private loadQuestions() {
    this.apiService.get<any>(`guides/${this.id}/qnas`).subscribe({
      next: (data) => {
        this.questions = data;
      },
      error: (err) => {
        console.error('Error occurred while loading Q&A data:', err);
      }
    });
  }

  private loadReviews() {
    this.apiService.get<any>(`guides/${this.id}/reviews`).subscribe({
      next: (data) => {
        this.reviews = data.reviews;
        this.myReview = data.myReview;
        this.summaryReview = data.summaryReview;
        this.myReviewStatus = data.myReviewStatus;
      },
      error: (err) => {
        console.error('Error occurred while loading review data:', err);
      }
    });
  }

  private loadPlacesImages() {
    this.places.forEach(place => {
      if (place.googlePlaceId && !place.imageUrl) {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: place.googlePlaceId,
          fields: ['photos']
        };

        this.placesService?.getDetails(request, (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result?.photos?.[0]) {
            const photo = result.photos[0];
            place.imageUrl = photo.getUrl({ maxWidth: 400 });
          }
        });
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

  onScrapFalse(){
    this.apiService.delete<any>(`guides/${this.id}/scraps`).subscribe({
      next: (data) => {
        console.log(data);
        this.isScraped = false;
      },
      error: (err) => {
        console.error('Error occurred while scraping:', err);
      }
    });
  }

  onScrapTrue(){
    this.apiService.post<any>(`guides/${this.id}/scraps`, {}).subscribe({
      next: (data) => {
        console.log(data);
        this.isScraped = true;
      },
      error: (err) => {
        console.error('Error occurred while scraping:', err);
      }
    });
  }

  onQuestionSubmitted(): void {
    // Reload questions when a new question is submitted
    this.loadQuestions();
  }

}