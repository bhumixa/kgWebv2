import { Injectable } from '@angular/core';

@Injectable()
export class LoginWithSignupService {
  public imageDetails: { name: string; link: string; redirectTo: string }[] = [
    {
      name: 'Oval',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534733/oval_black_aplvsm.svg',
      redirectTo: '/collections/oval',
    },
    {
      name: 'Round',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534729/round_black_dzrsut.svg',
      redirectTo: '/collections/round',
    },
    {
      name: 'Pear',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534731/pear_black_uoopig.svg',
      redirectTo: '/collections/pear',
    },
    {
      name: 'Radiant',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534729/radiant_black_a8nd1m.svg',
      redirectTo: '/collections/radiant',
    },
    {
      name: 'Cushion',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534738/cushion_black_ic9pvd.svg',
      redirectTo: '/collections/cushion',
    },
    {
      name: 'Emerald',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534736/emerald_black_qxpvza.svg',
      redirectTo: '/collections/emerald',
    },
    {
      name: 'Marquise',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534734/marquise_black_l01cik.svg',
      redirectTo: '/collections/marquise',
    },
    {
      name: 'Heart',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534736/heart_black_dgjrlv.svg',
      redirectTo: '/collections/heart',
    },
    {
      name: 'Princess',
      link: 'https://res.cloudinary.com/kgdiamonds/image/upload/v1624534731/princess_black_xdlhk2.svg',
      redirectTo: '/collections/princess',
    },
  ];
}
