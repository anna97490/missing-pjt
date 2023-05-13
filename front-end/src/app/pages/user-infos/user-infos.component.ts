import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss']
})
export class UserInfosComponent implements OnInit {
  isLoggedIn  : boolean = this.authService.isLoggedIn();
  userId      : any = this.authService.getDecryptedUserId();
  editUserForm: any = FormGroup;
  user        : any = User;
  image       : any = File;
  fileName    : any;
  message     : string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router     : Router,
    private datePipe   : DatePipe,
    private formBuilder: FormBuilder,
  ) {
    this.editUserForm = this.formBuilder.group({
      firstname : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      lastname  : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      email     : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      birthDate : ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      // Get the user to display infos
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      })
    }
  }

  // File selected method
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.fileName.innerHTML = this.image.name;
    }
  }

  // Edit the user method
  editUser(event: Event) {
    event.preventDefault();

    if (this.editUserForm.valid && this.userId === this.user._id) {
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

      this.userService.editUser(this.userId, updatedUser).subscribe(response => {
          window.location.reload();
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la modification de vos informations';
        }
      );
    }
  }

  updateProfilePicture(event: Event) {
    event.preventDefault();

    if (!this.image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.image, this.image.name);

    this.userService.updateProfilePicture(formData, this.userId).subscribe(
      (user: User) => {
        // Update user information with new profile picture
        this.user = user;
        window.location.reload();
      },
      (error) => {
        this.message = 'Une erreur est survenue lors de la modification du post';
      }
    );
  }

  // Delete the user method
  deleteUser(event: Event) {
    event.preventDefault();

    const confirmDelete = confirm('Voulez-vous vraiment supprimer votre compte ?');
    if (confirmDelete && this.userId === this.user._id) {
      this.userService.deleteUser(this.userId).subscribe(response => {
          this.authService.logout();
          this.router.navigate(['/posts-index']);
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la suppression de l\'utilisateur.';
        }
      );
    }
  }
}
