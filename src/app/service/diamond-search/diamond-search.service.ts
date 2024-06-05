import { Injectable } from '@angular/core';

@Injectable()
export class DiamondSearchService {
  constructor() {}

  check_rangeQuery(companyService: any, rangeObj: any, sizeGroups: any[]) {
    const externalProduct = companyService.companyObj.config.externalProduct;
    const kgAppliedDiscount = externalProduct.kgAppliedDiscount;
    const kgAppliedPrice = externalProduct.kgAppliedPrice;
    const kgAppliedAmount = externalProduct.kgAppliedAmount;

    const rangeTitle = Object.keys(rangeObj)[0];
    let obj: any = {};
    let otherObj: { caratType: string } = { caratType: '' };
    const result: { tempObj: {}; searchPara: {} } = {
      tempObj: {},
      searchPara: {},
    };

    switch (rangeTitle) {
      case 'cts':
        obj['fromCarat'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['toCarat'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';

        let idx: number = -1;
        if (
          !!obj['fromCarat'] &&
          !obj['toCarat'] &&
          obj['fromCarat'] === '5.00'
        ) {
          // idx = sizeGroups.findIndex(
          //   (group: any) =>
          //     Number(group.from) === Number(obj.from) &&
          //     !group.to && !obj.to
          // );
          idx = sizeGroups.length - 1;
        } else {
          idx = sizeGroups.findIndex(
            (group: any) =>
              Number(group.from) === Number(obj['fromCarat']) &&
              Number(group.to) === Number(obj['toCarat'])
          );
        }

        if (idx !== -1) {
          sizeGroups[idx].isRefined = true;
          obj = sizeGroups;
          otherObj['caratType'] = 'groups';
        } else {
          otherObj['caratType'] = 'specific';
        }
        break;
      case 'TablePer':
        obj['tablePerFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['tablePerTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'TotDepth':
        obj['depthFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['depthTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'Length':
        obj['lengthFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['lengthTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'Width':
        obj['widthFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['widthTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'L_W':
        obj['ratioFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['ratioTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'CrAngle':
        obj['crownAngleFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['crownAngleTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'CrHgt':
        obj['crownHeightFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['crownHeightTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'PavAngle':
        obj['pavilionAngleFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['pavilionAngleTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'PavHgt':
        obj['pavilionHeightFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['pavilionHeightTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case 'TotDepthMm':
        obj['heightFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['heightTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case kgAppliedAmount:
        obj['amtPerFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['amtPerTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case kgAppliedPrice:
        obj['pricePerFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['pricePerTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
      case kgAppliedDiscount:
        obj['discountPerFrom'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['gte']
            ? rangeObj[rangeTitle]['gte']
            : '';
        obj['discountPerTo'] =
          !!rangeObj[rangeTitle] && rangeObj[rangeTitle]?.['lte']
            ? rangeObj[rangeTitle]?.['lte']
            : '';
        break;
    }

    result.tempObj = obj;
    result.searchPara = otherObj;

    return result;
  }
}
