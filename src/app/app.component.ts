import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppService } from './app.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEmpComponent } from './add-emp/add-emp.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
// import { Observable, of } from 'rxjs';

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
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  constructor(
    private service: AppService,
    public dialog: MatDialog
  ) {
    // console.log('contructor');
    this.getData();
  }

  ngOnInit() {
    // console.log('onInit');
    // Create simple observable that emits three values
    // const myObservable = of(1, 2, 3);

    // Create observer object
    // const myObserver = {
    //   next: x => console.log('Observer got a next value: ' + x),
    //   error: err => console.error('Observer got an error: ' + err),
    //   complete: () => console.log('Observer got a complete notification'),
    // };

    // Execute with the observer object
    // myObservable.subscribe(myObserver);
    // Logs:
    // Observer got a next value: 1
    // Observer got a next value: 2
    // Observer got a next value: 3
    // Observer got a complete notification
  }

  // ngOnChanges(){
  //   console.log('ngOnChanges');

  // }

  getData() {
    this.isLoading = true;
    this.service.getData().subscribe((response: any) => {
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
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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