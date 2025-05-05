import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface Review {
  id: number;
  nickname: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Component({
  selector: 'app-review-tab',
  templateUrl: './review-tab.component.html',
  styleUrls: ['./review-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReviewTabComponent implements OnInit {
  @Input() isMyGuide: boolean = false;
  
  reviews: Review[] = [];
  myReview: Review | null = null;
  reviewSummary: string = '요약할 리뷰 수가 충분하지 않습니다.';
  id: number | null = null;
  myReviewStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = parseInt(id || '0');
    if (!id) {
      console.error('ID가 존재하지 않습니다.');
      return;
    }
    this.loadReviews();
  }

  loadReviews(): void {
    this.apiService.get<any>(`guides/${this.id}/reviews`).subscribe((res) => {
      console.log(res);
      this.reviews = res.reviews;
      this.myReview = res.myReview;
      this.reviewSummary = res.summary;
      this.myReviewStatus = res.myReviewStatus;
    });
  }

  navigateToEditReview(): void {
    this.router.navigate([`/post/${this.id}/review`]);
  }

  getStarClass(rating: number, starNumber: number): string {
    return starNumber <= rating ? 'star-filled' : 'star-empty';
  }
}
