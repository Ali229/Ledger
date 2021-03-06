import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../_models';
import {AuthenticationService, UserService, AppService} from '../_services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'angular-bootstrap-md';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // User Table data
  users: User[] = [];
  sortValue: string = 'user_id';
  sortReverse: boolean = false;
  userIDFilter: string;
  usernameFilter: string;
  firstNameFilter: string;
  lastNameFilter: string;
  emailFilter: string;
  lastLoginFilter: string;
  passwordExpireFilter: string;
  userTypeFilter: string;
  userTypes: string[];

  // Edit User data
  @ViewChild('editUserModal') public editUserModal: ModalDirective;
  editUserForm: FormGroup;
  editingUser: User;
  editUserError: string = '';

  // Add User
  @ViewChild('addUserModal') public addUserModal: ModalDirective;
  addUserForm: FormGroup;
  addUserError: string = '';

  // Reset Password
  @ViewChild('resetPasswordModal') public resetPasswordModal: ModalDirective;
  resetPasswordForm: FormGroup;
  resetPasswordUser: User = new User();
  resetPasswordError: string = '';

  constructor(private authService: AuthenticationService,
              public userService: UserService,
              private formBuilder: FormBuilder,
              private appService: AppService) {
    this.userService.getUserArray().subscribe(response => {
      this.users = response;
      this.users.sort((a, b) => {
        if (this.sortValue == 'user_id') {
          return this.appService.numberCompare(a[this.sortValue], b[this.sortValue], this.sortReverse)
        } else {
          return this.appService.stringCompare(a[this.sortValue], b[this.sortValue], this.sortReverse)
        }
      });
    });

    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      user_type: ['', Validators.required]
    });


    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.appService.setActivePage('users');
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.sortBy('user_id');
    this.updateUserList();
    this.updateForm();
    this.updateUserTypes();
  }

  sortBy(value: string) {
    if (this.sortValue === value) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
    }
    this.sortValue = value;
    this.updateUserList();
  }

  filterBy() {
    const returnList: User[] = [];
    this.users.forEach(user => {
      if ((!this.userIDFilter || user.user_id.toString().includes(this.userIDFilter)) &&
        (!this.usernameFilter || user.username.includes(this.usernameFilter)) &&
        (!this.firstNameFilter || user.first_name.includes(this.firstNameFilter)) &&
        (!this.lastNameFilter || user.last_name.includes(this.lastNameFilter)) &&
        (!this.emailFilter || user.email.includes(this.emailFilter)) &&
        (!this.lastLoginFilter || user.last_login.includes(this.lastLoginFilter)) &&
        (!this.passwordExpireFilter || user.password_expiration_date.includes(this.passwordExpireFilter)) &&
        (!this.userTypeFilter || user.user_type.includes(this.userTypeFilter))) {
        returnList.push(user);
      }
    });
    return returnList;
  }

  updateForm() {
    this.editUserForm = this.formBuilder.group({
      username: [(this.editingUser == null ? "" : this.editingUser.username)],
      first_name: [(this.editingUser == null ? "" : this.editingUser.first_name)],
      last_name: [(this.editingUser == null ? "" : this.editingUser.last_name)],
      email: [(this.editingUser == null ? "" : this.editingUser.email)],
      user_type: [(this.editingUser == null ? "" : this.editingUser.user_type)]
    });
  }

  form() {
    return this.editUserForm.controls;
  }

  updateUserList() {
    this.userService.updateUserArray();
  }

  submitEdits() {
    if (this.form().username.value != this.editingUser.user_type) {
      this.userService.editUser(this.editingUser.user_id, "username", this.form().username.value).subscribe(response => {
        console.log("The username was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an editUserError while updating the username");
        this.editUserError = error;
      })
    }
    if (this.form().first_name.value != this.editingUser.first_name) {
      this.userService.editUser(this.editingUser.user_id, "first_name", this.form().first_name.value).subscribe(response => {
        console.log("The first_name was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an editUserError while updating the first_name");
      })
    }
    if (this.form().last_name.value != this.editingUser.last_name) {
      this.userService.editUser(this.editingUser.user_id, "last_name", this.form().last_name.value).subscribe(response => {
        console.log("The last_name was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an editUserError while updating the last_name");
      })
    }
    if (this.form().email.value != this.editingUser.email) {
      this.userService.editUser(this.editingUser.user_id, "email", this.form().email.value).subscribe(response => {
        console.log("The email was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an editUserError while updating the email");
      })
    }
    if (this.form().user_type.value != this.editingUser.username) {
      this.userService.editUser(this.editingUser.user_id, "username", this.form().user_type.value).subscribe(response => {
        console.log("The user_type was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an editUserError while updating the user_type");
      })
    }

    this.editUserModal.hide();
  }

  clearError() {
    this.editUserError = null;
  }

  editUser(user: User) {
    this.updateUserTypes();
    this.editingUser = user;
    this.updateForm();
    this.editUserModal.show();
  }

  updateUserTypes() {
    this.userService.getUserTypes().subscribe(response => {
      this.userTypes = response['user_types'];
    });
  }

  showAddUser() {
    this.addUserModal.show();
  }

  addUser() {
    // TODO Validate fields
    let controls = this.addUserForm.controls;
    this.userService.addUser(controls.username.value, controls.first_name.value, controls.last_name.value,
      controls.email.value, controls.password.value, controls.user_type.value).subscribe(response => {
      this.addUserModal.hide();
    });
  }

  showResetPassword(user: User) {
    this.resetPasswordUser = user;
    this.resetPasswordModal.show();
  }

  submitNewPassword() {
    let newPassword = this.resetPasswordForm.controls.password.value;
    this.userService.resetPassword(this.resetPasswordUser.user_id, newPassword).subscribe(response => {
      console.log(response['message']);
      this.resetPasswordModal.hide();
    }, error => {
      console.log(error['message'])
    })
  }
}
