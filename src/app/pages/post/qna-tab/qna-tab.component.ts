import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class QnaTabComponent {
  @Input() isMyGuide: boolean = false;
  @Input() questions: Question[] = [];
  @Output() questionSubmitted = new EventEmitter<void>();

  newQuestion: string = '';
  selectedQuestion: Question | null = null;
  answerText: string = '';
  id: number | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = parseInt(id || '0');
  }

  submitQuestion(): void {
    if (!this.newQuestion.trim()) return;
    this.apiService.post<any>(`guides/${this.id}/qnas`, {
      question: this.newQuestion,
    }).subscribe({
      next: (res) => {
        console.log(res);
        const newQ: Question = {
          id: this.questions.length + 1,
          question: this.newQuestion,
          author: '현재 사용자', // TODO: Get from auth service
          createdAt: new Date().toISOString().split('T')[0]
        };

        this.questions.unshift(newQ);
        this.newQuestion = '';
        this.questionSubmitted.emit(); // Emit event after successful submission
      },
      error: (err) => {
        console.error('Error submitting question:', err);
      }
    });
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
