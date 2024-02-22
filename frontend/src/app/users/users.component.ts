import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/users.service';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogContentExampleDialog, UserCreateComponent } from './user-create/user-create.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import {DomSanitizer} from '@angular/platform-browser';

export interface UserDetail {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  city: string;
}

const EDIT_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
`;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true,
  imports: [
    UserCreateComponent,
    MatProgressSpinnerModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    MatSort,
    MatSortModule,
    MatIconModule
  ],
})
export class UsersComponent {
  allUsers: UserDetail[];
  allUsersDataSource: UserDetail[];
  userDisplayedColumns: string[] = ['firstName', 'lastName', 'age', 'gender', 'city'];
  userDisplayedColumnsForChecked: string[] = ['select', 'firstName', 'lastName', 'age', 'gender', 'city', 'edit'];
  dataSource: MatTableDataSource<UserDetail>;
  selection = new SelectionModel<UserDetail>(true, []);
  fetchingData: Boolean = false;
  sortDirection: SortDirection = 'desc';
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      console.log('sorting');
      this.dataSource = new MatTableDataSource<UserDetail>(this.dataSource.sortData(this.dataSource.data, this.sort));
      if (this.sortDirection === 'desc') {
        this.sortDirection = 'asc';
      } else {
        this.sortDirection = 'desc';
      }

    });
  }

  constructor(
    private userService: UserService, 
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
    ) { 
      iconRegistry.addSvgIconLiteral('edit', sanitizer.bypassSecurityTrustHtml(EDIT_ICON));
    }

  ngOnInit(): void {
    console.log('inside ng on init');
    this.fetchingData = true;
    this.userService.getAllUsers().subscribe((response: UserDetail[]) => {
      console.log('GET users response:', response);
      console.log('Updating page.')
      response.sort(function (a, b) {
        return b.age - a.age
      })
      this.allUsers = <UserDetail[]>response;
      this.allUsersDataSource = <UserDetail[]>response;
      this.dataSource = new MatTableDataSource<UserDetail>(<UserDetail[]>response);
      this.fetchingData = false;
    })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserDetail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deleteSelected() {
    this.selection.selected.forEach(element => {
      this.userService.deleteUsers(element.id).subscribe((response) => {
        this.refreshBrowser();
        this.selection.clear();
      });
    });
    this.dataSource = new MatTableDataSource<UserDetail>();
  }

  refreshBrowser() {
    this.userService.getAllUsers().subscribe((response: UserDetail[]) => {
      console.log('GET users response:', response);
      console.log('Updating page.')
      if (this.sortDirection === 'desc') {
        response.sort(function (a, b) {
          return b.age - a.age
        })
      } else {
        response.sort(function (a, b) {
          return a.age - b.age
        })
      }
      this.allUsers = <UserDetail[]>response;
      this.allUsersDataSource = <UserDetail[]>response;
      this.dataSource = new MatTableDataSource<UserDetail>(<UserDetail[]>response);
      this.fetchingData = false;
    })
  }

  editButtonClicked(editbtn) {
    console.log('edit button clicked')
    console.log(editbtn);
    this.userService.editBtnSubject.next('edit btn clicked...');

    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    console.log('dialogRef:', dialogRef);
    dialogRef.afterOpened().subscribe(result => {
      console.log('dialog openend');
      dialogRef.componentInstance.onEdit(editbtn);
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('result: ', result);
      this.refreshBrowser();
    });
  }
}
