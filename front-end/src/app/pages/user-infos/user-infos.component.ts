import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss']
})
export class UserInfosComponent implements OnInit {
  private userId: any;
  isLoggedIn: boolean = true;
  user: any = User;
  editUserForm: any = FormGroup;
  image: any = File;
  isImageSelected: boolean = false;
  fileName: any;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.editUserForm = this.formBuilder.group({
      firstname : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      lastname  : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      email     : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      password  : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      birthDate : ['', [Validators.required, this.minimumAgeValidator(18)]],
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    // Get the user to display infos
   this.getUser();
  }

  // Get the user
  getUser() {
    this.userService.getUserById(this.userId).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error('An error occurred while getting user:', error);
      }
    );
  }

  // Validation of age >= 18
  minimumAgeValidator(minimumAge: number) {
    return (control: AbstractControl) => {
      if (control.value) {
        const today = new Date();
        const birthDate = new Date(control.value);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < minimumAge) {
          return { minimumAge: true };
        }
      }
      return null;
    };
  }

  // File selected
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.isImageSelected = true;
      this.fileName.innerHTML = this.image.name;
    }
  }

  // Edit the user
  editUser(event: Event) {
    event.preventDefault();

    if (this.userId === this.user._id) {
      // Get datas from user
      let updatedUser = {
        firstname: this.user.firstname,
        lastname : this.user.lastname,
        email    : this.user.email,
        birthDate: this.user.birthDate,
      };

      const formValues = this.editUserForm.value;
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the updatedUser object with new datas
      updatedUser = { ...updatedUser, ...nonEmptyValues };

      this.userService.editUser(this.userId, updatedUser).subscribe(
        (user: User) => {
          // Update user informations with new datas
          this.user = user;
          this.getUser();
        },
        (error) => {
          this.errorMessage = 'Cet email existe déjà.';
        }
      );
    }
  }

  // Change or add profile picture
  updateProfilePicture(event: Event) {
    event.preventDefault();

    if (this.image && this.userId === this.user._id) {
      const formData = new FormData();
      formData.append('image', this.image, this.image.name);

      this.userService.updateProfilePicture(formData, this.userId).subscribe(
        (user: User) => {
          // Update user with new profile picture
          this.user = user;
          this.getUser();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      return;
    }
  }

  // Delete the user method
  deleteUser(event: Event) {
    event.preventDefault();

    const confirmDelete = confirm('Voulez-vous vraiment supprimer votre compte ?');
    if (confirmDelete && this.userId === this.user._id) {
      this.userService.deleteUser(this.userId).subscribe(response => {
          this.authService.logout();
        },
        (error) => {
          console.log(error)
        }
      );
    }
  }
}
