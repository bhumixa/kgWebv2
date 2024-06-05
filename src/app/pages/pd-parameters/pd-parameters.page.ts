import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, NavParams } from '@ionic/angular';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import defaultParams from '../diamond-search/defaultmasterparams';

@Component({
  selector: 'app-pd-parameters',
  templateUrl: './pd-parameters.page.html',
  styleUrls: ['./pd-parameters.page.scss'],
})
export class PdParametersPage implements OnInit {
  public skeleton: false;
  public stoneParameter = [];
  public SSParamList = [];
  public pdObject = {};
  public isDisable = true;
  public filteredPD: any;
  public searchParameter: any;
  public description;
  public descriptionParameter;

  constructor(
    public configService: ConfigServiceService,
    public modalCtrl: ModalController,
    private databaseServiceService: DatabaseServiceService,
    public toastCtrl: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private navParams: NavParams
  ) {}

  async ngOnInit() {
    this.filteredPD = await this.navParams.get('filteredPD');
    this.searchParameter = await this.navParams.get('searchParameter');

    if (this.searchParameter) {
      this.description = this.searchParameter.descriptions.filter(
        (a) => a.isRefined == true
      );
      if (this.description) {
        console.log(this.description);
      }
    }

    await this.getPDParameters();
    if (!!this.filteredPD && Object.keys(this.filteredPD).length > 0) {
      console.log(this.filteredPD);
      for (let key in this.filteredPD) {
        console.log(this.filteredPD, this.filteredPD[key], key);
        let masterNameObj = await defaultParams.parameters.filter((j: any) => {
          if (j.resultObject.prop == key) {
            console.log(j);
            return j;
          }
        });
        let masterName = masterNameObj[0]?.masterName;
        console.log(masterName);

        if (this.description) {
        }
        let valueList = this.filteredPD[key];
        for (let i = 0; i < this.stoneParameter.length; i++) {
          if (this.stoneParameter[i].isGroup == true) {
            this.stoneParameter[i].subParameters.forEach((subparamEl) => {
              console.log(subparamEl.masterName, key);
              if (subparamEl.masterName == masterName) {
                let valueIdList = [];
                subparamEl.parameterValues.forEach((item) => {
                  let flag = valueList.some((val) => val == item.name);
                  if (flag) {
                    item.isSelected = true;
                    valueIdList.push(item.name);
                    this.pdObject[subparamEl.masterName] = valueIdList;
                  } else {
                    item.isSelected = false;
                  }
                });
              }
            });
          } else {
            if (masterName == this.stoneParameter[i].nameGroup) {
              let valueIdList = [];
              this.stoneParameter[i].parameterValues.forEach((item) => {
                let flag = valueList.some((val) => val == item.name);
                if (flag) {
                  item.isSelected = true;
                  valueIdList.push(item.name);
                  this.pdObject[this.stoneParameter[i].masterName] =
                    valueIdList;
                } else {
                  item.isSelected = false;
                }
              });
            }
          }
        }
      }

      console.log(this.stoneParameter, this.pdObject);
    }
  }

  async getPDParameters() {
    await this.databaseServiceService.showLoading();
    let res = await this.databaseServiceService.getPdParameters();
    await this.databaseServiceService.hideLoading();
    let data = res;
    if (!res.isSuccess) {
      let toast = await this.toastCtrl.create({
        message: data.error,
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
    } else {
      let dataList = await data.data.filter((e) => e.masterName != 'Pd Cat');
      this.descriptionParameter = this.description[0]?.para;
      dataList = await dataList.filter(async (el) => {
        if (this.description) {
          if (
            !!this.descriptionParameter &&
            this.descriptionParameter.length > 0
          ) {
            this.descriptionParameter = await this.descriptionParameter.map(
              (x: any) => {
                if (x && x.label) {
                  let resultString = x.label;
                  if (resultString.includes('Code')) {
                    resultString = resultString.replace('Code', '');
                  }
                  return {
                    label: resultString,
                    value: x.value,
                  };
                } else {
                  return x; // Preserve the original object if label is falsy or missing
                }
              }
            );
          }
          console.log(this.descriptionParameter);
        }
        console.log(el.masterName);
        if (el.masterName != 'Pd Cat') {
          el.parameterValues = el.parameterValues.filter((item) => {
            console.log(item);
            if (!item.isDisabled) {
              if (
                !!this.descriptionParameter &&
                this.descriptionParameter.length > 0
              ) {
                let pValues = Array.from(
                  new Set(
                    this.descriptionParameter.filter(
                      (n) => n.label == el.masterName
                    )
                  )
                );

                if (pValues.length > 0) {
                  if (
                    pValues.filter((x: any) => x.value == item.name).length > 0
                  ) {
                    item.isSelected = true;
                  } else {
                    item.isSelected = false;
                  }
                }
              }
              return item;
            }
          });
          return el;
        }
      });
      let data1 = [];
      for (let i = 0; i < dataList.length; i++) {
        if (!!dataList[i].nameGroup) {
          if (data1.length > 0) {
            let flag = data1.some(
              (el) => el.nameGroup === dataList[i].nameGroup
            );
            if (!flag) {
              data1.push({
                id: dataList[i].id,
                nameGroup: dataList[i].nameGroup,
                isGroup: true,
                companyId: dataList[i].companyId,
                downTolerance: dataList[i].companyId,
                masterName: dataList[i].masterName,
                paramMasterId: dataList[i].paramMasterId,
                subParameters: [],
              });
            }
          } else {
            data1.push({
              id: dataList[i].id,
              nameGroup: dataList[i].nameGroup,
              isGroup: true,
              companyId: dataList[i].companyId,
              downTolerance: dataList[i].companyId,
              masterName: dataList[i].masterName,
              paramMasterId: dataList[i].paramMasterId,
              subParameters: [],
            });
          }
        } else {
          let isValueGroup: any;
          let valueGroup1: any;
          console.log(dataList[i].parameterValues);

          if (dataList[i].parameterValues.length > 0) {
            dataList[i].parameterValues.forEach((el) => {
              if (!!el.valueGroup) {
                valueGroup1 = el.valueGroup;
              }
            });
            let flag: Boolean;
            dataList[i].parameterValues = dataList[i].parameterValues.filter(
              function (item) {
                if (item.valueGroup !== valueGroup1) {
                  flag = true;
                  return true; // Keep the item
                } else {
                  return false; // Discard the item
                }
              }
            );
            if (!!flag && flag == true) {
              isValueGroup = true;
            } else {
              isValueGroup = false;
            }
          }
          data1.push({
            id: dataList[i].id,
            nameGroup: dataList[i].masterName,
            isValueGroup: isValueGroup,
            isGroup: false,
            companyId: dataList[i].companyId,
            downTolerance: dataList[i].companyId,
            masterName: dataList[i].masterName,
            paramMasterId: dataList[i].paramMasterId,
            parameterValues: dataList[i].parameterValues,
          });
        }
      }

      for (let i = 0; i < data1.length; i++) {
        if (data1[i].isGroup == true) {
          data1[i].totalsubParamList = [];
          dataList.forEach((el) => {
            if (el.nameGroup == data1[i].nameGroup) {
              data1[i].subParameters.push(el);
            }
          });
          data1[i].subParameters.forEach((el) => {
            data1[i].totalsubParamList.push(el.masterName);
          });
        }
      }

      this.SSParamList = data1;
      this.stoneParameter = JSON.parse(JSON.stringify(this.SSParamList));

      if (Object.keys(this.pdObject).length > 0) {
        this.isDisable = false;
        Object.keys(this.pdObject).forEach((el) => {
          let valueList = this.pdObject[el];
          for (let i = 0; i < this.stoneParameter.length; i++) {
            if (this.stoneParameter[i].isGroup == true) {
              this.stoneParameter[i].subParameters.forEach((subparamEl) => {
                if (subparamEl.masterName == el) {
                  let valueIdList = [];
                  subparamEl.parameterValues.forEach((item) => {
                    let flag = valueList.some((val) => val == item.name);
                    console.log('1', valueList, item.name, item.code, flag);
                    if (flag) {
                      item.isSelected = true;
                      valueIdList.push(item.name);
                      this.pdObject[subparamEl.masterName] = valueIdList;
                    } else {
                      item.isSelected = false;
                    }
                  });
                }
              });
            } else {
              if (el == this.stoneParameter[i].nameGroup) {
                let valueIdList = [];
                this.stoneParameter[i].parameterValues.forEach((item) => {
                  let flag = valueList.some((val) => val == item.name);
                  console.log('2', valueList, item.name, item.code, flag);
                  if (flag) {
                    item.isSelected = true;
                    valueIdList.push(item.name);
                    this.pdObject[this.stoneParameter[i].masterName] =
                      valueIdList;
                  } else {
                    item.isSelected = false;
                  }
                });
              }
            }
          }
        });
      }
    }
  }

  //select sub parameter value

  async selectedPDParameterValue(parameters, sub, stones, index) {
    // console.log(
    //   '\x1b[41m%s\x1b[0m',
    //   'L266 pd-parameters: selectedPDParameterValue: parameters: ',
    //   parameters,
    //   'sub : ',
    //   sub,
    //   'stones: ',
    //   stones,
    //   'index: ',
    //   index
    // );

    const update_isSelected = (): void => {
      stones.forEach((el, i) => {
        if (!!el.valueGroup && el.valueGroup == stones[index].valueGroup) {
          stones[index].isSelected = true;
        } else if (
          !!el.valueGroup &&
          el.valueGroup != stones[index].valueGroup
        ) {
          stones[index].isSelected = false;
        }
      });
    };

    const update_isSelectedForNone = (): void => {
      stones.forEach((el, i) => {
        if (
          (!!el.code && el.code.toLowerCase() == 'non') ||
          el.name.toLowerCase() == 'none'
        ) {
          stones[i].isSelected = false;
        }
      });
    };

    if (parameters.isGroup == true) {
      if (
        (!!stones[index].code && stones[index].code.toLowerCase() == 'non') ||
        stones[index].name.toLowerCase() == 'none'
      ) {
        // stones.forEach(element => {
        //   element.isSelected = false;
        // });
        // stones[index].isSelected = true;
        stones[index].isSelected = !stones[index].isSelected;
        parameters.isValueGroup = false;
      } else {
        /*
        stones.forEach((el, i) => {
          if (
            (!!el.code && el.code.toLowerCase() == 'non') ||
            el.name.toLowerCase() == 'none'
          ) {
            stones[i].isSelected = false;
          }
        });
        */

        update_isSelectedForNone();
        parameters.isValueGroup = false;

        /*
        stones.forEach((el, i) => {
          if (!!el.valueGroup && el.valueGroup == stones[index].valueGroup) {
            stones[index].isSelected = true;
          } else if (
            !!el.valueGroup &&
            el.valueGroup != stones[index].valueGroup
          ) {
            stones[index].isSelected = false;
          }
        });
        */

        update_isSelected();
      }
    } else {
      if (parameters.isValueGroup && parameters.isValueGroup == true) {
        if (
          (!!stones[index].code && stones[index].code.toLowerCase() == 'non') ||
          stones[index].name.toLowerCase() == 'none'
        ) {
          // stones.forEach(element => {
          //   element.isSelected = false;
          // });
          // stones[index].isSelected = true;
          stones[index].isSelected = !stones[index].isSelected;
        } else {
          /*
          stones.forEach((el, i) => {
            if (
              (!!el.code && el.code.toLowerCase() == 'non') ||
              el.name.toLowerCase() == 'none'
            ) {
              stones[i].isSelected = false;
            }
          });
          */

          update_isSelectedForNone();
          parameters.isValueGroup = false;

          /*
          stones.forEach((el, i) => {
            console.log(el);
            console.log(el.valueGroup, stones[index].valueGroup);

            if (!!el.valueGroup && el.valueGroup == stones[index].valueGroup) {
              stones[index].isSelected = true;
            } else if (
              !!el.valueGroup &&
              el.valueGroup != stones[index].valueGroup
            ) {
              stones[index].isSelected = false;
            }
          });
          */

          update_isSelected();
        }
      } else {
        // stones.forEach(element => {
        //   element.isSelected = false;
        // });
        stones[index].isSelected = !stones[index].isSelected;
        // console.log(stones[index])
        // if(stones[index].isSelected){
        //   stones[index].isSelected = false;
        //
        // }else{
        //   stones[index].isSelected = true;
        // }

        // console.log(stones[index])
      }
    }

    const update_pdObject = (keyName: string, valueIdList: string[]): void => {
      let arrayVal = defaultParams.parameters.filter(
        (j) => j.masterName == keyName
      );
      if (arrayVal.length > 0) {
        let mName = arrayVal[0].resultObject.prop;
        keyName = mName;
      }
      if (!!valueIdList.length) {
        this.pdObject[keyName] = valueIdList;
      } else {
        delete this.pdObject[keyName];
      }
    };

    const update_valueIdList = (list: any[], valueIdList: string[]): void => {
      for (let i = 0; i < list.length; i++) {
        if (!!list[i].isSelected && list[i].isSelected === true) {
          valueIdList.push(list[i].name);
        }
      }
    };

    // this.pdObject = {};

    if (
      !!parameters.isValueGroup &&
      parameters.isValueGroup == true &&
      parameters.isGroup == true
    ) {
      let paramList = parameters.subParameters;
      for (let i = 0; i < paramList.length; i++) {
        let valueIdList = [];
        let valueList = paramList[i].parameterValues;

        /*
        for (let j = 0; j < valueList.length; j++) {
          if (!!valueList[j].isSelected && valueList[j].isSelected == true) {
            valueIdList.push(valueList[j].name);
          }
        }
        */

        update_valueIdList(valueList, valueIdList);

        /*
        if (valueIdList.length > 0) {
          //this.pdObject[paramList[i].masterName] = valueIdList;
          let keyName = paramList[i].masterName;

          let arrayVal = defaultParams.parameters.filter(
            j => j.masterName == keyName
          );
          if (arrayVal.length > 0) {
            let mName = arrayVal[0].resultObject.prop;
            keyName = mName;
          }
          this.pdObject[keyName] = valueIdList;
        }
        */

        let keyName = paramList[i].masterName;
        update_pdObject(keyName, valueIdList);
      }
    }
    if (parameters.isValueGroup == false && parameters.isGroup == true) {
      let paramList = parameters.subParameters;
      for (let i = 0; i < paramList.length; i++) {
        let valueIdList = [];
        let valueList = paramList[i].parameterValues;

        /*
        for (let j = 0; j < valueList.length; j++) {
          if (!!valueList[j].isSelected && valueList[j].isSelected == true) {
            valueIdList.push(valueList[j].name);
          }
        }
        */

        update_valueIdList(valueList, valueIdList);

        /*
        if (valueIdList.length > 0) {
          //this.pdObject[paramList[i].masterName] = valueIdList;
          let keyName = paramList[i].masterName;
          let arrayVal = defaultParams.parameters.filter(
            j => j.masterName == keyName
          );
          if (arrayVal.length > 0) {
            let mName = arrayVal[0].resultObject.prop;
            keyName = mName;
          }
          this.pdObject[keyName] = valueIdList;
        }
        */

        let keyName = paramList[i].masterName;
        update_pdObject(keyName, valueIdList);
      }
    } else if (parameters.isGroup == false && parameters.isValueGroup == true) {
      let paramList = stones;
      let valueIdList = [];

      /*
      for (let i = 0; i < paramList.length; i++) {
        if (paramList[i].isSelected == true) {
          valueIdList.push(paramList[i].name);
        }
      }
      */

      update_valueIdList(paramList, valueIdList);

      /*
      if (valueIdList.length > 0) {
        //this.pdObject[parameters.nameGroup] = valueIdList;
        let keyName = parameters.nameGroup;
        let arrayVal = defaultParams.parameters.filter(
          j => j.masterName == keyName
        );
        if (arrayVal.length > 0) {
          let mName = arrayVal[0].resultObject.prop;
          keyName = mName;
        }
        this.pdObject[keyName] = valueIdList;
      }
      */

      let keyName = parameters.nameGroup;
      update_pdObject(keyName, valueIdList);
    } else if (
      parameters.isGroup == false &&
      parameters.isValueGroup == false
    ) {
      let paramList = stones;
      let valueIdList = [];

      /*
      for (let i = 0; i < paramList.length; i++) {
        if (paramList[i].isSelected == true) {
          valueIdList.push(paramList[i].name);
        }
      }
      */

      update_valueIdList(paramList, valueIdList);

      /*
      if (valueIdList.length > 0) {
        //this.pdObject[parameters.nameGroup] = valueIdList;
        let keyName = parameters.nameGroup;
        let arrayVal = defaultParams.parameters.filter(
          j => j.masterName == keyName
        );
        if (arrayVal.length > 0) {
          let mName = arrayVal[0].resultObject.prop;
          keyName = mName;
        }
        this.pdObject[keyName] = valueIdList;
      }
      */

      let keyName = parameters.nameGroup;
      update_pdObject(keyName, valueIdList);
    }

    // console.log(
    //   '\x1b[43m%s\x1b[0m',
    //   'L496 pd-parameters this.stoneParameter :',
    //   this.stoneParameter
    // );
    // console.log(
    //   '\x1b[43m%s\x1b[0m',
    //   'L496 pd-parameters this.pdObject :',
    //   this.pdObject
    // );
    this.configService.pdParameterSet({ data: this.pdObject });
    //this.pdEvent.emit({'pdObject': this.pdObject});
  }

  clear() {
    this.pdObject = {};
    this.configService.pdParameterSet({ data: this.pdObject });
    this.stoneParameter = JSON.parse(JSON.stringify(this.SSParamList));
    this.configService.pdParameterSet({ data: this.pdObject });
  }

  addFilters() {
    this.modalCtrl.dismiss(this.pdObject);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
