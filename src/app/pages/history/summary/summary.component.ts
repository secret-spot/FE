import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface TravelSummary {
  startDate: string;
  endDate: string;
  keywords: string[];
  regions: string[];
  description: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SummaryComponent implements OnInit {
  summary: TravelSummary = {
    startDate: '',
    endDate: '',
    keywords: [],
    regions: [],
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // TODO: 실제 데이터는 서비스에서 가져와야 함
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID가 존재하지 않습니다.');
      return;
    }
    this.apiService.get<any>(`guides/${id}`).subscribe({
      next: (data) => {
        console.log(data);
        this.summary.keywords = data.keywords;
        this.summary.regions = data.regions.map((r: any) => `${r.country}, ${r.region}`);
        this.summary.startDate = data.startDate;
        this.summary.endDate = data.endDate;
        console.log(this.summary.regions)
      },
      error: (err) => {
        console.error('여행 기록 요약 중 오류 발생:', err);
      }
    });

  }
  
  onPublish() {
    // TODO: 실제로는 여행 기록을 게시하는 API를 호출하고 응답으로 받은 ID를 사용해야 함

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID가 존재하지 않습니다.');
      return;
    }
    // 가이드 페이지로 이동
    this.router.navigate(['/post', id]);
  }

  onBack(): void {
    this.router.navigate(['/history/record']);
  }
} 