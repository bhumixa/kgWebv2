import { Component, OnInit } from "@angular/core";
import { NavController, Platform, ModalController, IonToolbar } from "@ionic/angular";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";
import { ProductFormPage } from "../product-form/product-form.page";
import { Storage } from "@ionic/storage";
import { CompanyService } from "./../../service/company/company.service";
import { HeaderFooterService } from "./../../service/headerFooter/header-footer.service";
import { FunctionsService } from "../../service/cart/functions/functions.service";
import { CollectionService } from "../../service/page/collection.service";
import { CartService } from "../../service/observable/cart/cart.service";
import { CartChangedService } from "../../service/observable/cart-changed/cart-changed.service";
import { HeaderFabService } from "../../service/observable/header-fab/header-fab.service";
import { PageService } from "../../service/page/page.service";

@Component({
  selector: "app-new-order",
  templateUrl: "./new-order.page.html",
  styleUrls: ["./new-order.page.scss"]
})
export class NewOrderPage implements OnInit {
  public defaultpageName = 'NewOrderPage';

  public pageName = "Quick Order";
  public showDetails = false;
  public productId;
  public offset = 0;
  public limit: any = 30;
  public searchText = "";
  public products = [];
  public allOrders: any;
  public onMobile: any;
  public shouldShowCancel: "focus";
  public loggedInUser: any;
  public segments: any = [];
  public selectedSegment = "";
  public showSegment: Boolean = true;
  public collectionName: any;
  public showSkeleton: Boolean = false;
  public selectedProductList = [];
  public totalPrice: any = 0.00;
  public totalItems: any = 0;
  public sessionId: any;
  public userId: any;
  public cartDetails = [];
  public removeProductList = [];
  public collectionNames = [];
  public variantAvailable: any;
  public companyName = "";
  public showHideHeader: Boolean = false;
  public hideImage = false;
  public showDescriptionOnProductDetail = false;
  public productType = this._companyService.companyObj.productType || "product";
  public quickOrderPageDetails: any;
  public quickOrderPage: any;
  public collections = [];

  constructor(public _cartChangedService: CartChangedService, public _headerFabService: HeaderFabService, public _collectionService: CollectionService, public _functionsService: FunctionsService, public _headerFooterService: HeaderFooterService, public _companyService: CompanyService, public _cartService: CartService, public platform: Platform, public databaseServiceService: DatabaseServiceService, private modalCtrl: ModalController, public navCtrl: NavController, public configService: ConfigServiceService, public storage: Storage,
    public _pageService: PageService) {
    this.showDetails = false;
    this._cartChangedService.observable(this.defaultpageName).subscribe(async data => {
      // console.log("cart changed ", data);
      if (!!data) {
        if (data.type == "remove") {
          await this.removeCartProductFromList(data.data);
        } else {
          await this.changeCartProductQtyFromList(data.data);
        }
      }
      await this.getCartDetails();
      await this.initalizeProductValues();
      await this.calculatePrice();
    });
    this._headerFabService.observable().subscribe(data => {
      this.showHideHeader = data;
      // console.log("showHideHeader", data);
    });
    this._companyService.currentPage = this.defaultpageName;

  }

  async ngOnInit() {
    await this.configService.setTitle(this.pageName);
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is("desktop")) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
    this.storage.get("loggedInUser").then(val => {
      this.loggedInUser = val;
    });
    this.showSkeleton = true;
    await this.loadCompanyData();
    await this.getCartDetails();
    if (this.collectionNames.length > 0) {
      await this.loadAllCollectionData(this.collectionNames, null);
    } else {
      await this.loadAllProducts();
    }
  }

  async ionViewDidEnter() {
    await this.getCartDetails();
  }

  async loadCompanyData() {

    // console.log("this._companyService.companyObj ", this._companyService.companyObj);
    if (this._companyService.companyObj && this._companyService.companyObj) {
      this.companyName = this._companyService.companyObj.name;
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {


          if (!!companyJson && companyJson.quickOrderPageHeaderLinks) {
            this.segments.push({
              title: "All",
              redirectTo: ""
            });
            companyJson.quickOrderPageHeaderLinks.filter(seg => {
              let collectionName = seg.redirectTo.split("/collections/")[1];
              if (this.collectionNames.indexOf(collectionName) == -1) {
                this.collectionNames.push(collectionName);
              }
              this.segments.push(seg)
            });
          }
          if (!!companyJson && companyJson.variantAvailable) {
            this.variantAvailable = companyJson.variantAvailable;
          }
          if (!!companyJson && companyJson.hideImageOnQuickOrder) {
            this.hideImage = companyJson.hideImageOnQuickOrder;
          }
          if (!!companyJson && companyJson.showDescriptionOnProductDetail) {
            this.showDescriptionOnProductDetail = companyJson.showDescriptionOnProductDetail;
          }
          if (!!companyJson.quickOrderPage && this.productType != 'diamond') {
            this.quickOrderPage = companyJson.quickOrderPage;
            await this.getQuickOrderPageDetails();
          }
          // console.log("this.segments  ", this.segments, this.variantAvailable);
        }
      }
    }
  }

  async loadAllProducts() {
    this.showDetails = false;
    let response = await this.databaseServiceService.getAllProducts(this.offset, this.limit, this.searchText);
    if (response) {
      this.showSkeleton = false;
    }
    if (response.isSuccess) {
      this.products = response.data;
      this.initalizeProductValues();
    }
  }

  /**
   * Initialize all product values with default selected quantity.
   * If the product/variant is present in cart, but not in selected product list then add it only
   *  if it was not removed by the user.
   */
  async initalizeProductValues() {
    // console.log("cart details ", this.cartDetails, this.selectedProductList);
    this.products.filter(product => {
      let selectedProduct = this.selectedProductList.filter(p => p.id == product.id);
      let productPresentInActualCart = this.cartDetails.filter(cp => {
        if (!!cp.pId && cp.pId == product.id) {
          return cp;
        }
      });
      if (!!productPresentInActualCart && productPresentInActualCart.length > 0) {
        // console.log("productPresentInActualCart ", productPresentInActualCart, product);
        // product.selectedQty=0;
        // product.listOfVariants = [];
        // product.presentInActualCart = true;
        // product.addedToCart = true;
        if (!product.listOfVariants) {
          product.listOfVariants = [];
        }
        let newVariants = [];
        let newSelectedQty = 0;
        for (let cp = 0; cp < productPresentInActualCart.length; cp++) {
          newSelectedQty += productPresentInActualCart[cp].quantity;
          let newVariant = this.checkIfProductOrVariantIsRemoved(productPresentInActualCart[cp]);
          // console.log("product ", product, " productPresentInActualCart[cp] ", productPresentInActualCart[cp], " newVariant ", newVariant);

          if (!!newVariant) {
            // let selectedParamAndAddOnsJson = {};

            let variant = {
              id: productPresentInActualCart[cp].refPvID,
              title: productPresentInActualCart[cp].title,
              listOfProductVariantParameter: productPresentInActualCart[cp].listOfProductVariantParameter,
              price: productPresentInActualCart[cp].price,
              selectedAddOnsJson: productPresentInActualCart[cp].selectedAddOns,
              PvID: productPresentInActualCart[cp].refPvID,
              quantity: productPresentInActualCart[cp].quantity,
              discount: productPresentInActualCart[cp].discount,
              taxes: productPresentInActualCart[cp].taxes,
              selectedAddOns: productPresentInActualCart[cp].selectedAddOns.map(a => a.refAddOnsId),
              refProductID: product.id,
              selectedQty: productPresentInActualCart[cp].quantity,
              actualCartQty: productPresentInActualCart[cp].quantity
            };
            let addOns = "";
            let params = "";
            variant["selectedParamAndAddOns"] = "";
            if (!!variant.listOfProductVariantParameter && variant.listOfProductVariantParameter.length > 0) {
              variant.listOfProductVariantParameter.forEach(p => {
                params += p.value + ", ";
              });
              params = params.slice(0, -2);
            }
            if (!!variant.selectedAddOnsJson && variant.selectedAddOnsJson.length > 0) {
              variant.selectedAddOnsJson.forEach(addOn => {
                addOns += addOn.name + ", ";
              });
              addOns = addOns.slice(0, -2);
            }
            if (!!params) {
              variant["selectedParamAndAddOns"] += params;
            }
            if (!!addOns) {
              if (!!variant["selectedParamAndAddOns"]) {
                variant["selectedParamAndAddOns"] += " / ";
              }
              variant["selectedParamAndAddOns"] += addOns;
            }
            // product.listOfVariants.push(variant);
            newVariants.push(variant);
          }
        };
        // remove variants present in selected product list but not present in cart details i.e. product was removed from cart
        let deleteVariants = productPresentInActualCart.filter(({ refPvID: id1 }) => !product.listOfVariants.some(({ id: id2 }) => id2 === id1));
        // console.log("newVariants ", newVariants, " deleteVariants ", deleteVariants, product, selectedProduct, this.selectedProductList);
        if (newVariants.length > 0) {
          product.selectedQty = newSelectedQty;
          product.listOfVariants = [];
          product.presentInActualCart = true;
          product.addedToCart = true;
          newVariants.filter(v => product.listOfVariants.push(v));
          if (!selectedProduct || selectedProduct.length == 0) {
            // console.log(" adding selected product...............");
            this.selectedProductList.push(product);
            // this.calculatePrice();
          }
        }

      } else {
        product.presentInActualCart = null;
        product.addedToCart = false;
      }
      if (!!selectedProduct && selectedProduct.length > 0) {
        if (!!product.presentInActualCart) {
          product.selectedQty += selectedProduct[0].selectedQty;
        } else {
          product.selectedQty = selectedProduct[0].selectedQty;
          product.addedToCart = selectedProduct[0].addedToCart;
        }
        product.listOfVariants = selectedProduct[0].listOfVariants;
      } else if (!!product.presentInActualCart) {
        product.addedToCart = true;
      } else {
        product.selectedQty = 1;
        product.addedToCart = false;
      }
    });
    // console.log("this.selectedProductList ", this.selectedProductList);
    this.addCartProductsInList();
    this.calculatePrice();
  }

  /**
   * This function adds all the products(not removed by user) in selected product list which are present
   * in cart but not present in products array
   */
  async addCartProductsInList() {
    // console.log("add products in list ", this.cartDetails, this.products, this.selectedProductList, this.removeProductList);
    if (!!this.cartDetails && this.cartDetails.length > 0) {
      let results = this.cartDetails.filter(({ pId: id1 }) => !this.products.some(({ id: id2 }) => id2 === id1));
      // console.log("results ", results);
      if (results.length > 0) {
        results.filter(async newProduct => {
          let addProduct = this.checkIfProductOrVariantIsRemoved(newProduct);
          if (addProduct) {
            let product = {
              id: newProduct.pId,
              sku: "",
              description: "",
              listOfVariants: [],
              listOfImages: [],
              listOfParameter: [],
              listOfReview: [],
              listOfTags: [],
              maxPrice: newProduct.price,
              minPrice: newProduct.price,
              name: newProduct.title,
              presentInActualCart: true,
              selectedQty: newProduct.quantity,
              totalAddOns: newProduct.selectedAddOns ? newProduct.selectedAddOns.length : 0,
              totalVariants: newProduct.productVariant ? newProduct.productVariant.length : 1,
              totalOutOfStock: 0
            }
            let variant = {
              id: newProduct.pvid,
              title: newProduct.title,
              listOfProductVariantParameter: newProduct.listOfProductVariantParameter,
              price: newProduct.price,
              selectedAddOnsJson: newProduct.selectedAddOns,
              PvID: newProduct.refPvID,
              quantity: newProduct.quantity,
              discount: newProduct.discount,
              taxes: newProduct.taxes,
              selectedAddOns: newProduct.selectedAddOns.map(a => a.refAddOnsId),
              refProductID: newProduct.id,
              selectedQty: newProduct.quantity,
              actualCartQty: newProduct.quantity
            };
            let addOns = "";
            let params = "";
            variant["selectedParamAndAddOns"] = "";
            if (!!variant.listOfProductVariantParameter && variant.listOfProductVariantParameter.length > 0) {
              variant.listOfProductVariantParameter.forEach(p => {
                params += p.value + ", ";
              });
              params = params.slice(0, -2);
            }
            if (!!variant.selectedAddOnsJson && variant.selectedAddOnsJson.length > 0) {
              variant.selectedAddOnsJson.forEach(addOn => {
                addOns += addOn.name + ", ";
              });
              addOns = addOns.slice(0, -2);
            }
            if (!!params) {
              variant["selectedParamAndAddOns"] += params;
            }
            if (!!addOns) {
              if (!!variant["selectedParamAndAddOns"]) {
                variant["selectedParamAndAddOns"] += " / ";
              }
              variant["selectedParamAndAddOns"] += addOns;
            }
            product.listOfVariants.push(variant);
            let productPresentInList = this.selectedProductList.filter(p => p.id == newProduct.pId);
            if (productPresentInList.length == 0) {
              this.selectedProductList.push(product);
            } else {
              let existingVariantList = productPresentInList[0].listOfVariants.filter(v => v.id == variant.id);
              let sameAddOns = true;
              if (existingVariantList.length > 0) {
                let existingVIndex = existingVariantList.findIndex(ev => this.arraysEqual(ev.selectedAddOns, variant.selectedAddOns));

                if (existingVIndex > -1) {
                  // replace with new quantity
                  existingVariantList[existingVIndex].quantity = variant.quantity;
                } else {
                  productPresentInList[0].listOfVariants.push(variant);
                }
              } else {
                productPresentInList[0].listOfVariants.push(variant);
              }
              let selectedQty = 0, addOns = 0;
              productPresentInList[0].listOfVariants.filter(v => {
                selectedQty += v.selectedQty;
                addOns += v.selectedAddOns ? v.selectedAddOns.length : 0
              });
              productPresentInList[0].maxPrice = product.maxPrice;
              productPresentInList[0].minPrice = product.minPrice;
              productPresentInList[0].name = product.name;
              productPresentInList[0].presentInActualCart = true;
              productPresentInList[0].selectedQty = selectedQty;
              productPresentInList[0].totalAddOns += addOns,
                productPresentInList[0].totalVariants = productPresentInList[0].listOfVariants.length
              // console.log("productPresentInList[0].listOfVariants.... ", productPresentInList[0].listOfVariants);
            }
          }
        });
      }
    }
  }

  /**
   * This function uses removeProductList array to check whether the product or its variant
   * is removed by user on this page
   * @param product is the object present in actual cart 
   */
  checkIfProductOrVariantIsRemoved(product) {
    // console.log(" checkIfProductOrVariantIsRemoved ", product);
    if (this.removeProductList.length > 0) {
      // dont add cart products/variants in list if it is already removed by user in page
      let rpIndex = this.removeProductList.findIndex(r => r.id == product.pId);
      if (rpIndex > -1) {
        let rp = this.removeProductList[rpIndex];
        if (rp.listOfVariants.length > 0) {
          let rpvIndex = rp.listOfVariants.findIndex(v => v.id == product.pvid);
          if (rpvIndex > -1) {
            let rpv = rp.listOfVariants[rpvIndex];
            let cartSelectedAddOns = product.selectedAddOns.filter(a => a.refAddOnsId);
            return !this.arraysEqual(rpv.selectedAddOns, cartSelectedAddOns);
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  /**
   * This function removes product/variant from remove list if user adds it in cart
   * @param product is the object of selected product list
   */
  removeProductOrVariantFromRemoveList(product) {
    product = JSON.parse(JSON.stringify(product));
    // console.log(" removeProductOrVariantFromRemoveList ", product, this.removeProductList);
    if (this.removeProductList.length > 0) {
      // dont add cart products/variants in list if it is already removed by user in page
      let rpIndex = this.removeProductList.findIndex(r => r.id == product.id);
      if (rpIndex > -1) {
        let rp = this.removeProductList[rpIndex];
        if (rp.listOfVariants.length > 0 && !!product.listOfVariants) {
          product.listOfVariants.forEach(pv => {
            rp.listOfVariants = rp.listOfVariants.filter(v => !(v.id == pv.id && this.arraysEqual(v.selectedAddOns, pv.selectedAddOns)));
          });
          if (rp.listOfVariants.length == 0) {
            this.removeProductList = this.removeProductList.filter(r => r.id != product.id);
          }
        } else {
          this.removeProductList = this.removeProductList.filter(r => r.id != product.id);
        }
      }
    }
    // console.log("removeProductOrVariantFromRemoveList after this.removeProductList ", this.removeProductList);
  }
  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * This function adds product to cart if it has 1 variant with no add ons and is available.
   * @param single_product product details
   */
  async selectProduct(single_product) {
    this.productId = single_product.id;
    if (!single_product.selectedQty || single_product.selectedQty < 1) {
      this.configService.presentToast("Quantity must be greater than 0 ", "error");
      // } 
      // else if(!!single_product.addedToCart) {
      // // remove from cart
      // single_product.addedToCart = false;
      // this.selectedProductList = this.selectedProductList.filter(item=>item.id !=single_product.id );
      // this.configService.presentToast(single_product.name + " removed from cart ","success");
      // this.calculatePrice();
    } else {
      if (single_product.totalVariants == single_product.totalOutOfStock) {
        this.configService.presentToast(single_product.name + " is currently out of stock ", "error");
      } else if ((single_product.totalVariants > 1 || single_product.totalAddOns > 0)) {
        // this.products = [];
        // this.searchText = "";
        let productDetailsModal = await this.modalCtrl.create({
          component: ProductFormPage,
          componentProps: {
            id: this.productId,
            title: single_product.name,
            selectedQty: single_product.selectedQty,
            // selectedVariants: (!!single_product.addedToCart && !!single_product.listOfVariants && single_product.listOfVariants.length>0) ? single_product.listOfVariants: []
          },
          cssClass: "productDetails",
          showBackdrop: false
        });
        productDetailsModal.present();
        productDetailsModal.onDidDismiss().then(data => {
          // console.log("selected variant object ", single_product, data);
          if (!!data && !!data.data) {
            // this.removeProductOrVariantFromRemoveList(single_product);
            this.addProductsOfMultipleVariantsOrAddons(single_product, data);
          }
          //this.products = [];
          //this.searchText = "";
        });
      } else {
        //  add to cart
        // console.log("add to cart ", single_product);
        // this.removeProductOrVariantFromRemoveList(single_product);
        if (!!single_product.selectedQty && single_product.selectedQty > 0 && !single_product.addedToCart) {
          single_product.addedToCart = true;
          let taxes = 0;
          if (!!single_product.listOfParameter) {
            single_product.listOfParameter.forEach(element => {
              // // console.log(">>>",element)
              if (element.paramName == "Tax") {
                taxes = element.paramValue.replace("%", "");
              }
            });
          }
          single_product.listOfVariants.filter(variant => {
            variant.selectedQty = single_product.selectedQty;
            variant.taxes = taxes;
          });
          this.selectedProductList.push(single_product);
          // this.configService.presentToast(single_product.name + " added to cart ","success");
        }
        this.calculatePrice();
      }
    }
    // console.log(" selected variant list ", this.selectedProductList, this.removeProductList);
  }

  async changeQuantity(variant, single_product, incrementDecrement) {
    let productPresentInCart = this.selectedProductList.filter(product => single_product.id == product.id);
    // console.log("productPresentInCart ", productPresentInCart, variant, single_product, incrementDecrement);
    if (!!productPresentInCart && productPresentInCart.length > 0) {
      // if(productPresentInCart[0].listOfVariants.length>1) {
      //   await this.selectProduct(single_product);
      // } else {
      if (!!incrementDecrement && incrementDecrement == 'increment') {
        variant.selectedQty++;
      } else if (!!incrementDecrement && incrementDecrement == 'decrement') {
        variant.selectedQty--;
      }
      if (variant.selectedQty < 1) {
        let removeProduct: any;
        let rpIndex = this.removeProductList.findIndex(rp => rp.id == productPresentInCart[0].id);
        if (rpIndex > -1) {
          removeProduct = this.removeProductList[rpIndex];
        } else {
          removeProduct = Object.assign(Object.create(productPresentInCart[0]), productPresentInCart[0]);
        }
        // console.log("productPresentInCart 1 ", productPresentInCart, variant, single_product, incrementDecrement);
        if (!!productPresentInCart[0].listOfVariants && productPresentInCart[0].listOfVariants.length > 1) {
          // if(productPresentInCart[0].listOfVariants>1) {
          single_product.addedToCart = false;
          removeProduct.addedToCart = false;
          if (rpIndex == -1) {
            removeProduct.listOfVariants = [];
          }
          if (!!variant.selectedAddOns) {
            let newListOfVariants = [];
            productPresentInCart[0].listOfVariants.filter(v => {
              if (v.id == variant.id && this.arraysEqual(v.selectedAddOns, variant.selectedAddOns)) {
                if (removeProduct.listOfVariants.filter(rv => rv.id == variant.id && rv.selectedAddOns == variant.selectedAddOns).length == 0) {
                  removeProduct.listOfVariants.push(v);
                }
              } else {
                newListOfVariants.push(v);
              }
            });
            productPresentInCart[0].listOfVariants = newListOfVariants;
            // console.log("newListOfVariants ", newListOfVariants);
          } else {
            removeProduct.listOfVariants = productPresentInCart[0].listOfVariants.filter(v => v.id == variant.id);
            productPresentInCart[0].listOfVariants = productPresentInCart[0].listOfVariants.filter(v => v.id != variant.id);
          }
          // }
          single_product.listOfVariants = productPresentInCart[0].listOfVariants;
          // console.log("productPresentInCart 2 ", productPresentInCart, variant, single_product, incrementDecrement);

          this.selectedProductList.filter(product => {
            if (single_product.id == product.id) {
              product = productPresentInCart[0];
              if (product.listOfVariants.length > 0) {
                single_product.addedToCart = true;
              }
            }
          });
          // console.log("this.selectedProductList ", this.selectedProductList, removeProduct, this.removeProductList);
          // this.configService.presentToast(variant.title + " removed from cart ","success");
          this.calculatePrice();
        } else {
          this.selectedProductList = this.selectedProductList.filter(item => item.id != single_product.id);
          // this.configService.presentToast(single_product.name + " removed from cart ","success");
          this.calculatePrice();
          single_product.addedToCart = false;
          single_product.selectedQty = 1;
        }

        // add/update removed product or its variant in list
        if (rpIndex > -1) {
          this.removeProductList[rpIndex] = removeProduct;
        } else {
          this.removeProductList.push(removeProduct);
        }
      } else {
        if (!!productPresentInCart && productPresentInCart.length > 0) {
          this.calculatePrice();
        }
      }
      // }
    } else {
      this.configService.presentToast(single_product.name + " not present in cart ", "error");
    }

  }

  addProductsOfMultipleVariantsOrAddons(single_product, data) {
    if (single_product.addedToCart) {
      let newVariants = [];
      data.data.filter(newV => {
        let existingVariantList = single_product.listOfVariants.filter(v => v.id == newV.id);
        let sameAddOns = true;
        if (existingVariantList.length > 0) {
          let existingVIndex = existingVariantList.findIndex(ev => this.arraysEqual(ev.selectedAddOns, newV.selectedAddOns));

          if (existingVIndex > -1) {
            // replace with new quantity
            existingVariantList[existingVIndex].quantity = newV.quantity;
          } else {
            newVariants.push(newV);
          }
          // console.log("existingV ", existingVIndex, existingVariantList[existingVIndex], " newV ", newV, " same add ons ", sameAddOns);
        } else {
          newVariants.push(newV);
        }

      });
      if (newVariants.length > 0) {
        newVariants.filter(v => {
          if (single_product.listOfVariants.indexOf(v) == -1) {
            single_product.listOfVariants.push(v);
          }
        });
      }
      // single_product.listOfVariants = data.data;
    } else {
      single_product.addedToCart = true;
      single_product.listOfVariants = data.data;
    }
    if (single_product.listOfVariants.length == 0) {
      single_product.selectedQty = 1;
    } else {
      single_product.selectedQty = 0;
    }
    single_product.listOfVariants.filter(variant => {
      // let selectedParamAndAddOnsJson = {};
      variant.selectedParamAndAddOns = "";
      if (!variant.selectedQty) variant.selectedQty = variant.quantity;
      single_product.selectedQty += variant.selectedQty;
      let addOns = "";
      let params = "";
      if (!!variant.listOfProductVariantParameter && variant.listOfProductVariantParameter.length > 0) {
        variant.listOfProductVariantParameter.forEach(p => {
          params += p.value + ", ";
        });
        params = params.slice(0, -2);
      }
      if (!!variant.selectedAddOnsJson && variant.selectedAddOnsJson.length > 0) {
        variant.selectedAddOnsJson.forEach(addOn => {
          addOns += addOn.name + ", ";
        });
        addOns = addOns.slice(0, -2);
      }
      if (!!params) {
        variant.selectedParamAndAddOns += params;
      }
      if (!!addOns) {
        if (!!variant.selectedParamAndAddOns) {
          variant.selectedParamAndAddOns += " / ";
        }
        variant.selectedParamAndAddOns += addOns;
      }
    });


    let existingProductIndex = this.selectedProductList.findIndex(p => p.id == single_product.id);
    if (existingProductIndex > -1) {
      this.selectedProductList[existingProductIndex] = single_product;
    } else {
      this.selectedProductList.push(single_product);
    }
    // console.log("this.selectedProductList ", this.selectedProductList);
    this.calculatePrice();

  }

  calculatePrice() {
    this.totalPrice = 0.00;
    this.totalItems = 0;
    this.selectedProductList.filter(product => {
      let addOnPrice = 0;
      let productPrice = 0;
      let productSelectedQty = 0;
      if (!!product.selectedAddOnsJson && product.selectedAddOnsJson.length > 0) {
        product.selectedAddOnsJson.forEach(addOn => {
          if (!!addOn.price && addOn.price > 0) addOnPrice += addOn.price;
        });
      }
      product.listOfVariants.filter(variant => {
        let variantPrice = variant.price + addOnPrice;
        let discountPrice = 0;
        if (!!variant.discount) {
          discountPrice = (variantPrice * parseFloat(variant.discount)) / 100;
        }
        variantPrice = variantPrice - discountPrice;
        productPrice += (variantPrice * parseInt(variant.selectedQty));
        productSelectedQty += parseInt(variant.selectedQty);
      });
      product.selectedQty = productSelectedQty;
      this.totalPrice += productPrice;
      this.totalItems += parseInt(product.selectedQty);
    });
    // console.log("calculate price this.selectedProductList  ", this.selectedProductList)
  }

  async addToCart() {
    // console.log("selected products ", this.selectedProductList);
    if (this.selectedProductList.length == 0) {
      // this.configService.presentToast("Please add products in your cart to proceed.", "error");
      this.openCart();
    } else {
      await this.configService.showLoading();
      this.userId = await this.storage.get("userID");
      // // console.log("this.userId", this.userId);
      this.sessionId = await this.storage.get("sessionID");

      let selectedVariantObj = [];
      let unchangedActualCartProducts = 0;
      this.selectedProductList.forEach(product => {
        product.listOfVariants.forEach(v => {
          if (!!v.actualCartQty && v.actualCartQty == v.selectedQty) {
            unchangedActualCartProducts++;
          }
          let objToPush: any = { PvID: v.id, quantity: v.selectedQty, discount: v.discount ? v.discount : 0, taxes: v.taxes ? v.taxes : 0, selectedAddOns: v.selectedAddOns ? v.selectedAddOns : [] };
          selectedVariantObj.push(objToPush);
        });
      });
      // console.log("selected variant obj ", selectedVariantObj, unchangedActualCartProducts, selectedVariantObj.length);
      if (selectedVariantObj.length > 0 && (unchangedActualCartProducts != selectedVariantObj.length || this.cartDetails.length != selectedVariantObj.length)) {
        this.showSkeleton = true;
        let deleteRes = await this.databaseServiceService.emptyCart(this.userId, this.sessionId, null, null);
        let res = await this._functionsService.addMultipleToCart(this.userId, this.sessionId, selectedVariantObj, "");
        if (!!res.isSuccess) {
          this.selectedProductList = [];
          this.removeProductList = [];
          // console.log("add to cart res", res, this.selectedProductList);
          await this.configService.hideLoading();
          // await this.configService.presentToast("Products added to cart successfully", "success");
          await this.getCartDetails();
          await this.initalizeProductValues();
          this.calculatePrice();
          this.showSkeleton = false;
        } else {
          // console.log(res.error);
          await this.configService.hideLoading();
          await this.configService.presentToast("Please try again.", "error");
        }
        this.openCart();
      } else {
        this.openCart();
      }
    }
  }

  openCart() {
    this._cartService.observables.next("data");
  }

  doInfiniteNewForNewOrder(infiniteScroll) {
    this.offset += 1;
    // console.log("infiniteScroll for new order", infiniteScroll, this.selectedSegment, this.collectionName);
    setTimeout(() => {
      if (!!this.selectedSegment && this.selectedSegment != '' && !!this.collectionName) {
        this.loadCollectionDatawithScroll(this.collectionName, infiniteScroll);
      } else {
        if (this.selectedSegment == '' && this.collectionNames.length > 0) {
          this.loadAllCollectionDatawithScroll(this.collectionNames, infiniteScroll);
        } else {
          this.loadDatawithScrollForNewOrder(infiniteScroll);
        }
      }
      infiniteScroll.target.complete();
    }, 500);
  }
  async loadDatawithScrollForNewOrder(infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit);
    let response = await this.databaseServiceService.getAllProducts(this.offset, this.limit, this.searchText);
    if (response && response.data) {
      let allData = response.data;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.products, allData);
            this.initalizeProductValues();
            infiniteScroll.target.complete();
            // console.log("this.products2", this.products);
          }
        }

        if (response.length == 1000) {
          infiniteScroll.target.disabled = true;
        }
      } else {
        // console.log("error", response.error);
        this.configService.presentToast(response.error, "error");
      }
    }
  }

  segmentChanged(ev: any) {
    // console.log(" segment changed ", ev, this.selectedSegment);
    this.reset();
    if (this.selectedSegment == '') {
      this.showSkeleton = true;
      if (this.collectionNames.length > 0) {
        this.loadAllCollectionData(this.collectionNames, null);
      } else {
        this.loadAllProducts();
      }
    } else {
      this.showSkeleton = true;
      this.collectionName = this.selectedSegment.split("/collections/")[1];
      this.loadCollectionData(this.collectionName, null);
    }
  }

  async searchChange(ev: any) {
    // console.log("this.collectionName ", this.collectionName, this.searchText, ev);
    this.showSkeleton = true;
    if (this.selectedSegment == '') {
      if (this.collectionNames.length > 0) {
        await this.loadAllCollectionData(this.collectionNames, null);
      } else {
        if (!!this.searchText) {
          this.limit = '';
        } else {
          this.limit = 30;
        }
        await this.loadAllProducts();
      }
    } else {
      await this.loadCollectionData(this.collectionName, null);
    }
  }

  async loadCollectionData(data, infiniteScroll) {
    if (!this.onMobile) {
      this.limit = 20;
    }
    let response = await this._collectionService.getPageDetailByCollectionName(data, this.offset, this.limit, this.searchText,null);

    if (response) {
      this.showSkeleton = false;
    }
    if (response.isSuccess && response.data[0]) {
      response.data[0].listOfProducts.filter(p => p.productType = response.data[0].description);
      this.products = response.data[0].listOfProducts;
      this.initalizeProductValues();
    }
    // console.log("this.products1", this.products, document.URL, response.data[0]);
  }

  async loadCollectionDatawithScroll(data, infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit); 
    let response = await this._collectionService.getPageDetailByCollectionName(data, this.offset, this.limit, this.searchText,null);

    if (response && response.data[0]) {
      response.data[0].listOfProducts.filter(p => p.productType = response.data[0].description);
      let allData = response.data[0].listOfProducts;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.products, allData);
            this.initalizeProductValues();
            infiniteScroll.target.complete();
            // console.log("this.products2", this.products);
          }
        }

        if (response.length == 1000) {
          infiniteScroll.target.disabled = true;
        }
        // this.products = response;

        // this.products.push(allData);
      } else {
        // console.log("error", response.error);
        this.configService.presentToast(response.error, "error");
      }
    }
  }

  reset() {
    this.offset = 0;
    this.limit = 30;
    this.products = [];
    this.searchText = "";
    this.showSkeleton = true;
  }

  async getCartDetails() {
    this.userId = await this.storage.get("userID");
    this.sessionId = await this.storage.get("sessionID");
    // console.log("this.userId", this.userId, "this.sessionId ", this.sessionId);
    let response = await this._headerFooterService.getCartDetailsV1(this.userId, this.sessionId, 0, 200, "", "", true);
    // console.log(response);
    if (!!response) {
      let cartData = response;
      let products = [];
      if (!!cartData.data && cartData.data.products) {
        products = cartData.data.products;
      }
      //if (!cartData.data.products) cartData.data.products = [];
      this.cartDetails = products;
      // console.log("cartDetails ", this.cartDetails);
    }
  }

  async removeCartProductFromList(item) {
    let cp = this.selectedProductList.filter(p => p.id == item.pId && p.listOfVariants.filter(v => v.id == item.refPvID));
    // console.log("remove cart product from list ", cp);
    if (cp.length > 0 && !!cp[0].listOfVariants && cp[0].listOfVariants.length > 0) {
      if (cp[0].listOfVariants.length == 1) {
        this.selectedProductList = this.selectedProductList.filter(p => p.id != cp[0].id);
        // // console.log("if ", this.selectedProductList, cp[0]);
      } else {
        cp[0].listOfVariants.filter(v => {
          if (v.id == item.refPvID && this.arraysEqual(v.selectedAddOns, item.selectedAddOns)) {
            let newVariants = cp[0].listOfVariants.filter(v => v.id != item.refPvID);
            this.selectedProductList.filter(p => {
              if (p.id == cp[0].id) {
                p.listOfVariants = newVariants;
              }
            });
          }
        });
        // // console.log("ELSE ", this.selectedProductList, cp[0]);
      }
      // console.log("remove cart product from list after ", this.selectedProductList);
    }
  }

  async changeCartProductQtyFromList(item) {
    let cp = this.selectedProductList.filter(p => p.id == item.pId && p.listOfVariants.filter(v => v.id == item.refPvID));
    // console.log("change cart product from list ", cp);
    if (cp.length > 0 && !!cp[0].listOfVariants && cp[0].listOfVariants.length > 0) {
      cp[0].listOfVariants.filter(v => {
        if (v.id == item.refPvID && v.selectedAddOns == item.selectedAddOns) {
          cp[0].selectedQty = item.quantity;
        }
      });
      // // console.log("change cart product from list after ",this.selectedProductList);
    }
  }

  async loadAllCollectionData(data, infiniteScroll) {
    if (!this.onMobile) {
      this.limit = 20;
    }


    let response = await this._collectionService.getCollectionDetailsByNames(data, this.offset, this.limit, this.searchText, null);
    if (response) {
      this.showSkeleton = false;
    }
    if (response.isSuccess && !!response.data && response.data.length > 0) {
      this.collections = response.data;
      this.products = [];
      this.collections.forEach(collection => {
        if(collection.listOfProducts) {
          if(collection.listOfProducts.length>0) {
            collection.listOfProducts[0].collectionCoverImage = collection.coverImage;
          }
          collection.listOfProducts.filter(p => p.productType = collection.description);
          Array.prototype.push.apply(this.products, collection.listOfProducts);
        }
      });
      this.initalizeProductValues();
    }
    // console.log("loadAllCollectionData this.products", this.products);
  }

  async loadAllCollectionDatawithScroll(data, infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit);
    let sessionId = await this.storage.get("sessionID");
    let userId = await this.storage.get("userID");

    let response = await this._collectionService.getCollectionDetailsByNames(data, this.offset, this.limit, this.searchText, null);
    if (response) {
      if (!!response.isSuccess && response.data) {
        this.collections = response.data;
        if (this.collections.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            this.collections.forEach(collection => {
              if(collection.listOfProducts) {
                if(collection.listOfProducts.length>0) {
                  collection.listOfProducts[0].collectionCoverImage = collection.coverImage;
                }
                collection.listOfProducts.filter(p => p.productType = collection.description);
                Array.prototype.push.apply(this.products, collection.listOfProducts);
              }
            });
            this.initalizeProductValues();
            infiniteScroll.target.complete();
            // console.log("this.products2", this.products);
          }
        }

        if (response.length == 1000) {
          infiniteScroll.target.disabled = true;
        }
        // this.products = response;

        // this.products.push(allData);
      } else if(response.error){
        // console.log("error", response.error);
        this.configService.presentToast(response.error, "error");
      }
    }
    console.log("loadAllCollectionDatawithScroll this.products", this.products);

  }

  checkIfVariantParameterAvailable(product) {
    if (!!this.variantAvailable && !!product.listOfProductVariantParameters && product.listOfProductVariantParameters.length > 0) {
      let variantParamExist = product.listOfProductVariantParameters.filter(vp => vp.name == this.variantAvailable.paramName && vp.value == this.variantAvailable.paramValue);
      if (variantParamExist.length > 0) {
        return variantParamExist[0].value + " available";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  cancelSearch(event) {
    // console.log("cancel search ", event);
    this.searchText = "";
    this.limit = 30;
  }

  async getQuickOrderPageDetails() {
    // console.log("getQuickOrderPageDetails ");
    let response = await this._pageService.getPageDetailByPageName(this.quickOrderPage, this.userId);
    if (!!response.isSuccess) {
      // console.log("getQuickOrderPageDetails ", response);
      this.quickOrderPageDetails = response;
    } else {
      // console.error(response.error);
    }
  }
}
