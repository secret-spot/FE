import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RankingComponent implements OnInit {
  rankings: any[] = [];
  loading = false;
  error = '';
  showModal = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadRankings();
  }

  loadRankings(): void {
    this.loading = true;
    this.error = '';
    
    this.apiService.get('rankings').subscribe({
      next: (response: any) => {
        console.log(response);
        this.rankings = response;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Failed to load rankings.';
        this.loading = false;
        console.error('Error loading rankings:', err);
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  
  onBack(): void {
    this.router.navigate(['/home']);
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }
} 