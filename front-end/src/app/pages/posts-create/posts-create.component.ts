import { Component, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.scss']
})

export class PostsCreateComponent {
  isLoggedIn: boolean = false;
  private userId: any;
  user: any = User;
  createPostForm: any = FormGroup;
  image: any = File;
  fileName: any;
  isDropdownVisible: boolean = false;
  selectedStatus: string = "";
  filteredCitiesArray: string[] = [];
  selectedCity: string = "";
  selectedMissingPlace: string = "";
  filteredMissingPlacesArray: string[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private el: ElementRef,
    private http: HttpClient
  ) {
    // Datas from form
    this.createPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      lastname    : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      birthDate   : ['', [Validators.required, this.birthDateValidator]],
      address     : ['', [Validators.required]],
      missingPlace: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      missingDate : ['', [Validators.required]],
      description : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      status      : ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Check if user is logged
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get elements of user from Local Storage
    if (this.isLoggedIn) {
      this.userId = this.authService.getDecryptedUserId();
      // Get the user
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      })
    }
  }

  filteredCities(value: string) {
    console.log(value)
    const filterValue = value.toLowerCase();
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
    .subscribe((response: any) => {
      this.filteredCitiesArray = response.slice(0, 4).map((city: any) => city.nom);
      console.log(this.filteredCitiesArray)
    }, (error) => {
      console.error('Une erreur s\'est produite lors de la récupération des villes :', error);
    });
  }

  selectCity(city: string) {
    console.log('Ville sélectionnée:', city);
    this.selectedCity = city;
    this.filteredCitiesArray = [];
  }

  filteredMissingPlaces(value: string) {
    console.log(value);
    const filterValue = value.toLowerCase();
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
    .subscribe((response: any) => {
      console.log(response);
      this.filteredMissingPlacesArray = response.slice(0, 4).map((place: any) => place.nom);
      console.log(this.filteredMissingPlacesArray);
    }, (error) => {
      console.error('Une erreur s\'est produite lors de la récupération des lieux de disparition:', error);
    });
  }

  selectMissingPlace(missingPlace: string) {
    this.selectedMissingPlace = missingPlace;
    this.filteredMissingPlacesArray = [];
  }

  // Dropdown menu to pick status
  toggleDropdownMenu(event: Event): void {
    event.preventDefault();

    const dropdownMenu = this.el.nativeElement.querySelector('[dropdownMenu]');
    if (!this.isDropdownVisible) {
      dropdownMenu.classList.add('show');
    } else {
      dropdownMenu.classList.remove('show');
    }
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Status selected
  onSelectStatus(status: string): void {
    this.createPostForm.get('status').setValue(status);
    this.selectedStatus = status;
  }

  // Function to pick date not after today's date
  validateDate(event: any) {
    const selectedDate = new Date(event.target.value);
    const now = Date.now();
    if (selectedDate.getTime() > now) {
      event.target.value = '';
    }
  }

  birthDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const missingDateControl = control.root.get('missingDate');

    if (missingDateControl && birthDate > new Date(missingDateControl.value)) {
      return { 'birthDateAfterMissingDate': true };
    }
    return null;
  }

  // File selected method
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.fileName.innerHTML = this.image.name;
    }
  }

  // Create post method
  createPost(event: Event) {
    event.preventDefault();

    if (this.createPostForm.valid  && this.userId === this.user._id) {
      const formData = new FormData();
      formData.append('firstname', this.createPostForm.get('firstname').value);
      formData.append('lastname', this.createPostForm.get('lastname').value);
      formData.append('birthDate', this.createPostForm.get('birthDate').value);
      formData.append('address', this.createPostForm.get('address').value);
      formData.append('missingPlace', this.createPostForm.get('missingPlace').value);
      formData.append('missingDate',this.createPostForm.get('missingDate').value);
      formData.append('description', this.createPostForm.get('description').value);
      formData.append('status', this.selectedStatus);
      formData.append('image', this.image, this.image.name);
      formData.append('userId', this.userId);

      this.postService.createPost(formData)
      .subscribe(
        (response) => {
          // Post creation successful
          this.router.navigate(['/posts-index']);
          this.createPostForm.reset();
        },
        (error) => {
          console.error('An error occurred while creating the post:', error);
        }
      );
    }
  }
}
