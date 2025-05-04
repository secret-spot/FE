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
  message = '여행 기록을 분석하고 있습니다...';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const data = {};
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID가 존재하지 않습니다.');
      return;
    }
  
    this.apiService.post<any>(`guides/${id}/analyze`,data).subscribe({
      next: (data) => {
        console.log('분석 결과:', data);
        // 분석 완료 후 이동
        setTimeout(() => {
          this.router.navigate(['/history/summary/'+id]);
        }, 3000);
      },
      error: (err) => {
        console.error('여행 기록 분석 중 오류 발생:', err);
      }
    });
  }
} 