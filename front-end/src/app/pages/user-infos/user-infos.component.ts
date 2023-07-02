import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss']
})
export class UserInfosComponent implements OnInit {
  userId: any;
  isLoggedIn: boolean = true;
  user: any = User;
  editUserForm: any = FormGroup;
  errorMessage: boolean = false;
  errorPicture: boolean = false;
  isFieldsCorrect: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.editUserForm = this.formBuilder.group({
      firstname: ['', [Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      lastname : ['', [Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      email    : ['', [Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(com|fr)$/i)]],
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    // Get the user to display infos
    this.getUser();
  }


  /**
  Get the user by Id
  */
  getUser() {
    this.userService.getUserById(this.userId)
    .subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error) => {
        console.error('An error occurred while getting user:', error);
      }
    });
  }


  /**
  Check if the form fields are valid
  */
  checkFields() {
    this.isFieldsCorrect = this.editUserForm.valid;
  }


  /**
  Check if the form fields are valid
  @returns boolean - True if the form fields are valid, false otherwise
  */
  areFieldsValid() {
    return this.editUserForm.valid;
  }

  /**
   * Updates the user data on the specified field.
   * @param field - The field to update (firstname, lastname, email)
   */
  updateUserData(field: string) {
    setTimeout(() => {
      switch (field) {
        case 'firstname':
          this.user.firstname = this.editUserForm.value.firstname;
          break;
        case 'lastname':
          this.user.lastname = this.editUserForm.value.lastname;
          break;
        case 'email':
          this.user.email = this.editUserForm.value.email;
          break;
        default:
          break;
      }
    });
  }


  /**
  Edit user information
  @param event - The form submit event
  */
  editUser(event: Event) {
    event.preventDefault();

    if (this.userId === this.user._id && this.isFieldsCorrect === true) {
      // Get data from user
      let updatedUser = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        birthDate: this.user.birthDate,
      };

      // Get the form values
      const formValues = this.editUserForm.value;
      // Filter les non empte values of the form
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the object updatedUser object with new datas
      updatedUser = { ...updatedUser, ...nonEmptyValues };

      // Call the user service
      this.userService.editUser(this.userId, updatedUser)
      .subscribe({
        next: (user: User) => {
          // Update user information with new data
          this.user = user;
          this.getUser();
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      // Display the error message
      this.errorMessage = true;
    }
  }


  /**
  * Delete the user.
  * @param event - The event object.
  */
  deleteUser(event: Event) {
    event.preventDefault();

    // Confirmation before deleting the account
    const confirmDelete = confirm('Etes-vous sur de vouloir supprimer votre compte?');

    if (confirmDelete && this.userId === this.user._id) {
      // Call the service method to delete the user
      this.userService.deleteUser(this.userId)
      .subscribe({
        next: (response) => {
          // Log out the user after successful deletion
          this.authService.logout();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
