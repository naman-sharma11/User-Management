import { Component, EventEmitter, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { UsersComponent } from '../users.component';


@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  @Output() userCreated = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userCreated.emit();
      }
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
  standalone: true,
  styleUrl: './user-create.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
})
export class DialogContentExampleDialog {

  myForm: FormGroup;
  inEditMode: Boolean = false;
  userId: number;

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('user create ngOnInit');
    this.myForm = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      gender: new FormControl(null),
      city: new FormControl(null),
      age: new FormControl(null)
    })
  }

  onSubmit(updateUser: Boolean) {
    if (updateUser) {
      console.log('Making POST call to update user');
      this.userService.updateUser(this.myForm.value, this.userId).subscribe((response) => {
        console.log('Response:');
        console.log(response);
      });
    } else {
      console.log('Making POST call to create user');
      this.userService.createUser(this.myForm.value).subscribe((response) => {
        console.log('Response:');
        console.log(response);
      });
    }
    this.inEditMode = false;
  }

  onEdit(values) {
    console.log('editing', values);
    console.log('editing', values.firstName);
    this.userId = values.id;
    this.inEditMode = true;
    this.myForm.setValue({
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      city: values.city,
      age: values.age
    })
    console.log('this.myForm.value - ', this.myForm.value);
  }
}