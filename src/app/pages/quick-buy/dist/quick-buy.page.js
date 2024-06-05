"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.QuickBuyPage = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var login_form_component_1 = require("../../components/login-form/login-form.component");
var QuickBuyPage = /** @class */ (function () {
    function QuickBuyPage(route, storage, router, _databaseService, _configService, formBuilder, events, platform, changeRef, modalController) {
        var _this_1 = this;
        this.route = route;
        this.storage = storage;
        this.router = router;
        this._databaseService = _databaseService;
        this._configService = _configService;
        this.formBuilder = formBuilder;
        this.events = events;
        this.platform = platform;
        this.changeRef = changeRef;
        this.modalController = modalController;
        this.buttonDisabled = false;
        this.selectedAddressType = "Delivery";
        this.country = "India";
        this.city = "";
        this.state = "";
        this.businessType = "";
        this.skip = 0;
        this.showSkeleton = true;
        this.orderNo = 0;
        this.limit = 10;
        this.collectiveValue = 0;
        this.orderBook = "";
        this.shippingCost = 0;
        this.validation_messages = {
            name: [{ type: "required", message: "First Name is required." }],
            address: [{ type: "required", message: "Address is required." }],
            block: [{ type: "required", message: "Block is required." }],
            street: [{ type: "required", message: "Street is required." }],
            city: [{ type: "required", message: "City is required." }],
            state: [{ type: "required", message: "State is required." }],
            zip: [{ type: "required", message: "Zip Code is required." }, { type: "minlength", message: "Zip Code be at least 4 digits long." }, { type: "pattern", message: "Zip Code must contain only numbers." }],
            country: [{ type: "required", message: "Country is required." }],
            // email: [{ type: "required", message: "Email is required." }, { type: "pattern", message: "Please enter a valid email." }],
            phone: [{ type: "required", message: "Phone is required." }, { type: "minlength", message: "Phone must be at least 5 digits long." }, { type: "maxlength", message: "Phone cannot be more than 25 digits long." }, { type: "pattern", message: "Phone username must contain only numbers." }],
            shipMode: [{ type: "required", message: "Please select shipment mode." }],
            payMode: [{ type: "required", message: "Please select payment mode." }]
        };
        this.platform.ready().then(function () {
            // console.log("this.platform", _this_1.platform);
            if (_this_1.platform.is("desktop") || _this_1.platform.is("mobileweb")) {
                _this_1.onMobile = false;
            }
            else {
                _this_1.onMobile = true;
            }
            // console.log("this.onMobile", _this_1.onMobile);
        });
        this.validations_form = this.formBuilder.group({
            name: new forms_1.FormControl("", forms_1.Validators.required),
            address: new forms_1.FormControl("", forms_1.Validators.required),
            block: new forms_1.FormControl(""),
            street: new forms_1.FormControl("", forms_1.Validators.required),
            city: new forms_1.FormControl("", forms_1.Validators.required),
            state: new forms_1.FormControl("", forms_1.Validators.required),
            zip: new forms_1.FormControl("", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4), forms_1.Validators.pattern("^[0-9-.]+$")])),
            country: new forms_1.FormControl("", forms_1.Validators.required),
            // email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
            phone: new forms_1.FormControl("", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(25), forms_1.Validators.minLength(5)])),
            shipMode: new forms_1.FormControl("", forms_1.Validators.required),
            payMode: new forms_1.FormControl("", forms_1.Validators.required)
        });
    }
    QuickBuyPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadCompanyData()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCartDetails()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getAllShippingMethod()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getAllPaymentList()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getAllViewActions()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.loadCompanyData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._databaseService.companyObj) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._databaseService.setCompanyInfo()];
                    case 1:
                        res = _a.sent();
                        this.setConfig();
                        return [3 /*break*/, 3];
                    case 2:
                        this.setConfig();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.onSubmit = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log("on submit ", values);
                        if (!!this.userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createUser()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.userVerified()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.userVerified = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._databaseService.checkUserExistByPhoneNo(this.phone.toString().replace("+", ""))];
                    case 1:
                        res2 = _a.sent();
                        if (!res2.isSuccess) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.login(res2)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!this.addressId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.saveAddress()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.placeOrder()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.setConfig = function () {
    };
    QuickBuyPage.prototype.getAllPaymentList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._databaseService.getAllPaymentMethod()];
                    case 1:
                        res = _a.sent();
                        if (res.status == 0) {
                            // console.log("error");
                        }
                        else {
                            response = res.data;
                            if (!!response && response.length > 0) {
                                this.paymentModeList = response;
                                this.paymentMode = response[0];
                            }
                            else {
                                this._configService.presentToast("Payment Mode Not Found", "error");
                            }
                            // console.log("getAllPaymentList ", this.paymentModeList, this.paymentMode);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.getAllShippingMethod = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._databaseService.getAllShippingMethod(this.selectedAddressType)];
                    case 1:
                        res = _a.sent();
                        if (res.status == 0) {
                            // console.log("error");
                        }
                        else {
                            this.shippingMethods = res.data;
                            this.shipmentMode = this.shippingMethods[0].id;
                            // await this.shipModeSelected();
                            // console.log("getAllShippingMethod res", res, this.shippingMethods);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.getAreaByZipCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.country == "India")) return [3 /*break*/, 2];
                        this.pinCode = this.validations_form.get("zip").value;
                        if (!(this.pinCode && this.pinCode != "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._databaseService.getAreaByPinCode(this.pinCode.toString())];
                    case 1:
                        res = _a.sent();
                        if (res.isSuccess) {
                            this.validations_form.get("city").setValue(res.data[0].city);
                            this.validations_form.get("state").setValue(res.data[0].state);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.createUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res1, loginWithApp, loginWithApp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this._databaseService.checkUserExistByPhoneNo(this.phone.toString().replace("+", ""))];
                    case 1:
                        res1 = _a.sent();
                        if (!res1.isSuccess) return [3 /*break*/, 6];
                        if (!(res1.error == "Your account is deactivated. Kindly contact the administrator.")) return [3 /*break*/, 2];
                        this._configService.presentToast(res1.error, "error");
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, this._databaseService.LoginWithApp({
                            mobNumbers: this.phone.toString().replace("+", ""),
                            email: "",
                            password: this.password,
                            name: this.name
                        })];
                    case 3:
                        loginWithApp = _a.sent();
                        if (!(loginWithApp == true)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.verifyUser()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        if (!(!res1.isSuccess && res1.error == "Your account is deactivated. Kindly contact the administrator.")) return [3 /*break*/, 7];
                        this._configService.presentToast("Your account is deactivated. Kindly contact the administrator.", "error");
                        return [3 /*break*/, 10];
                    case 7:
                        //create user with mobile number
                        this.password = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
                        return [4 /*yield*/, this._databaseService.LoginWithApp({
                                mobNumbers: this.phone.toString().replace("+", ""),
                                email: "",
                                password: this.password,
                                name: this.name
                            })];
                    case 8:
                        loginWithApp = _a.sent();
                        if (!(loginWithApp == true)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.verifyUser()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.login = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cartRes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.storage.get("sessionID")];
                    case 1:
                        _a.sessionID = _b.sent();
                        this.userId = response.data.id;
                        this._configService.userNumber = "" + this.phone.toString().replace("+", "");
                        this.userData = response.data;
                        return [4 /*yield*/, this.storage.set("userData", response.data)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.storage.set("loggedInUser", this._configService.userNumber)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.storage.set("userID", response.data.id)];
                    case 4:
                        _b.sent();
                        if (!(response.data.userType == null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.storage.set("userType", "User")];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.storage.set("userType", response.data.userType)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [4 /*yield*/, this.storage.set(this._configService.TOKEN_KEY, response.data.accessToken)];
                    case 9:
                        _b.sent();
                        window.fcWidget.setExternalId(response.data.id);
                        // To set user name
                        window.fcWidget.user.setFirstName(response.data.name);
                        // To set user email
                        window.fcWidget.user.setEmail(response.data.email);
                        // To set user properties
                        window.fcWidget.user.setProperties({
                            phone: response.data.username,
                            status: "Active" // meta property 2
                        });
                        // console.log("sessionID", this.sessionID);
                        return [4 /*yield*/, this._databaseService.setCartForCustomer(response.data.id, this.sessionID)];
                    case 10:
                        cartRes = _b.sent();
                        // console.log("user is", this._configService.userNumber);
                        // window["heap"].identify(this._configService.userNumber);
                        // window["heap"].addUserProperties({ appName: this._configService.appName });
                        this.events.publish("user:LOGGEDIN", "loggedIn");
                        return [4 /*yield*/, this.insertLoginView()];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.insertLoginView = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, sessionId, userID, sParams, loginAction, jsonObj, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = document.URL;
                        return [4 /*yield*/, this.storage.get("sessionID")];
                    case 1:
                        sessionId = _a.sent();
                        return [4 /*yield*/, this.storage.get("userID")];
                    case 2:
                        userID = _a.sent();
                        return [4 /*yield*/, this.getAllViewActions()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this._databaseService.getSearchParameters()];
                    case 4:
                        sParams = _a.sent();
                        if (sParams) {
                            if (sParams.has("utm_source")) {
                                utm_source = sParams.get("utm_source");
                            }
                            if (sParams.has("utm_medium")) {
                                utm_medium = sParams.get("utm_medium");
                            }
                            if (sParams.has("utm_campaign")) {
                                utm_campaign = sParams.get("utm_campaign");
                            }
                            if (sParams.has("utm_term")) {
                                utm_term = sParams.get("utm_term");
                            }
                            if (sParams.has("utm_content")) {
                                utm_content = sParams.get("utm_content");
                            }
                        }
                        loginAction = 6;
                        if (!!this.allViewActions && !!this.allViewActions.login) {
                            loginAction = this.allViewActions.login;
                        }
                        jsonObj = {
                            sessionId: sessionId,
                            ipAddress: null,
                            actionId: loginAction,
                            refUserId: userID,
                            refProductId: null,
                            refPcID: null,
                            utm_source: utm_source,
                            utm_medium: utm_medium,
                            utm_campaign: utm_campaign,
                            utm_term: utm_term,
                            utm_content: utm_content
                        };
                        return [4 /*yield*/, this._databaseService.insertView(jsonObj)];
                    case 5:
                        res = _a.sent();
                        if (res.status == 0) {
                            // console.log("error");
                        }
                        else {
                            // console.log("login view insert res", res);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.getAllViewActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._databaseService.getAllViewActions()];
                    case 1:
                        res = _a.sent();
                        if (res.status == 0) {
                            // console.log("error");
                        }
                        else {
                            this.allViewActions = res.data;
                            // console.log("getAllViewActions res", res, this.allViewActions);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.saveAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pin, addressObj, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.buttonDisabled = true;
                        if (!(!this.name && !this.city && !this.country && !this.pinCode && !this.state && !this.userId && !this.phone)) return [3 /*break*/, 1];
                        // console.log("if");
                        this._configService.presentToast("please select all fields", "error");
                        return [3 /*break*/, 5];
                    case 1:
                        pin = this.validations_form.get("zip").value;
                        addressObj = {
                            id: this._databaseService.refCompanyId,
                            fullName: this.validations_form.get("name").value,
                            phoneNo: this.validations_form
                                .get("phone")
                                .value.toString()
                                .replace("+", ""),
                            area: this.validations_form.get("street").value,
                            city: this.validations_form.get("city").value,
                            country: this.validations_form.get("country").value,
                            house: this.validations_form.get("address").value,
                            block: this.validations_form.get("block").value,
                            pinCode: parseInt(pin),
                            state: this.validations_form.get("state").value,
                            defaultAddress: true,
                            CCId: parseInt(this.userId),
                            email: "",
                            businessType: this.businessType
                        };
                        return [4 /*yield*/, this._databaseService.showLoading()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._databaseService.insertAddress(addressObj)];
                    case 3:
                        res = _a.sent();
                        return [4 /*yield*/, this._databaseService.hideLoading()];
                    case 4:
                        _a.sent();
                        if (!!res.isSuccess) {
                            this.buttonDisabled = false;
                            this._configService.presentToast("Your Address have been saved.", "success");
                            this.addressId = res.data.id;
                            // this.name = "";
                            // this.phone = "";
                            // this.pinCode = "";
                            // this.house = "";
                            // this.city = "";
                            // this.state = "";
                            // this.country = "";
                        }
                        else {
                            this.buttonDisabled = false;
                            // console.log(res.error);
                            try {
                                if (res.error.message) {
                                    this._configService.presentToast(res.error.message, "error");
                                }
                            }
                            catch (e) {
                                if (res.error) {
                                    this._configService.presentToast(res.error, "error");
                                }
                            }
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.getCartDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, orderBook;
            var _this_1 = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.storage.get("userID")];
                    case 1:
                        _a.userId = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.storage.get("sessionID")];
                    case 2:
                        _b.sessionID = _c.sent();
                        // console.log(this.userId, this.sessionID);
                        orderBook = "";
                        if (this.orderNo) {
                            orderBook = "Temp";
                        }
                        this._databaseService.getCartDetailsV1(this.userId, this.sessionID, this.skip * this.limit, this.limit, "", orderBook, true, this.orderNo).then(function (response) {
                            if (response) {
                                _this_1.showSkeleton = false;
                            }
                            if (!!response && !!response) {
                                _this_1.cartData = response;
                                if (!!_this_1.cartData && !!_this_1.cartData.data.products && _this_1.cartData.data.products.length > 0) {
                                    _this_1.totalWithShipCost = parseFloat(_this_1.cartData.data.count.FinalPrice) + _this_1.shippingCost;
                                }
                            }
                            else {
                                // console.log("error", response.error);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.checkCollectiveAmount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.collectiveValue != 0) {
                    if (isNaN(this.collectiveValue) || this.collectiveValue < this.cartData.data.count.FinalPrice) {
                        return [2 /*return*/, false];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                }
                else {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/];
            });
        });
    };
    QuickBuyPage.prototype.placeOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, res, checkValidation;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.buttonDisabled = true;
                        return [4 /*yield*/, this._databaseService.showLoading()];
                    case 1:
                        _c.sent();
                        _a = this;
                        return [4 /*yield*/, this.storage.get("userID")];
                    case 2:
                        _a.userId = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.storage.get("loggedInUser")];
                    case 3:
                        _b.loggedInUser = _c.sent();
                        return [4 /*yield*/, this._databaseService.checkQuantityValidation(this.userId)];
                    case 4:
                        res = _c.sent();
                        // console.log("place order ", res, this.paymentMode.isOnline);
                        return [4 /*yield*/, this.checkCollectiveAmount()];
                    case 5:
                        checkValidation = _c.sent();
                        if (!checkValidation) return [3 /*break*/, 21];
                        if (!!!res.isSuccess) return [3 /*break*/, 19];
                        if (!this.onMobile) return [3 /*break*/, 12];
                        if (!(!this.paymentMode.isOnline || this.paymentMode.isOnline == 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.confirmOrder()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this._databaseService.hideLoading()];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, this.payWithRazorForMobile()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, this._databaseService.hideLoading()];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11: return [3 /*break*/, 18];
                    case 12:
                        if (!(!this.paymentMode.isOnline || this.paymentMode.isOnline == 0)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.confirmOrder()];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, this._databaseService.hideLoading()];
                    case 14:
                        _c.sent();
                        return [3 /*break*/, 18];
                    case 15: return [4 /*yield*/, this.payWithRazor()];
                    case 16:
                        _c.sent();
                        return [4 /*yield*/, this._databaseService.hideLoading()];
                    case 17:
                        _c.sent();
                        _c.label = 18;
                    case 18: return [3 /*break*/, 20];
                    case 19:
                        this.buttonDisabled = false;
                        this._configService.presentToast(res.error, "error");
                        _c.label = 20;
                    case 20: return [3 /*break*/, 22];
                    case 21:
                        this.buttonDisabled = false;
                        this._configService.presentToast("Please enter valid collectible amount", "error");
                        _c.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.confirmOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, sessionId, sParams, res, orderObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = document.URL;
                        return [4 /*yield*/, this.storage.get("sessionID")];
                    case 1:
                        sessionId = _a.sent();
                        return [4 /*yield*/, this._databaseService.getSearchParameters()];
                    case 2:
                        sParams = _a.sent();
                        if (sParams) {
                            if (sParams.has("utm_source")) {
                                utm_source = sParams.get("utm_source");
                            }
                            if (sParams.has("utm_medium")) {
                                utm_medium = sParams.get("utm_medium");
                            }
                            if (sParams.has("utm_campaign")) {
                                utm_campaign = sParams.get("utm_campaign");
                            }
                            if (sParams.has("utm_term")) {
                                utm_term = sParams.get("utm_term");
                            }
                            if (sParams.has("utm_content")) {
                                utm_content = sParams.get("utm_content");
                            }
                        }
                        if (!(!!this.userId && !!this.addressId)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._databaseService.orderCart(parseInt(this.userId), this.addressId, this.paymentMode.id, this.shipmentMode, utm_source, utm_medium, utm_campaign, utm_term, utm_content, sessionId, "", null, this.orderBook, this.selectedAddressType, "", this.orderNo, parseFloat(this.collectiveValue))];
                    case 3:
                        res = _a.sent();
                        // console.log("res", res);
                        if (!!!res.isSuccess) return [3 /*break*/, 5];
                        this.orderResponse = res;
                        if (res) {
                            if (this.paymentMode.isOnline) {
                                orderObj = {
                                    razorpay_order_id: this.paymentResponse.razorpay_order_id,
                                    paymentID: this.paymentResponse.razorpay_payment_id,
                                    razorpay_signature: this.paymentResponse.razorpay_signature,
                                    orderID: this.orderResponse.data.id,
                                    status: "Attempted",
                                    isAlloted: 0
                                };
                                this.addOrderDetailsInTalkBrite(orderObj);
                                this.changeRef.detectChanges();
                            }
                            this.buttonDisabled = false;
                            this.reset();
                            this.router.navigate(["/manage-order-details/" + this.orderResponse.data.id, { hideBackButton: true, pendingInfo: false }]);
                            // this.router.navigate(["/orders", { hideBackButton: true }]);
                        }
                        this._configService.presentToast("You  Order  is placed successfully", "success");
                        return [4 /*yield*/, this.events.publish("cartChanged")];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this.buttonDisabled = false;
                        console.error(res.error);
                        this._configService.presentToast(res.error, "error");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this.buttonDisabled = false;
                        this._configService.presentToast("Please Select All Details", "error");
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.addOrderDetailsInTalkBrite = function (orderObj) {
        return __awaiter(this, void 0, void 0, function () {
            var orderRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._databaseService.paymentInfoInTalkbrite(orderObj)];
                    case 1:
                        orderRes = _a.sent();
                        // console.log("orderRes", orderRes);
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.payWithRazor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderObj, orderInRazorPay, _this, options, rzp1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log(this.paymentMode, this.total);
                        if (!!!this.paymentMode) return [3 /*break*/, 5];
                        orderObj = {
                            amount: parseFloat(this.totalWithShipCost) * 100,
                            currency: "INR",
                            receipt: this.userId,
                            payment_capture: 0
                        };
                        orderObj.amount = parseInt(orderObj.amount);
                        return [4 /*yield*/, this._databaseService.createOrderInRazorPay(orderObj)];
                    case 1:
                        orderInRazorPay = _a.sent();
                        this.orderInRazorPay = orderInRazorPay;
                        if (!orderInRazorPay.isSuccess) return [3 /*break*/, 2];
                        this.buttonDisabled = false;
                        _this = this;
                        options = {
                            description: "",
                            order_id: orderInRazorPay.data.id,
                            currency: "INR",
                            key: this._companyService.razorpayKey,
                            amount: parseFloat(this.totalWithShipCost) * 100,
                            name: "Place Your order here",
                            prefill: {
                                email: this.userData.email,
                                contact: this.userData.username,
                                name: this.userData.name
                            },
                            modal: {
                                ondismiss: function () {
                                    // alert("dismissed");
                                }
                            },
                            handler: function (paymentRes) {
                                // console.log("response", paymentRes);
                                if (paymentRes) {
                                    _this.paymentResponse = paymentRes;
                                    _this.confirmOrder();
                                }
                            }
                        };
                        options.amount = parseInt(options.amount);
                        rzp1 = new Razorpay(options);
                        rzp1.open();
                        return [3 /*break*/, 4];
                    case 2:
                        this.buttonDisabled = false;
                        return [4 /*yield*/, this._configService.presentToast("Payment wasn't successfull. Please contact administrator.", "error")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.buttonDisabled = false;
                        this._configService.presentToast("Please Select Payment Mode", "error");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.payWithRazorForMobile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderObj, orderInRazorPay, options;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log(this.paymentMode, this.totalWithShipCost);
                        if (!!!this.paymentMode) return [3 /*break*/, 5];
                        orderObj = {
                            amount: parseFloat(this.totalWithShipCost) * 100,
                            currency: "INR",
                            receipt: this.userId,
                            payment_capture: 0
                        };
                        orderObj.amount = parseInt(orderObj.amount);
                        return [4 /*yield*/, this._databaseService.createOrderInRazorPay(orderObj)];
                    case 1:
                        orderInRazorPay = _a.sent();
                        this.orderInRazorPay = orderInRazorPay;
                        if (!orderInRazorPay.isSuccess) return [3 /*break*/, 2];
                        this.buttonDisabled = false;
                        options = {
                            description: "",
                            order_id: orderInRazorPay.data.id,
                            currency: "INR",
                            key: this._companyService.razorpayKey,
                            amount: parseFloat(this.totalWithShipCost) * 100,
                            name: "Place Your order here",
                            prefill: {
                                email: this.userData.email,
                                contact: this.userData.username,
                                name: this.userData.name
                            },
                            modal: {
                                ondismiss: function () {
                                    // alert("dismissed");
                                }
                            }
                        };
                        options.amount = parseInt(options.amount);
                        // console.log("options.amount", options.amount);
                        RazorpayCheckout.open(options);
                        RazorpayCheckout.on("payment.success", function (paymentRes) {
                            _this_1.paymentResponse = paymentRes;
                            _this_1.confirmOrder();
                            // console.log("paymentRes", paymentRes);
                        });
                        RazorpayCheckout.on("payment.cancel", function (error) {
                            alert(error.description + " (Error " + error.code + ")");
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        this.buttonDisabled = false;
                        return [4 /*yield*/, this._configService.presentToast("Payment wasn't successfull. Please contact administrator.", "error")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.buttonDisabled = false;
                        this._configService.presentToast("Please Select Payment Mode", "error");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.shipModeSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, shipCost_1, perKgRate_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!this.shipmentMode) return [3 /*break*/, 5];
                        if (!!!this.country) return [3 /*break*/, 5];
                        res = void 0;
                        return [4 /*yield*/, this._databaseService.findByShipModeAndCountry(this.shipmentMode, this.country)];
                    case 1:
                        res = _a.sent();
                        if (!(res.status == 0)) return [3 /*break*/, 2];
                        // console.log("error");
                        return [3 /*break*/, 5];
                    case 2:
                        // console.log("findByShipModeAndCountry res", res);
                        data = res.data;
                        if (!(!!this.cartData && !!this.cartData.data.products && this.cartData.data.products.length > 0)) return [3 /*break*/, 5];
                        if (!(!!data && !!this.cartData && !!this.cartData.data.products && this.cartData.data.products.length > 0)) return [3 /*break*/, 4];
                        // console.log("findByShipModeAndCountry data", data);
                        shipCost_1 = 0;
                        perKgRate_1 = data.perKgRate;
                        return [4 /*yield*/, this.cartData.data.forEach(function (data) {
                                shipCost_1 = shipCost_1 + data.shippingWeight * data.quantity * perKgRate_1;
                            })];
                    case 3:
                        _a.sent();
                        // console.log("shipCost ", shipCost_1);
                        if (shipCost_1 > 0) {
                            this.shippingCost = shipCost_1;
                            this.totalWithShipCost = this.cartData.data.count.FinalPrice + this.shippingCost;
                            // console.log("ship cost added ", this.cartData.data.count.FinalPrice, typeof this.cartData.data.count.FinalPrice, this.shippingCost, typeof this.shippingCost, this.totalWithShipCost, typeof this.totalWithShipCost);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.shippingCost = 0;
                        this.totalWithShipCost = parseFloat(this.cartData.data.count.FinalPrice) + this.shippingCost;
                        // console.log("ship cost removed ", this.totalWithShipCost);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.reset = function () {
        this.phone = "";
        this.name = "";
        this.pinCode = "";
        this.city = "";
        this.state = "";
        this.country = "";
        this.validations_form.get("address").setValue("");
        this.validations_form.get("street").setValue("");
        this.validations_form.get("block").setValue("");
    };
    QuickBuyPage.prototype.verifyUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.insertQuickBuyInitiatedView()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.modalController.create({
                                component: login_form_component_1.LoginFormComponent,
                                componentProps: {
                                    Mobile: this.phone,
                                    popup: true,
                                    pinBox: true,
                                    quickBuyVerify: true
                                }
                            })];
                    case 2:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 3:
                        _a.sent();
                        modal.onDidDismiss().then(function (data) {
                            if (data.data) {
                                // OTP verified hence proceed with order flow
                                _this_1.insertQuickBuyVerifiedView();
                                _this_1.userVerified();
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.setSearchParameters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._databaseService.getSearchParameters()];
                    case 1:
                        sParams = _a.sent();
                        if (sParams) {
                            if (sParams.has("utm_source")) {
                                this.utm_source = sParams.get("utm_source");
                            }
                            if (sParams.has("utm_medium")) {
                                this.utm_medium = sParams.get("utm_medium");
                            }
                            if (sParams.has("utm_campaign")) {
                                this.utm_campaign = sParams.get("utm_campaign");
                            }
                            if (sParams.has("utm_term")) {
                                this.utm_term = sParams.get("utm_term");
                            }
                            if (sParams.has("utm_content")) {
                                this.utm_content = sParams.get("utm_content");
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.insertQuickBuyInitiatedView = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, userID, action, jsonObj, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get("sessionID")];
                    case 1:
                        sessionId = _a.sent();
                        return [4 /*yield*/, this.storage.get("userID")];
                    case 2:
                        userID = _a.sent();
                        action = 10;
                        if (!!this.allViewActions && !!this.allViewActions.quickBuyWithOTPInitiated) {
                            action = this.allViewActions.quickBuyWithOTPInitiated;
                        }
                        jsonObj = {
                            sessionId: sessionId,
                            ipAddress: null,
                            actionId: action,
                            refUserId: userID,
                            refProductId: null,
                            refPcID: null,
                            utm_source: this.utm_source,
                            utm_medium: this.utm_medium,
                            utm_campaign: this.utm_campaign,
                            utm_term: this.utm_term,
                            utm_content: this.utm_content,
                            phoneNo: this.phone.toString().replace("+", "")
                        };
                        return [4 /*yield*/, this._databaseService.insertView(jsonObj)];
                    case 3:
                        res = _a.sent();
                        if (res.status == 0) {
                            // console.log("error");
                        }
                        else {
                            // console.log("login view insert res", res);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage.prototype.insertQuickBuyVerifiedView = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, userID, action, jsonObj, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get("sessionID")];
                    case 1:
                        sessionId = _a.sent();
                        return [4 /*yield*/, this.storage.get("userID")];
                    case 2:
                        userID = _a.sent();
                        action = 11;
                        if (!!this.allViewActions && !!this.allViewActions.quickBuyWithOTPVerified) {
                            action = this.allViewActions.quickBuyWithOTPVerified;
                        }
                        jsonObj = {
                            sessionId: sessionId,
                            ipAddress: null,
                            actionId: action,
                            refUserId: userID,
                            refProductId: null,
                            refPcID: null,
                            utm_source: this.utm_source,
                            utm_medium: this.utm_medium,
                            utm_campaign: this.utm_campaign,
                            utm_term: this.utm_term,
                            utm_content: this.utm_content,
                            phoneNo: this.phone.toString().replace("+", "")
                        };
                        return [4 /*yield*/, this._databaseService.insertView(jsonObj)];
                    case 3:
                        res = _a.sent();
                        if (res.status == 0) {
                            // console.log("error");
                        }
                        else {
                            // console.log("login view insert res", res);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QuickBuyPage = __decorate([
        core_1.Component({
            selector: 'app-quick-buy',
            templateUrl: './quick-buy.page.html',
            styleUrls: ['./quick-buy.page.scss']
        })
    ], QuickBuyPage);
    return QuickBuyPage;
}());
exports.QuickBuyPage = QuickBuyPage;
