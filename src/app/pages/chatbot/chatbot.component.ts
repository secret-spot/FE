import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  quickReplies: QuickReply[] = [
    { id: 1, text: '여행 계획을 어떻게 세우면 좋을까요?' },
    { id: 2, text: '인기 있는 관광지 추천해주세요' },
    { id: 3, text: '맛집 추천해주세요' },
    { id: 4, text: '교통편은 어떻게 이용하면 좋을까요?' }
  ];
  
  constructor() { }
  
  ngOnInit(): void {
    // 초기 메시지 추가
    this.messages.push({
      text: '안녕하세요! 여행에 관한 질문이 있으시면 아래 선택지에서 선택하거나 직접 입력해주세요.',
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
    this.newMessage = '';
    
    // 봇 응답 시뮬레이션 (실제로는 API 호출 등으로 대체)
    setTimeout(() => {
      this.messages.push({
        text: '죄송합니다. 아직 해당 질문에 대한 답변을 준비 중입니다. 다른 질문을 해주세요.',
        sender: 'bot',
        timestamp: new Date(),
        imageUrl: 'assets/images/bot-avatar.png'
      });
    }, 1000);
  }
  
  selectQuickReply(reply: QuickReply): void {
    // 선택된 빠른 답변을 메시지로 추가
    this.messages.push({
      text: reply.text,
      sender: 'user',
      timestamp: new Date()
    });
    
    // 봇 응답 시뮬레이션 (실제로는 API 호출 등으로 대체)
    setTimeout(() => {
      this.messages.push({
        text: '죄송합니다. 아직 해당 질문에 대한 답변을 준비 중입니다. 다른 질문을 해주세요.',
        sender: 'bot',
        timestamp: new Date(),
        imageUrl: 'assets/images/bot-avatar.png'
      });
    }, 1000);
  }
}
