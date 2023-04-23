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
  userId      : any;
  editUserForm: any = FormGroup;
  objectToSend: any = {};
  user        : any = User;
  image       : any = File;
  fileName    : any;
  message     : string = '';
  isClicked   : boolean = false;
  isSend      : boolean = false;
  isEditedOrDeleted: boolean = false;

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
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userId = localStorage.getItem('userId');

      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((user: User) => {
          this.user = user;
          console.log(this.user)
        });
      } else {
        console.log('User not found');
      }
    };
    // Formated date
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  showFormUser() {
    console.log('hello')
    this.isClicked = true;
  }

  closeForm() {
    this.isClicked = false;
  }

  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.fileName.innerHTML = this.image.name;
    }
  }

  compareObjects(obj1: any, obj2: any): boolean {
    for (let key in obj1) {
      if (obj1.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

  // Edit user ----- Need to add the code for image
  editUser(event: Event, userId: string) {
    event.preventDefault();
    userId = this.userId;

    if (userId === this.user._id) {
      let updatedUser = { firstname: this.user.firstname, lastname: this.user.lastname, email: this.user.email };
      const formValues = this.editUserForm.value;
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the bew object with new datas
      updatedUser = { ...updatedUser, ...nonEmptyValues };

      console.log('objetAModifier', updatedUser);
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

  // Delete user
  deleteUser(event: Event, userId: string) {
    event.preventDefault();
    userId = this.userId;

    if (userId === this.user._id) {
      const confirmDelete = confirm('Voulez-vous vraiment supprimer votre compte ?');
      if (confirmDelete) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            localStorage.clear();
            this.router.navigate(['/login']);
          },
          (error) => {
            this.message = 'Une erreur est survenue lors de la suppression de l\'utilisateur.';
          }
        );
      }
    }
  }

}
