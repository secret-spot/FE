import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface Review {
  id: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
  profileImageUrl: string;
}

@Component({
  selector: 'app-review-tab',
  templateUrl: './review-tab.component.html',
  styleUrls: ['./review-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReviewTabComponent {
  @Input() isMyGuide: boolean = false;
  @Input() reviews: any[] = [];
  @Input() myReview: any = null;
  @Input() summaryReview: string = 'There are not enough reviews to summarize.';
  @Input() myReviewStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  navigateToEditReview(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/post/${id}/review`]);
  }

  getStarClass(rating: number, starNumber: number): string {
    return starNumber <= rating ? 'star-filled' : 'star-empty';
  }
}
