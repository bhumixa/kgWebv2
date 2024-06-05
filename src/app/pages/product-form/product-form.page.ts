import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ActivatedRoute } from "@angular/router";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";
import { CompanyService } from "./../../service/company/company.service";
import { DetailsService } from "../../service/product/details.service";
import { CartService } from "../../service/observable/cart/cart.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
})
export class ProductFormPage implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() selectedQty: Number;
  @Input() selectedVariants: any = [];
  public productData: any;
  public isCatalog = true;
  public userId;
  public listOfProductVariantType = [];
  public productTitle: any;
  public productPrice: any;
  public selectedVariant: any;
  public selectedVariantType1: any;
  public selectedVariantType2: any;
  public sessionId: any;
  public listOfVariantType1 = [];
  public listOfVariantType2 = [];
  public tags: any;
  public discount: any = 0;
  public discountPrice: any;
  public finalPrice: any;
  public onMobile: any;
  public taxes: any;
  public dataValue: any;
  public pincode = "";
  public pincodeResult: any;
  public compareAtPrice: any;
  public compareDiscount: any;
  public imageView = false;
  public productPage: any;
  public showDescription = true;
  public showDeliveryOption = false;
  public showProductWiseDeliveryOption = false;
  public productPageDetails: any;
  public seeMoreIn = [];
  public selectedVariantList = [];
  public variantList = [];
  public cartDetails = [];
  public companyLogo: any;
  public productSchemes = [];
  public customerTag: any;
  public cartId: any;
  public hidePrice: any;
  public showSkeleton = true;
  public selectedParentCustomerId;

  constructor(public _detailsService: DetailsService, public _companyService: CompanyService, public _cartService: CartService, public storage: Storage, private route: ActivatedRoute, public databaseServiceService: DatabaseServiceService, public configService: ConfigServiceService, public viewCtrl: ModalController,) { }

  async ngOnInit() {
    // console.log("selectedVariants ", this.selectedVariants);
    await this.loadCompanyData();
    await this.loadProductDetails();
    await this.getProductTagsAndDiscount(this.id);
  }

  closeModal() {
    // console.log("closeModal ");
    this.viewCtrl.dismiss();
  }
  async loadCompanyData() {

    // console.log("this._companyService.companyObj ", this._companyService.companyObj);
    if (this._companyService.companyObj && this._companyService.companyObj) {
      this.companyLogo = this._companyService.companyObj.companyLogo;
    }
  }

  async loadProductDetails() {
    this.userId = await this.storage.get("userID");
    let sessionId = await this.storage.get("sessionID");
    let res = await this._detailsService.getProductDetail(this.id, "", sessionId, this.userId);
    //await this.databaseServiceService.hideLoading();

    if (res) {
      this.showSkeleton = false
    }
    if (!!res.isSuccess) {
      this.productData = res;
      // console.log("this.productData ", this.productData);
      //await this.getCartDetails();

      if (this.productData.data[0] && this.productData.data[0].listOfProductVariantParameters) {
        //add variant parameter names in array
        this.productData.data[0].listOfProductVariantParameters.filter(variantParam => {
          if (this.listOfProductVariantType.findIndex(i => i.name === variantParam.name) === -1) {
            this.listOfProductVariantType.push({ name: variantParam.name });
          }
        });
        //add variant parameter values in array. Suppose there are 2 different parameters
        //then 2 arrays will be created
        if (this.listOfProductVariantType.length > 0) {
          this.productData.data[0].listOfProductVariantParameters.filter(variantParam => {
            //check if variant is present in cart
            if (!!this.cartDetails && this.cartDetails.length > 0) {
              let index = this.cartDetails.findIndex(c => c.PvID === variantParam.refPvID);
              if (index > -1) {
                variantParam.cartQuantity = this.cartDetails[index].quantity;
                variantParam.isPresentInCart = true;
              } else {
                variantParam.cartQuantity = 0;
                variantParam.isPresentInCart = false;
              }
            }

            if (this.listOfProductVariantType[0].name === variantParam.name && this.listOfVariantType1.findIndex(i => i.id === variantParam.id) == -1) {
              this.listOfVariantType1.push(variantParam);
            } else if (this.listOfProductVariantType[0].name !== variantParam.name && this.listOfVariantType2.findIndex(i => i.id === variantParam.id) == -1) {
              this.listOfVariantType2.push(variantParam);
            }
          });
        }
        // console.log("variant types", this.listOfVariantType1, this.listOfVariantType2);
      }
      //assign the initial values of product
      this.productTitle = this.productData.data[0].name;
      if (this.productData.data[0] && this.productData.data[0].listOfVariants[0]) {
        this.selectedVariant = this.productData.data[0].listOfVariants[0];
        this.calculatePrice(this.selectedVariant);
        if (this.productData.data[0].listOfVariants[0].listOfProductVariantParameter.length > 0) {
          this.selectedVariantType1 = this.productData.data[0].listOfVariants[0].listOfProductVariantParameter[0];
          if (this.productData.data[0].listOfVariants[0].listOfProductVariantParameter.length > 1) {
            this.selectedVariantType2 = this.productData.data[0].listOfVariants[0].listOfProductVariantParameter[1];
          }
        }
      }
      //show the first variant parameters as selected
      if (this.listOfVariantType1.length > 0) {
        this.listOfVariantType1[0].isSelected = true;
        this.selectedVariantType1 = this.listOfVariantType1[0];
      }
      if (this.listOfVariantType2.length > 0) {
        if (this.listOfVariantType1.length > 0) {
          this.listOfVariantType1.forEach(v1 => {
            let v2list = JSON.parse(JSON.stringify(this.listOfVariantType2));
            v2list.forEach(v2 => {

              //check if variant is present in quick order cart and initialize its qty
              if (!!this.selectedVariants && this.selectedVariants.length > 0) {
                let index = this.selectedVariants.findIndex(c => c.id === v2.refPvID);
                if (index > -1) {
                  v2.quantity = this.selectedVariants[index].selectedQty;
                }
              } else {
                v2.quantity = "-";
              }
            });
            v1.secondVariantList = v2list;
          });
        }
        this.listOfVariantType2[0].isSelected = true;
        this.selectedVariantType2 = this.listOfVariantType2[0];
      }
      // console.log("this.listOfVariantType1 ", this.listOfVariantType1);
      // Fetch Total Taxes value for product
      if (this.productData.data[0].listOfParameter.length > 0) {
        this.productData.data[0].listOfParameter.forEach(element => {
          // // console.log(">>>",element)
          if (element.paramName == "Tax") {
            this.taxes = element.paramValue;
          }
          if (element.paramName == "Hide Price") {
            this.hidePrice = element.paramValue;
          }
        });
        let manufacturer = this.productData.data[0].listOfParameter.filter(element => {
          if (element.paramName == "Manufacturer") {
            return element;
          }
        });
        let color = this.productData.data[0].listOfParameter.filter(element => {
          if (element.paramName == "Color") {
            return element;
          }
        });
        let category = this.productData.data[0].listOfParameter.filter(element => {
          if (element.paramName == "Category") {
            return element;
          }
        });
        if (!!manufacturer && manufacturer.length > 0) {
          if (manufacturer[0].paramValue != "Others") {
            let nameArr = [];
            nameArr.push(manufacturer[0].paramValue);
            let query = {
              "filters": [
                {
                  "f": [
                    {
                      "Manufacturer": nameArr
                    }
                  ]
                }
              ]
            };
            this.seeMoreIn.push({
              label: manufacturer[0].paramValue,
              filters: query
            });
          }
        }
        if (!!color && color.length > 0 && !!category && category.length > 0) {
          let nameArr = [],
            categoryValue = [];
          nameArr.push(color[0].paramValue);
          categoryValue.push(category[0].paramValue);
          let query = {
            "filters": [
              {
                "f": [
                  {
                    "Color": nameArr
                  },
                  {
                    "Category": categoryValue
                  }
                ]
              }
            ]
          };
          this.seeMoreIn.push({
            label: color[0].paramValue + " " + category[0].paramValue,
            filters: query
          });
        }
        if (!!category && category.length > 0) {
          let nameArr = [];
          nameArr.push(category[0].paramValue);
          let query = {
            "filters": [
              {
                "f": [
                  {
                    "Category": nameArr
                  }
                ]
              }
            ]
          };
          this.seeMoreIn.push({
            label: category[0].paramValue,
            filters: query
          });
        }
        // console.log("seeMoreIn ", this.seeMoreIn);
      }

      // console.log("list of product variant param", this.productData, this.listOfProductVariantType, this.selectedVariantType1, this.selectedVariantType2, this.selectedVariant, this.productPrice);

      if (!!this.userId) {
        let resSchemes = await this.databaseServiceService.getAllSchemesByUserAndProductId(this.userId, this.id);
        if (resSchemes.isSuccess) {
          this.productSchemes = resSchemes.data;
        }
      }
    } else {
      //console.error("error", res.error);
    }
  }

  variantSelected() {
    // console.log("selected variant", this.selectedVariantType1, typeof this.selectedVariantType1, this.selectedVariantType2, typeof this.selectedVariantType2);
    this.productData.data[0].listOfVariants.filter(variant => {
      if (variant.listOfProductVariantParameter.length > 0) {
        if (variant.listOfProductVariantParameter.findIndex(i => i.id === this.selectedVariantType1.id) > -1 && this.selectedVariantType2 != undefined && variant.listOfProductVariantParameter.findIndex(i => i.id === this.selectedVariantType2.id) > -1) {
          this.calculatePrice(variant);
          // console.log("match1", variant, this.productTitle, this.productPrice);
        } else if (this.selectedVariantType2 == undefined && variant.listOfProductVariantParameter.findIndex(i => i.id === this.selectedVariantType1.id) > -1) {
          this.calculatePrice(variant);
          // console.log("match2", variant, this.productTitle, this.productPrice);
        }
      }
    });
  }

  calculatePrice(variant) {
    let addOnPrice = 0;
    if (!!variant.listOfProductVariantAddOns && variant.listOfProductVariantAddOns.length > 0) {
      let selectedAddOns = variant.listOfProductVariantAddOns.filter(a => a.selected);
      if (!!selectedAddOns && selectedAddOns.length > 0) {
        selectedAddOns.forEach(addOn => {
          if (!!addOn.price && addOn.price > 0) addOnPrice += addOn.price;
        });
      }
    }
    this.productPrice = variant.price + addOnPrice;
    this.compareAtPrice = variant.compareAtPrice + addOnPrice;
    if (!!this.compareAtPrice && this.compareAtPrice > 0) {
      this.compareDiscount = ((this.compareAtPrice - this.productPrice) / this.compareAtPrice) * 100;
      this.compareDiscount = this.compareDiscount.toFixed(0);
    }
    this.discountPrice = (this.productPrice * parseFloat(this.discount)) / 100;
    this.finalPrice = this.productPrice - this.discountPrice;
    this.selectedVariant = variant;
  }

  selectAddOn(event, selectedVariant) {
    // console.log("selectAddOn ", event, selectedVariant);
    this.variantSelected();
  }

  async validateControls() {
    if (Number(this.selectedQty) > 0 && this.selectedVariant != undefined) {
      return false;
    } else {
      if (Number(this.selectedQty) <= 0) {
        this.configService.presentToast("Please enter correct quantity", "error");
        return true;
      } else {
        this.configService.presentToast("Please select the details", "error");
        return true;
      }
    }
  }

  variantSelectedByButton(item, index, variantType) {
    // console.log("item", item, index, variantType);
    item.forEach(element => {
      element.isSelected = false;
    });
    if (variantType == 1) {
      this.selectedVariantType1 = this.listOfVariantType1[index];
    } else if (variantType == 2) {
      this.selectedVariantType2 = this.listOfVariantType2[index];
    }
    this.variantSelected();
    // this.selectedVariant.id = item[index].id;
    // this.productPrice = item[index].price;
    item[index].isSelected = true;
    // console.log("item", item, index);
  }

  createVariantList() {
    this.selectedVariantList = [];
    if (this.productData.data[0].listOfVariants.length == 1 && this.productData.data[0].listOfVariants[0].listOfProductVariantParameter.length == 0) {
      // console.log("this.selectedQty ", this.selectedQty);
      if (!!this.selectedQty && Number(this.selectedQty) > 0) {
        this.productData.data[0].listOfVariants[0].selectedQty = this.selectedQty;
      } else {
        //if there is only 1 variant with no parameters then consider its quantity as 1
        this.productData.data[0].listOfVariants[0].selectedQty = 1;
      }
      this.selectedVariantList.push(this.productData.data[0].listOfVariants[0]);
    } else {
      // for more than 1 variants
      this.productData.data[0].listOfVariants.filter(variant => {
        if (variant.listOfProductVariantParameter.length > 0) {
          this.listOfVariantType1.forEach(v1 => {
            if (variant.listOfProductVariantParameter.findIndex(i => i.id === v1.id) > -1 && !!v1.secondVariantList && v1.secondVariantList.length > 0) {
              //if variant has 2 parameters then use the quantity entered by the user for the second parameter for all the variants
              v1.secondVariantList.forEach(v2 => {
                if (variant.listOfProductVariantParameter.findIndex(i => i.id === v2.id) > -1 && v2.quantity != "-" && v2.quantity > 0) {
                  variant.selectedQty = v2.quantity;
                  if (this.selectedVariantList.indexOf(variant) == -1) {
                    this.selectedVariantList.push(variant);
                  }
                }
              });
            }
            else if (variant.listOfProductVariantParameter.findIndex(i => i.id === v1.id) > -1 && variant.listOfProductVariantParameter.length == 1) {
              //if the variant has only 1 parameter then use the quantity entered by the user else consider its selected quantity as 1  
              // console.log(variant, this.selectedVariantList, v1)
              let pushInArray = false;
              if (!!v1.quantity && v1.quantity > 0) {
                variant.selectedQty = v1.quantity;
                pushInArray = true;
              } else if (variant.isSelected) {
                variant.selectedQty = 1;
                pushInArray = true;
              }
              if (pushInArray && this.selectedVariantList.indexOf(variant) == -1) {
                this.selectedVariantList.push(variant);
              }
            }
          });
        }
      });
    }
    //if no variant is selected, then select first variant with 1 quantity
    if (this.selectedVariantList.length == 0) {
      // console.log("this.selectedQty 1 ", this.selectedQty, this.selectedVariant);
      // if(!!this.selectedVariant.selectedQty && this.selectedVariant.selectedQty>0){
      // } else if(!!this.selectedQty && this.selectedQty>0) {
      //   this.selectedVariant.selectedQty = this.selectedQty;
      // } else {
      this.selectedVariant.selectedQty = 1;
      // }
      this.selectedVariantList.push(this.selectedVariant);
    }
    // console.log("this.selectedVariantList ", this.selectedVariantList);
  }

  openCart() {
    this._cartService.observables.next("data");
  }

  async buyNow() {
    // console.log("selected variants ", this.selectedVariant, " ", this.listOfVariantType1);
    await this.createVariantList();
    this.userId = await this.storage.get("userID");
    // console.log("this.userId", this.userId);
    this.sessionId = await this.storage.get("sessionID");
    // console.log("variant", this.selectedVariant, this.sessionId, this.selectedVariantList);
    let validate = await this.validateControls();
    if (!validate) {
      await this.configService.showLoading();
      if (!!this.taxes) {
        this.taxes = this.taxes.replace("%", "");
      } else {
        this.taxes = 0;
      }
      let selectedVariantObj = [];
      this.selectedVariantList.forEach(v => {
        let selectedAddOns = [];
        let selectedAddOnsJson = [];
        if (!!v.listOfProductVariantAddOns && v.listOfProductVariantAddOns.length > 0) {
          v.listOfProductVariantAddOns.filter(addOn => {
            if (addOn.selected && selectedAddOns.indexOf(addOn.id) == -1) {
              selectedAddOns.push(addOn.id);
              selectedAddOnsJson.push(addOn);
            }
          });
        }
        let objToPush: any = { id: v.id, title: v.title, listOfProductVariantParameter: v.listOfProductVariantParameter, price: v.price, selectedAddOnsJson: selectedAddOnsJson, PvID: v.id, quantity: v.selectedQty, discount: this.discount, taxes: this.taxes, selectedAddOns: selectedAddOns, refProductID: v.refProductID };
        selectedVariantObj.push(objToPush);
      });
      this.viewCtrl.dismiss(selectedVariantObj);
    }
  }

  async getProductTagsAndDiscount(data) {
    this.userId = await this.storage.get("userID");
    // console.log("this.userId", this.userId);
    if (this.userId != null && this.userId != undefined) {
      let requiredCustomerTag = null;
      let requiredCustomerTagArr = [];

      if (!!this.selectedParentCustomerId) {
        requiredCustomerTag = "child_of_" + this.selectedParentCustomerId;
        requiredCustomerTagArr.push(requiredCustomerTag);
      }

      let res = await this._detailsService.getProductTagsAndDiscount(data, null, this.userId, requiredCustomerTagArr);
      if (!!res.isSuccess) {
        this.tags = res.data.tags;
        this.discount = res.data.discount;
        if (this.discount?.toString().includes("%")) {
          this.discount.slice("%");
        }
        this.discountPrice = (this.productPrice * parseFloat(this.discount)) / 100;
        this.finalPrice = this.productPrice - this.discountPrice;
        if (!!res.data.priceRule && !!res.data.priceRule.customerTag && !!res.data.priceRule.customerTag.name) {
          this.customerTag = res.data.priceRule.customerTag.name;
        }
        // console.log("tags", this.tags, " discount", this.discount, "discountPrice", this.discountPrice, "productPrice", this.productPrice);
      } else {
        //console.error("error", res.error);
      }
    }
  }

}
