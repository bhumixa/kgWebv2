import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonInput, IonTextarea, ModalController } from '@ionic/angular';

import {
  TimeSlotService,
  TimeSlot,
} from 'src/app/service/time-slot/time-slot.service';
import * as moment from 'moment';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { ConfigServiceService } from 'src/app/service/config-service.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss'],
})
export class BookAppointmentComponent implements OnInit {
  @ViewChild('mailTextarea') mailTextarea: IonTextarea;
  @ViewChild('mailInput') mailInput: IonInput;

  @Input() formData: any;
  @Input() refCompanyId: number;
  @Input() isExcel: boolean = false;
  @Input() isMail: boolean = false;
  @Input() isStoneSelected: Input;
  @Input() sendBtn: boolean = false;
  @Input() userEmail: string = '';
  @Input() numOfSelectedStone: number = 0;
  @Input() totalNumOfStones: number = 0;
  @Input() salesPersonEmail: string = '';
  @Input() pageSize: number = 0;

  timeRange: { slotInterval: number; openTime: string; closeTime: string } = {
    slotInterval: 30,
    openTime: '09:30',
    closeTime: '16:30',
  };
  stoneIdArr: string[] = [];
  dateToday: string;
  dateTommorow: string;
  timeRangeArr: TimeSlot[][] = [];
  timeRanges: TimeSlot[][] = [];
  prevDate: any = '';
  prevTime: any = '';
  showException: boolean = false;
  finalData: {
    userId: number;
    stoneDetails: any;
    date: string;
    timeSlot: string;
    note: string;
    refCompanyId: number;
  } = {
    userId: null,
    stoneDetails: [],
    date: '',
    timeSlot: '',
    note: '',
    refCompanyId: null,
  };
  textareaRows: number = 6;
  isMobileView: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private timeSlotService: TimeSlotService,
    private databaseService: DatabaseServiceService,
    private configService: ConfigServiceService,
    private renderer: Renderer2
  ) {}

  formatTimeRangeArray() {
    const timeArr = this.timeSlotService.generateTimeSlot(
      this.timeRange.slotInterval,
      this.timeRange.openTime,
      this.timeRange.closeTime
    );

    for (let i = 0; i < timeArr.length; i = i + 2) {
      this.timeRanges.push([timeArr[i], timeArr[i + 1]]);
      this.timeRangeArr = JSON.parse(JSON.stringify(this.timeRanges));
    }

    // console.log(this.timeRangeArr);
  }

  ngOnInit() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 768) {
      this.textareaRows = 4;
    }
    if (innerWidth < 576) {
      this.isMobileView = true;
    }

    if (!this.isExcel && !this.isMail) {
      this.formatTimeRangeArray();
      this.stoneIdArr = this.formData.stones.map(
        (stone: any) => stone.stoneName
      );
      const today: Date = new Date();
      const tommorow: Date = new Date(today);
      tommorow.setDate(today.getDate() + 1);

      this.dateToday = moment(today).format('DD-MM-YYYY');
      this.dateTommorow = moment(tommorow).format('DD-MM-YYYY');
      this.finalData.stoneDetails = this.formData.stones;
      this.finalData.userId = this.formData.userId;
      this.finalData.refCompanyId = this.refCompanyId;
    }
  }

  onClose(data: any = null, closingType: string = 'close') {
    this.modalCtrl.dismiss(data, closingType);
  }

  onNoteChange(event: any) {
    console.log(event, event.target.value);
    this.finalData.note = event.target.value;
  }

  selectDate(event: any) {
    if (!!this.prevDate) {
      this.prevDate.style.backgroundColor = '#0000000a';
      this.prevDate.style.color = '#000000';
    }
    console.log(event, event.target.innerText);
    event.target.style.backgroundColor = '#00A5C8';
    event.target.style.color = '#ffffff';

    this.prevDate = event.target;
    this.finalData.date = event.target.innerText;

    const currDate = new Date().getDate();
    const date = Number(this.finalData.date.split('-')[0]);
    this.finalData.timeSlot = '';

    if (currDate === date) {
      const currHour = new Date().getHours();
      const currMinute = new Date().getMinutes();
      this.timeRangeArr = this.timeRangeArr.map((timeArr: TimeSlot[]) => {
        const newTimeArr = timeArr.map((slot: TimeSlot) => {
          const [hour, minute] = slot.startTime.split(':');
          if (Number(hour) === currHour && Number(minute) - currMinute < 30) {
            slot.canBook = false;
          } else if (
            Number(hour) - 1 === currHour &&
            currMinute >= 30 &&
            minute === '00'
          ) {
            slot.canBook = false;
          } else if (Number(hour) < currHour) {
            slot.canBook = false;
          }
          return slot;
        });

        return newTimeArr;
      });
    } else {
      this.timeRangeArr = JSON.parse(JSON.stringify(this.timeRanges));
    }
  }

  selectTime(event: any, slot: TimeSlot) {
    if (slot.canBook) {
      if (!!this.prevTime) {
        this.prevTime.style.backgroundColor = '#0000000a';
        this.prevTime.style.color = '#000000';
      }
      console.log(event, event.target.innerText);
      event.target.style.backgroundColor = '#00A5C8';
      event.target.style.color = '#ffffff';
      this.prevTime = event.target;
      this.finalData.timeSlot = event.target.innerText;
    }
  }

  onBooking() {
    const isAllStoneFromMumbai = this.finalData.stoneDetails.every(
      (stone: any) => stone.location === 'mumbai'
    );
    this.configService.showLoading();
    this.databaseService
      .postBookAppointment(this.finalData)
      .then((data: any) => {
        this.configService.hideLoading();
        if (data.isSuccess) {
          if (isAllStoneFromMumbai) {
            this.configService.presentToast(data.data, 'success');
            this.onClose(null, 'closeedAfterBooking');
          }
          this.configService.presentToast(data.data, 'success');
          this.showException = true;
          const modalWrapper = document.querySelector('.modal-wrapper');
          this.renderer.addClass(modalWrapper, 'custom-modal-height');
        } else {
          this.configService.presentToast(data.error, 'error');
        }
        //this.onClose(null, 'closeedAfterBooking');
      });
  }

  onExport() {
    this.onClose(null, 'export');
  }

  onSendNow() {
    this.onClose(null, 'sendNow');
  }

  onSendEmail() {
    console.log(this.mailInput.value);
    this.onClose(
      { message: this.mailTextarea?.value, sendEmail: this.mailInput?.value },
      'sendEmail'
    );
  }

  onSendEmailAll() {
    this.onClose(
      { message: this.mailTextarea?.value, sendEmail: this.mailInput?.value },
      'sendEmailAll'
    );
  }
}
