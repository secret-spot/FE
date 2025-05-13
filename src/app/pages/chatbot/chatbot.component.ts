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
    { id: 1, text: 'What travel items do I need?' },
    { id: 2, text: 'How much budget should I plan?' },
    { id: 3, text: 'Tell me about transportation' },
    { id: 4, text: 'When is the best time to avoid crowds?' }
  ];
  
  private apiUrl = "https://basic-radius-459414-h8.du.r.appspot.com/api/v1/chatbot";
  
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    // 초기 메시지 추가
    this.messages.push({
      text: 'Hello! I\'m Spotty.\nHave you found a guide you like?\nShall we start planning transportation, schedule, or travel items?',
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
          text: content || 'Sorry, there was an error generating the answer.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.messages.push({
          text: 'Sorry, there was an error communicating with the server.',
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
          text: content|| 'Sorry, there was an error generating the answer.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.messages.push({
          text: 'Sorry, there was an error communicating with the server.',
          sender: 'bot',
          timestamp: new Date(),
          imageUrl: 'assets/images/bot-avatar.png'
        });
        this.isLoading = false;
      }
    });
  }
}
