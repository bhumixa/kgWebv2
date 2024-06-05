import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortCodes'
})
export class SortCodesPipe implements PipeTransform {

  transform(value: any, arg = null): any {
    let newVal: any;
    if (value == 'VGOOD') {
      newVal = 'VG'
    } else if (value == 'EXCL') {
      newVal = 'EX'
    } else if (value == 'GOOD') {
      newVal = 'GD'
    } else if (value == 'FAIR') {
      newVal = 'FR'
    } else if (value == 'POOR') {
      newVal = 'PR'
    } else {
      newVal = value
    }
    return newVal
  }

}
