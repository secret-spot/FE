import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface Question {
  id: number;
  question: string;
  author: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
  questionerProfileImageUrl?: string;
}

@Component({
  selector: 'app-qna-tab',
  templateUrl: './qna-tab.component.html',
  styleUrls: ['./qna-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class QnaTabComponent implements OnInit {
  @Input() isMyGuide: boolean = false;


  questions: Question[] = [];
  newQuestion: string = '';
  selectedQuestion: Question | null = null;
  answerText: string = '';
  id: number | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // TODO: Load questions from API
    const id = this.route.snapshot.paramMap.get('id');
    this.id = parseInt(id || '0');
    if (!id) {
      console.error('ID가 존재하지 않습니다.');
      return;
    }
    this.loadQuestions();
  }

  loadQuestions(): void {
    // Mock data for testing
    this.apiService.get<any>(`guides/${this.id}/qnas`).subscribe((res) => {
      console.log(res);
      this.questions = res;
    });
  }

  submitQuestion(): void {
    if (!this.newQuestion.trim()) return;
    this.apiService.post<any>(`guides/${this.id}/qnas`, {
      question: this.newQuestion,
    }).subscribe((res) => {
      console.log(res);
    });

    const newQ: Question = {
      id: this.questions.length + 1,
      question: this.newQuestion,
      author: '현재 사용자', // TODO: Get from auth service
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.questions.unshift(newQ);
    this.newQuestion = '';
  }

  selectQuestion(question: Question): void {
    if (!this.isMyGuide) return;
    this.selectedQuestion = question;
    this.answerText = question.answer || '';
  }

  submitAnswer(): void {
    if (!this.selectedQuestion || !this.answerText.trim()) return;

    const question = this.questions.find(q => q.id === this.selectedQuestion?.id);
    if (question) {
      question.answer = this.answerText;
      question.answeredAt = new Date().toISOString().split('T')[0];
    }
    this.apiService.patch<any>(`guides/${this.id}/qnas/${this.selectedQuestion?.id}/answer`, {
      answer: this.answerText,
    }).subscribe((res) => {
      console.log(res);
    });

    this.selectedQuestion = null;
    this.answerText = '';
  }

  cancelAnswer(): void {
    this.selectedQuestion = null;
    this.answerText = '';
  }
}
