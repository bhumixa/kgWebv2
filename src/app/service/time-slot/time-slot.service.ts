import { Injectable } from '@angular/core';
import * as moment from 'moment';

export interface TimeSlot {
  slot: string;
  startTime: string;
  canBook: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TimeSlotService {
  formatTime(time: string) {
    const [hour, min] = time.split(':');
    const newHour = Number(hour) % 24;
    return (newHour % 12 || 12) + ':' + min + (newHour < 12 ? 'AM' : 'PM');
  }

  generateTimeSlot(
    slotIterval: number,
    openTime: string,
    closeTime: string
  ): TimeSlot[] {
    const startTime = moment(openTime, 'HH:mm');
    const endTime = moment(closeTime, 'HH:mm');

    //   const subAllTimes: string[] = [];
    const allTime: TimeSlot[] = [];

    while (startTime < endTime) {
      const obj: TimeSlot = {
        slot: '',
        startTime: startTime.format('HH:mm'),
        canBook: true,
      };
      const formatedTime_1 = this.formatTime(startTime.format('HH:mm'));
      const formatedTime_2 = this.formatTime(
        startTime.add(slotIterval, 'minutes').format('HH:mm')
      );
      obj.slot = `${formatedTime_1} - ${formatedTime_2}`;

      // allTime.push(`${formatedTime_1} - ${formatedTime_2}`);
      allTime.push(obj);
    }

    return allTime;
  }
}
