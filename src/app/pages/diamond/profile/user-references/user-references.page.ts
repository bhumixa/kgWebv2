import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { CompanyService } from 'src/app/service/company/company.service';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-user-references',
  templateUrl: './user-references.page.html',
  styleUrls: ['./user-references.page.scss'],
})
export class UserReferencesPage implements OnInit {

  validations_formAddAdress: UntypedFormGroup;
  public companyTypes: any = [
    { name: "Retailer", selected: false },
    { name: "Dealer", selected: false },
    { name: "Jwelery Mfg", selected: false },
    { name: "Broker", selected: false },
    { name: "Consumer", selected: false },
    { name: "Other", selected: false }

  ];
  constructor(
    public _companyService: CompanyService,
    public formBuilder: UntypedFormBuilder,
  ) {

  }

  ngOnInit() {

    this.validations_formAddAdress = this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      address: new UntypedFormControl('', Validators.required),
      block: new UntypedFormControl('', Validators.required),
      street: new UntypedFormControl('', Validators.required),
      city: new UntypedFormControl("", Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')])),
      state: new UntypedFormControl("", Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')]) ),
      zip: new UntypedFormControl("", Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern("^[0-9-.]+$")])),
      country: new UntypedFormControl('', Validators.required),

      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),

      phone: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^[0-9-.]+$')
      ])),

    });
  }
  validation_messages = {
    'name': [{ type: 'required', message: 'First Name is required.' }],
    'address': [{ type: 'required', message: 'Last name is required.' }],
    'block': [{ type: 'required', message: 'Block is required.' }],
    'street': [{ type: 'required', message: 'Street is required.' }],
    'city': [{ type: 'required', message: 'City is required.' }],
    'state': [{ type: 'required', message: 'State is required.' }],
    'zip': [{ type: 'required', message: 'Zip Code is required.' }],
    'country': [{ type: 'required', message: 'Country is required.' }],

    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 5 digits long.' },
      { type: 'maxlength', message: 'Phone cannot be more than 25 digits long.' },
      { type: 'pattern', message: 'Phone username must contain only numbers.' },
    ],

  };

  onSubmit(values) {
    // console.log(values);
    //this.router.navigate(["/user"]);

    // const formData: FormData = new FormData();
    // formData.append("file", this.selectedFile);
    // // console.log("form data", formData);


  }

  changeListener(event): void {
    let selectedFile = <File>event.target.files[0];
    // console.log("file ", selectedFile);
    //let extension = "";
    // if (!!selectedFile) {
    // extension = this.selectedFile.name.split(".")[this.selectedFile.name.split(".").length - 1];
    // // console.log("extension ", extension, this.selectedFile.name.split("."));
    // if (!!extension && extension != "xlsx" && extension != "xls") {
    // this._configService.presentToast("Please select excel file.", "error");
    // this.selectedFile = null;
    // }
    // }


  }
  async toggleSelection(para, val) {
    this.companyTypes.filter(a => a.name == val)[0].selected = !this.companyTypes.filter(a => a.name == val)[0].selected;
  }
}
