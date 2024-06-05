import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExcelSheetData {
  constructor() {}

  async dataForExcelsheet(e: any, temp3: any, a: any) {
    switch (e.fieldName) {
      case 'stoneName':
        let stoneName = a['stoneName'] || '';
        if (!!stoneName) temp3[e.name] = stoneName;
        else temp3[e.name] = `${a['title']} Not Available`;
        break;
      case 'Rapnet_pluspercarat':
        temp3[e.name] = !!a['Rapnet_pluspercarat']
          ? Math.round(Number(a['Rapnet_pluspercarat']) * 100) / 100
          : !!a['stoneName']
          ? 0
          : '';
        break;
      case 'Amt':
        if (a['Rapnet_pluspercarat'] && a['cts']) {
          let amt = Number(a['Rapnet_pluspercarat']) * Number(a['cts']);
          temp3[e.name] = amt
            ? Math.round(amt * 100) / 100
            : !!a['stoneName']
            ? 0
            : '';
        } else {
          temp3[e.name] = !!a['stoneName'] ? 0 : '';
        }
        break;
      case 'RapAmt':
        if (a['RAPAPORTpercarat'] && a['cts']) {
          let rapAmt = Number(a['RAPAPORTpercarat']) * Number(a['cts']);
          temp3[e.name] = rapAmt
            ? Math.round(rapAmt * 100) / 100
            : !!a['stoneName']
            ? 0
            : '';
        } else {
          temp3[e.name] = !!a['stoneName'] ? 0 : '';
        }
        break;
      case 'ReportNo':
        let ReportNo = a['ReportNo'] || '';
        let lab = a['lab'] || '';
        if (ReportNo && lab) {
          temp3[e.name] = ReportNo.toString();
        } else {
          temp3[e.name] = ReportNo.toString();
        }
        break;
      case 'Rapnet_plusDiscountPercent':
        temp3[e.name] = !!a['Rapnet_plusDiscountPercent']
          ? Math.round(Number(a['Rapnet_plusDiscountPercent']) * 100) / 100
          : !!a['stoneName']
          ? 0
          : '';
        break;
      case 'cts':
        temp3[e.name] = !!a['cts']
          ? Math.round(Number(a['cts']) * 100) / 100
          : !!a['stoneName']
          ? 0
          : '';
        break;
      case 'RAPAPORTpercarat':
        temp3[e.name] = !!a['RAPAPORTpercarat']
          ? Math.round(Number(a['RAPAPORTpercarat']) * 100) / 100
          : !!a['stoneName']
          ? 0
          : '';
        break;
      case 'KeytoSymbolsCode':
        let val = '';
        if (!!a[e.fieldName]) {
          val = a[e.fieldName].replace(/,/g, '/');
        }
        temp3[e.name] = val;
        break;
      case 'ShapeCode':
        let shape =
          a['eliteShapeCode'] || a['standardShapeCode'] || a['ShapeCode'] || '';
        temp3[e.name] = shape;
        break;
      default:
        temp3[e.name] = a[e.fieldName] || '';
        break;
    }

    return temp3;
  }
}
