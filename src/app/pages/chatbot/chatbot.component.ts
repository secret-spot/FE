import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

interface QuickReply {
  id: number;
  text: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  quickReplies: QuickReply[] = [
    { id: 1, text: '여행 준비물 뭐가 필요할까요?' },
    { id: 2, text: '예산을 얼마정도로 잡을까요?' },
    { id: 3, text: '교통편 알아볼래요' },
    { id: 4, text: '언제 가야 사람이 북적이지 않을까요?' }
  ];
  
  private apiUrl = "https://basic-radius-459414-h8.du.r.appspot.com/api/v1/chatbot";
  
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    // 초기 메시지 추가
    this.messages.push({
      text: '반가워요! Spotty입니다.\n마음에 드는 가이드를 골랐나요?\n그럼 이제 교통편, 일정, 준비물 중 뭐부터 챙겨볼까요?',
      sender: 'bot',
      timestamp: new Date(),
      imageUrl: 'assets/images/bot-avatar.png'
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  
  sendMessage(): void {
    if (this.newMessage.trim() === '') return;
    
    // 사용자 메시지 추가
    this.messages.push({
      text: this.newMessage,
      sender: 'user',
      timestamp: new Date()
    });
    
    // 입력 필드 초기화
    const userMessage = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;
    
    // HTTP 요청 직접 처리
    this.http.post(this.apiUrl, 
      { prompt: userMessage }
    ).subscribe({
      next: (response: any) => {
        console.log(response.content);
        const content = response.content;
        this.messages.push({
          text: content || '죄송합니다. 답변을 생성하는 중에 문제가 발생했습니다.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.messages.push({
          text: '죄송합니다. 서버와의 통신 중 문제가 발생했습니다.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      }
    });
  }
  
  selectQuickReply(reply: QuickReply): void {
    // 선택된 빠른 답변을 메시지로 추가
    this.messages.push({
      text: reply.text,
      sender: 'user',
      timestamp: new Date()
    });
    
    this.isLoading = true;
    
    // HTTP 요청 직접 처리
    this.http.post(this.apiUrl, {
        prompt: reply.text
      }
    ).subscribe({
      next: (response: any) => {
        const content = response.content;
        this.messages.push({
          text: content|| '죄송합니다. 답변을 생성하는 중에 문제가 발생했습니다.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.messages.push({
          text: '죄송합니다. 서버와의 통신 중 문제가 발생했습니다.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      }
    });
  }
}
