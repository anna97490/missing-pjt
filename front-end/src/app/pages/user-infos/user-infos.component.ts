import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { User } from 'src/app/models/User.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss']
})
export class UserInfosComponent implements OnInit {
  isLoggedIn  : boolean = false;
  editUserForm: any = FormGroup;
  userId      : any;
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
      image     : [''],
    });
  }

  ngOnInit() {
    // Check if user is logged
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get elements of user from Local Storage
    if (this.isLoggedIn === true) {
      this.userId = this.authService.getDecryptedUserId();
      // Get the user to display infos
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
        console.log("this.user", this.user)
      })
    }
  }

  /*** File selected method */
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.fileName.innerHTML = this.image.name;
    }
  }

  /*** Edit the user method * @param {string} userId - user id * @return {string|error} - Sucessful insertion or Error*/
  editUser(event: Event, userId: string) {
    event.preventDefault();
    userId = this.userId;

    if (userId === this.user._id) {
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

      // Update the new object with new datas
      updatedUser = { ...updatedUser, ...nonEmptyValues };

      this.userService.editUser(userId,updatedUser).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la modification de vos informations';
        }
      );
    }
  }

  /*** Delete the user method * @param {string} userId - user id * @return {string|error} - Sucessful insertion or Error*/
  deleteUser(event: Event, userId: string) {
    event.preventDefault();
    userId = this.userId;

    const confirmDelete = confirm('Voulez-vous vraiment supprimer votre compte ?');
    if (confirmDelete) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          localStorage.clear();
          this.router.navigate(['/posts-index']);
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la suppression de l\'utilisateur.';
        }
      );
    }
  }
}
