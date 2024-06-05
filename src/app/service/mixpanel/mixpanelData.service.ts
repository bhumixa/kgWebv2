import { Injectable } from '@angular/core';
import { CompanyService } from '../company/company.service';

@Injectable({
  providedIn: 'root',
})
export class MixPanelDataService {
  constructor(public _companyService: CompanyService) {}

  getPurchaseData = function (product: any, userId: number, userData: any) {
    // Explicitly annotate the type of this
    const self = this as any;
    const externalProduct =
      self._companyService.companyObj.config.externalProduct;

    return {
      UserId: !!userId ? userId : '-',
      'User Name': !!userData?.name ? userData.name : '-',
      Mobile: !!userData?.username ? userData.username : '-',
      Email: !!userData?.email ? userData.email : '-',
      StoneID: !!product?.stoneName ? product.stoneName : '-',
      Shape: !!product?.ShapeCode ? product.ShapeCode : '-',
      Color: !!product?.ColorCode ? product.ColorCode : '-',
      Clarity: !!product?.ClarityCode ? product.ClarityCode : '-',
      Size: !!product?.cts ? Math.round(Number(product.cts) * 100) / 100 : '-',
      Cut: !!product?.CutCode ? product.CutCode : '-',
      Polish: !!product?.PolishCode ? product.PolishCode : '-',
      Symmetry: !!product?.SymmetryCode ? product.SymmetryCode : '-',
      Lab: !!product?.lab ? product.lab : '-',
      Amount: !!product?.[externalProduct.kgAppliedAmount]
        ? Math.round(Number(product[externalProduct.kgAppliedAmount]) * 100) /
          100
        : 0,
      Price: !!product?.[externalProduct.kgAppliedPrice]
        ? Math.round(Number(product[externalProduct.kgAppliedPrice]) * 100) /
          100
        : 0,
      Discount: !!product[externalProduct.kgAppliedDiscount]
        ? Math.round(Number(product[externalProduct.kgAppliedDiscount]) * 100) /
          100
        : 0,
      'Distribution Center City': !!userData?.parameter
        ? JSON.parse(userData.parameter).userAccount?.distributioncenter
            ?.city || '-'
        : '-',
      'Sales Person Name': !!userData?.parameter
        ? JSON.parse(userData.parameter).userAccount?.salesperson.name || '-'
        : '-',
      'Sales Person Email': !!userData?.parameter
        ? JSON.parse(userData.parameter).userAccount?.salesperson.email || '-'
        : '-',
      'Sales Person Mobile': !!userData?.parameter
        ? JSON.parse(userData.parameter).userAccount?.salesperson.username ||
          '-'
        : '-',
    };
  };
}
