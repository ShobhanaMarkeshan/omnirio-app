import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeDetail } from '../app.component';

@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrls: ['./add-emp.component.scss']
})
export class AddEmpComponent implements OnInit {

  empFormObj;
  isDegreeEnable = true;
  isWorkEnable = true;
  constructor(
    readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDetail>,
  ) { }

  ngOnInit(): void {
    this.empFormObj = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      middleName: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      lastName: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      isDegreeCompleted: ['1'],
      certifiedIn: ['', [Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      college: ['', [Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      yearOfCompletion: ['', [Validators.maxLength(4)]],
      isCurrentlyWorking: ['1'],
      current_Off: ['', [Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      exp: ['', [Validators.maxLength(60), Validators.pattern('^[A-Za-z0-9" "]*$')]],
      address: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  saveEmp() {
    const formValue = this.empFormObj.value;
    let isDegreeFormValid = formValue.isDegreeCompleted === '1' ?
      !(!formValue.certifiedIn || !formValue.college || !formValue.yearOfCompletion) : true;

    let isWorkFormValid = formValue.isCurrentlyWorking === '1' ?
      !(!formValue.current_Off || !formValue.exp) : true;

    let isFormValid = (formValue.isDegreeCompleted === '1' && formValue.isCurrentlyWorking === '1') ?
      this.empFormObj.valid : true;
    
      if (isFormValid && isDegreeFormValid && isWorkFormValid) {
      let employee: EmployeeDetail = {
        name: this.empFormObj.value.firstName,
        fullName: {
          firstName: this.empFormObj.value.firstName,
          middleName: this.empFormObj.value.middleName,
          lastName: this.empFormObj.value.lastName
        },
        isDegreeCompleted: this.empFormObj.value.isDegreeCompleted === '1' ? true : false,
        qualification: {
          certifiedIn: this.empFormObj.value.isDegreeCompleted === '1' ? this.empFormObj.value.certifiedIn : '',
          college: this.empFormObj.value.isDegreeCompleted === '1' ? this.empFormObj.value.college : '',
          yearOfCompletion: this.empFormObj.value.isDegreeCompleted === '1' ? this.empFormObj.value.yearOfCompletion : '',
        },
        isCurrentlyWorking: this.empFormObj.value.isCurrentlyWorking === '1' ? true : false,
        workExp: {
          current_Off: this.empFormObj.value.isCurrentlyWorking === '1' ? this.empFormObj.value.current_Off : '',
          exp: this.empFormObj.value.isCurrentlyWorking === '1' ? this.empFormObj.value.exp : '',
        },
        address: this.empFormObj.value.address
      };

      this.dialogRef.close(employee);
    } else {
      this.customFormValid(formValue);
      return;
    }
  }

  customFormValid(formValue) {
    this.empFormObj.controls.certifiedIn.status = formValue.isDegreeCompleted === '1' && !this.empFormObj.value.certifiedIn ? 'INVALID' : 'VALID';
    this.empFormObj.controls.college.status = formValue.isDegreeCompleted === '1' && !this.empFormObj.value.college ? 'INVALID' : 'VALID';
    this.empFormObj.controls.yearOfCompletion.status = formValue.isDegreeCompleted === '1' && !this.empFormObj.value.yearOfCompletion ? 'INVALID' : 'VALID';
    this.empFormObj.controls.current_Off.status = formValue.isCurrentlyWorking === '1' && !this.empFormObj.value.current_Off ? 'INVALID' : 'VALID';
    this.empFormObj.controls.exp.status = formValue.isCurrentlyWorking === '1' && !this.empFormObj.value.exp ? 'INVALID' : 'VALID';
  }

  degreeChange(event) {
    this.isDegreeEnable = event.value === '1' ? true : false;
  }

  workChange(event) {
    this.isWorkEnable = event.value === '1' ? true : false;
  }
}