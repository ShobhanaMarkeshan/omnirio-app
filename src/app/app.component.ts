import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppService } from './app.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEmpComponent } from './add-emp/add-emp.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppComponent {
  searchText = '';
  isLoading = false;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['action', 'name', 'isDegreeCompleted', 'isCurrentlyWorking', 'address'];
  expandedElement: EmployeeDetail | null;
  @ViewChild(MatTable) table: MatTable<EmployeeDetail>;
  constructor(
    private service: AppService,
    public dialog: MatDialog
  ) {
    this.getData();
  }
  getData() {
    this.isLoading = true;
    this.service.getData().subscribe((response: any) => {
      console.log('response = ', response);
      let responseData: EmployeeDetail[] = [];
      if (response) {
        setTimeout(() => {
          response.forEach(element => {
            let emp: EmployeeDetail = {
              name: element.nickName,
              fullName: element.fullName,
              isDegreeCompleted: element.isDegreeCompleted,
              qualification: element.qualification,
              isCurrentlyWorking: element.isCurrentlyWorking,
              workExp: element.workExp,
              address: element.currentLocation,
            }
            responseData.push(emp);
          });
          this.dataSource = new MatTableDataSource<EmployeeDetail>(responseData);
          this.isLoading = false;
        }, 1000);
      }
    });
  }


  addData() {
    const dialogRef = this.dialog.open(AddEmpComponent, {});

    dialogRef.afterClosed().subscribe((result: EmployeeDetail) => {
      if (result) {
        this.isLoading = true;
        setTimeout(() => {
          this.dataSource.data.push(result);
          this.table.renderRows();
          this.isLoading = false;
        }, 500);
      }
    });

  }

  searchList(filterValue: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.isLoading = false;
    }, 500);
  }
}

export interface EmployeeDetail {
  name: string;
  fullName: object;
  isDegreeCompleted: boolean;
  qualification: object;
  isCurrentlyWorking: boolean;
  workExp: object;
  address: string;
}