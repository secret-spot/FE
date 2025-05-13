import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingComponent implements OnInit{
  message = 'Analyzing your travel history...';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const data = {};
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID does not exist.');
      return;
    }
  
    this.apiService.post<any>(`guides/${id}/analyze`,data).subscribe({
      next: (data) => {
        console.log('Analysis result:', data);
        // 분석 완료 후 이동
        setTimeout(() => {
          this.router.navigate(['/history/summary/'+id]);
        }, 3000);
      },
      error: (err) => {
        console.error('Error occurred while analyzing travel history:', err);
      }
    });
  }
} 