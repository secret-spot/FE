import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TravelRecordService } from '../../../services/travel-record.service';

interface CalendarDay {
  date: Date;
  isOtherMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<{startDate: Date, endDate: Date}>();
  
  weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  calendarDays: CalendarDay[] = [];
  
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private router: Router,
    private travelRecordService: TravelRecordService
  ) {
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    
    // 이전 달의 마지막 날짜들
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    if (firstDayOfWeek > 0) {
      const prevMonth = new Date(this.currentYear, this.currentMonth, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        this.calendarDays.push({
          date: new Date(this.currentYear, this.currentMonth - 1, prevMonthDays - i),
          isOtherMonth: true
        });
      }
    }
    
    // 현재 달의 날짜들
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const lastDate = lastDay.getDate();
    
    for (let i = 1; i <= lastDate; i++) {
      this.calendarDays.push({
        date: new Date(this.currentYear, this.currentMonth, i),
        isOtherMonth: false
      });
    }
    
    // 다음 달의 시작 날짜들
    const lastDayOfWeek = lastDay.getDay();
    if (lastDayOfWeek < 6) {
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        this.calendarDays.push({
          date: new Date(this.currentYear, this.currentMonth + 1, i),
          isOtherMonth: true
        });
      }
    }
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendarDays();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDays();
  }

  selectDate(date: Date): void {
    if (!this.startDate || (this.startDate && this.endDate)) {
      // 새로운 날짜 범위 시작
      this.startDate = new Date(date);
      this.endDate = null;
    } else {
      // 종료 날짜 선택
      if (date < this.startDate) {
        // 시작 날짜보다 이전 날짜를 선택한 경우
        this.endDate = this.startDate;
        this.startDate = new Date(date);
      } else {
        this.endDate = new Date(date);
      }
      
      // 날짜 선택 이벤트 발생
      this.dateSelected.emit({
        startDate: this.startDate,
        endDate: this.endDate
      });
    }
  }

  clearDates(): void {
    this.startDate = null;
    this.endDate = null;
  }

  isSelected(date: Date): boolean {
    if (!this.startDate && !this.endDate) return false;
    
    if (this.startDate && !this.endDate) {
      return this.isSameDay(date, this.startDate);
    }
    
    return this.isSameDay(date, this.startDate!) || this.isSameDay(date, this.endDate!);
  }

  isInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    
    return date > this.startDate && date < this.endDate;
  }

  isStartDate(date: Date): boolean {
    if (!this.startDate) return false;
    return this.isSameDay(date, this.startDate);
  }

  isEndDate(date: Date): boolean {
    if (!this.endDate) return false;
    return this.isSameDay(date, this.endDate);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  onNext(): void {
    if (this.startDate && this.endDate) {
      // TravelRecordService에 날짜 정보 저장
      this.travelRecordService.setDates(
        this.startDate.toISOString(),
        this.endDate.toISOString()
      );
      
      // 검색 페이지로 이동
      this.router.navigate(['/history/search']);
    }
  }
  
  onBack(): void {
    // 홈 페이지로 이동
    this.router.navigate(['/home']);
  }
}
