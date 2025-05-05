import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditReviewComponent implements OnInit {
  rating: number = 0;
  comment: string = '';
  id: number | null = null;
  hoveredRating: number = 0;

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
    
  }



  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarClass(starNumber: number): string {
    const rating = this.hoveredRating || this.rating;
    return starNumber <= rating ? 'star-filled' : 'star-empty';
  }

  submitReview(): void {
    if (this.rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    this.apiService.post<any>(`guides/${this.id}/reviews`, {
      rating: this.rating,
      content: this.comment
    }).subscribe({
      next: () => {
        this.router.navigate([`/post/${this.id}`]);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        alert('리뷰 등록에 실패했습니다.');
      }
    });
  }

  onBack(): void {
    this.router.navigate([`/post/${this.id}`]);
  }
} 