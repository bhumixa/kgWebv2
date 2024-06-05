import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SocialService } from "../../service/social/social.service";
import { Storage } from "@ionic/storage";
import { ConfigServiceService } from "../../service/config-service.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss'],
})
export class SocialmediaComponent implements OnInit, AfterViewInit {
  @Input() name: any;
  @Input() type: any;
  @Input() offset: any;
  @Input() limit: any;
  public postPhotos = [];
  public instagramPostLink: any;
  public showInstagramDiv = false;
  public showSkeleton: boolean

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 12,
    autoplay: true,
    loop: true,
    centeredSlides: true
  };
  slideOpts1 = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true
  };
  slideOptionsForSmallScreen = {
    initialSlide: 0,
    slidesPerView: 4,
    autoplay: true,
    loop: true,
    centeredSlides: true
  };
  slideOptions1ForSmallScreen = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false,
    loop: false
    // centeredSlides: true
  };
  slideOptionsForSchemes = {
    initialSlide: 0,
    slidesPerView: 5
  };
  slideOptionsForSchemesSmallScreen = {
    initialSlide: 0,
    slidesPerView: 1
  };
  slideOptsForInstagram = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
    centeredSlides: true
  };
  url: SafeResourceUrl;
  constructor(public sanitizer: DomSanitizer, public storage: Storage, public _configService: ConfigServiceService, public platform: Platform, private _socialService: SocialService) {


  }

  async ngOnInit() {
    //this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fdomepizzeriasrt%2Fposts%2F301986321172823&width=500');     
    this.showSkeleton = true;
    let res: any = await this._socialService.getSocialMediaFeedsByName(this.name, this.offset, this.limit);
    if (res.isSuccess) {
      if (res.data) {
        this.showSkeleton = false;
        if (this.type == "Facebook") {
          this.postPhotos = res.data.postLinks.map(s => {
            // if(this.type == "Twitter"){
            //   s.link = "https://twitframe.com/show?url="+s.link
            // }
            s.link = this.sanitizer.bypassSecurityTrustResourceUrl(s.link);
            return s
          });
        } else {
          this.postPhotos = res.data.postLinks;
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    //twttr.widgets.load();
    // Tweets
    let ngJs: any;
    const ngFjs = document.getElementsByTagName('script')[0];
    const ngP = 'https';

    if (!document.getElementById('twitter-wjs')) {
      ngJs = document.createElement('script');
      ngJs.id = 'twitter-wjs';
      ngJs.src = ngP + '://platform.twitter.com/widgets.js';
      ngFjs.parentNode.insertBefore(ngJs, ngFjs);

    }
  }

  openInstagram(p) {
    window.open(p.link, "_blank");
  }

}
