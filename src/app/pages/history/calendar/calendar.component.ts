import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
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

  isSelected(date: Date): boolean {
    return this.isStartDate(date) || this.isEndDate(date);
  }

  isStartDate(date: Date): boolean {
    return this.startDate ? 
      date.getDate() === this.startDate.getDate() && 
      date.getMonth() === this.startDate.getMonth() && 
      date.getFullYear() === this.startDate.getFullYear() : false;
  }

  isEndDate(date: Date): boolean {
    return this.endDate ? 
      date.getDate() === this.endDate.getDate() && 
      date.getMonth() === this.endDate.getMonth() && 
      date.getFullYear() === this.endDate.getFullYear() : false;
  }

  isInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    
    return date > this.startDate && date < this.endDate;
  }

  clearDates(): void {
    this.startDate = null;
    this.endDate = null;
  }

  onNext(): void {
    if (this.startDate && this.endDate) {
      this.router.navigate(['/history/search']);
    }
  }
}
