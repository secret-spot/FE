import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface TravelSummary {
  date: Date;
  keywords: string[];
  locations: string[];
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
    date: new Date(),
    keywords: [],
    locations: [],
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // TODO: 실제 데이터는 서비스에서 가져와야 함
    this.summary = {
      date: new Date(),
      keywords: ['자연', '맛집', '문화'],
      locations: ['서울', '부산', '제주'],
      description: '여행 기록에 대한 요약 설명이 들어갑니다.'
    };
  }
  
  onPublish() {
    // TODO: 실제로는 여행 기록을 게시하는 API를 호출하고 응답으로 받은 ID를 사용해야 함
    const guideId = 'temp-guide-id'; // 임시 ID (실제로는 API 응답에서 받아와야 함)
    
    // 가이드 페이지로 이동
    this.router.navigate(['/guide', guideId]);
  }

  onBack(): void {
    this.router.navigate(['/history/record']);
  }
} 