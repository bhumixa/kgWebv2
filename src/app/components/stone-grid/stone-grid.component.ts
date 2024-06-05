import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ContentChild,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { ThemeService } from 'src/app/service/theme.service';
@Component({
  selector: 'stone-grid',
  templateUrl: './stone-grid.component.html',
  styleUrls: ['./stone-grid.component.scss'],
})
export class StoneGridComponent implements OnInit, OnChanges {
  @ViewChild('stoneImage') stoneImage: ElementRef;

  @Input() stoneDetails;
  @Input() refreshData;

  @Output() addToCartFunction: EventEmitter<any> = new EventEmitter();
  @Output() goToDNAFn: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;
  showVideo: boolean = false;
  hideImage: boolean = false;
  isIpad: boolean = false;
  videoNotAvailable: boolean = false;
  public mobileView: boolean = false;
  public webViewMobile: boolean = false;
  public onMobile: any;
  showImage: boolean;
  constructor(
    private previewAnyFile: PreviewAnyFile,
    private iab: InAppBrowser,
    public platform: Platform,
    private theme: ThemeService
  ) {
    this.platform.ready().then(() => {
      let platforms = this.platform.platforms();
      console.log(platforms);
      console.log(this.platform.is('android'), 'android');
      console.log(this.platform.is('desktop'), 'desktop');
      console.log(this.platform.is('mobileweb'), 'mobileweb');
      // console.log("this.platform", this.platform);
      if (this.platform.is('ipad')) {
        this.isIpad = true;
      }
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else if (this.platform.is('ios')) {
        this.onMobile = true;
      } else if (
        this.platform.is('android') &&
        !this.platform.is('mobileweb')
      ) {
        this.onMobile = true;
      } else if (this.platform.is('mobileweb')) {
        this.onMobile = false;
        this.webViewMobile = true;
      } else {
        this.onMobile = false;
      }
      this.webViewMobile = !platform.is('cordova');
      //  console.log('this.webViewMobile', this.webViewMobile);
    });
  }

  //@ViewChild('videoIframe') iframe: ElementRef;
  @ContentChild('videoIframe', { static: false })
  videoIframe: ElementRef<HTMLIFrameElement>;

  async imageFound() {
    alert('That image is found and loaded');
  }

  async ngOnChanges() {
    console.log(this.stoneDetails);
  }

  async imageNotFound() {
    // this.stoneDetails['videoNotAvailable'] = true
    alert('That image was not found.');
  }

  testImage(URL) {
    var tester = new Image();
    tester.onload = this.imageFound;
    tester.onerror = this.imageNotFound;
    tester.src = URL;
  }

  handleError(event: any) {
    //event.target.src = "https://res.cloudinary.com/kgdiamonds/image/upload/v1629713865/noimage_ppbzb6.png";
    // event.target.src = "assets/images/Video not Found.png";
    event.target.src = 'assets/images/videoAvailableOnRqst.png';

    let id = this.stoneDetails['stoneName'];
    var x = document.getElementById('play_' + id);
    if (x) {
      document.getElementById('play_' + id).style.visibility = 'hidden';
    }
  }

  ngOnInit() {
    this.stoneDetails['videoNotAvailable'] = false;
    this.theme.themeBoolean$.subscribe((value: boolean) => {
      this.showImage = value;
    });
  }

  addToCart() {
    this.addToCartFunction.emit(this.stoneDetails);
  }

  goToDNA() {
    this.goToDNAFn.emit(this.stoneDetails);
  }

  playVideo() {
    if (!this.stoneImage.nativeElement.src.includes('videoAvailableOnRqst')) {
      this.loading = true;
      this.showVideo = true;
    }
  }

  openVideo() {
    let link = this.stoneDetails['videoLink'];
    console.log(this.stoneDetails['videoLink']);

    if (this.mobileView && !this.webViewMobile) {
      this.previewAnyFile.preview(link).then(
        (res: any) => {
          console.log('file : ' + res);
          //this.configService.presentToast("File Downloaded", "success");
        },
        error => {
          // handle error
          console.error(error);
        }
      );
    } else {
      if (this.isIpad && !this.webViewMobile) {
        const options: InAppBrowserOptions = {
          location: 'yes', // Set to 'no' to hide the address bar
          zoom: 'no', // Set to 'yes' to allow zooming
          hardwareback: 'no', // Set to 'yes' to handle the hardware back button on Android
          footer: 'yes', // Set to 'no' to hide the toolbar at the bottom
          hideurlbar: 'yes', // Set to 'yes' to hide the URL bar on top
          hidenavigationbuttons: 'yes', // Set to 'yes' to hide navigation buttons (back, forward, etc.)
          closebuttoncaption: 'Close', // Custom text for the close button
          disallowoverscroll: 'yes', // Set to 'yes' to prevent over-scrolling
          toolbarposition: 'bottom', // Position of the toolbar (top, bottom)
        };
        this.iab.create(link, '_blank', options);
      } else {
        window.open(link, '_blank');
      }
    }
  }

  iframeLoaded(stoneName) {
    setTimeout(() => {
      console.log(this.videoIframe);
      if (this.videoIframe) {
        const iframeDocument =
          this.videoIframe.nativeElement.contentDocument ||
          this.videoIframe.nativeElement.contentWindow?.document;
        if (iframeDocument) {
          const iframeStyles = iframeDocument.createElement('style');
          iframeStyles.innerHTML = `
            .buttons{
              display:none;
            }
          `;
          iframeDocument.head.appendChild(iframeStyles);
        }
      }
      setTimeout(() => {
        this.loading = false;
        this.hideImage = true;
        setTimeout(() => {
          this.stoneImage.nativeElement.style.display = 'none';
        }, 1000);
      }, 500);
    }, 1000);

    // let myiFrame = document.getElementById(`videoiframe_${stoneName}`)
    // let doc = myiFrame.ownerDocument;
    // console.log(doc);
    // doc.body.innerHTML = doc.body.innerHTML + '<style>.buttons{display:none;}</style>';

    // const customStyles = `
    //   .buttons  {
    //     display:none;
    //   }
    // `;

    // // // get reference to the underlying iframe
    // const iframeDoc = (
    //   this.iframe.nativeElement.querySelector(`videoiframe_${stoneName}`) as HTMLIFrameElement
    // ).contentDocument;

    // // create a style tag inside the iframe
    // const style = iframeDoc.createElement('style');

    // // add styles to the style tag
    // style.appendChild(iframeDoc.createTextNode(customStyles));

    // // append the newly created style tag to the iframe's head tag
    // iframeDoc.head.appendChild(style);
  }

  openCertificate() {
    if (this.isIpad && !this.webViewMobile) {
      this.previewAnyFile.preview(this.stoneDetails['certificate']).then(
        (res: any) => {
          console.log('file : ' + res);
        },
        error => {
          // handle error
          console.error(error);
        }
      );
    } else {
      window.open(this.stoneDetails['certificate'], '_blank');
    }
  }

  // checkImage(imageSrc, good, bad) {
  //   var img = new Image();
  //   img.onload = good;
  //   img.onerror = bad;
  //   img.src = imageSrc;
  // }

  // checkImage(this.stoneDetails.idealImage, function() { console.log("good"); }, function() { console.log("bad"); } );

  // ngAfterViewInit() {
  //   // define custom styles
  //   const customStyles = `
  //     .buttons  {
  //       display:none;
  //     }
  //   `;

  //   // get reference to the underlying iframe
  //   const iframeDoc = (
  //     this.iframe.nativeElement.querySelector('iframe') as HTMLIFrameElement
  //   ).contentDocument;

  //   // create a style tag inside the iframe
  //   const style = iframeDoc.createElement('style');

  //   // add styles to the style tag
  //   style.appendChild(iframeDoc.createTextNode(customStyles));

  //   // append the newly created style tag to the iframe's head tag
  //   iframeDoc.head.appendChild(style);
  // }
}
