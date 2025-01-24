import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly PAGE_SIZE_KEY = 'userListPageSize';
  private readonly PAGE_INDEX_KEY = 'userListPageIndex';

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    const storedPageSize = localStorage.getItem(this.PAGE_SIZE_KEY);
    const storedPageIndex = localStorage.getItem(this.PAGE_INDEX_KEY);

    if (storedPageSize && storedPageIndex) {
      this.paginator.pageSize = +storedPageSize;
      this.paginator.pageIndex = +storedPageIndex;
    }
  }

  fetchUsers(): void {
    this.users = this.userService.sortByName(this.userService.getUsers()); // Sort before creating data source
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPageChange(event: PageEvent): void {
    localStorage.setItem(this.PAGE_SIZE_KEY, event.pageSize.toString());
    localStorage.setItem(this.PAGE_INDEX_KEY, event.pageIndex.toString());
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result);
        this.fetchUsers();
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: JSON.parse(JSON.stringify(user)),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result);
        this.fetchUsers();
      }
    });
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this user?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId);
        this.fetchUsers();
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}