import { Component, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Post } from 'src/app/models/Post.model';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, } from '@angular/forms';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss']
})
export class PostsEditComponent {
  isLoggedIn: boolean = false;
  user: any = User;
  userId: any;
  postId: any;
  editPostForm: any = FormGroup;
  image: any = File;
  fileName: any;
  post: any;
  message: string = '';
  isDropdownVisible: boolean = false;
  selectedStatus: string = "";
  filteredCitiesArray: string[] = [];
  selectedCity: string = "";
  selectedMissingPlace: string = "";
  filteredMissingPlacesArray: string[] = [];
  isFieldsCorrect: boolean = false;
  isFile: boolean = false;
  errorMessage: boolean = false;
  errorFile: boolean = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private route      : ActivatedRoute,
    private datePipe   : DatePipe,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    public http: HttpClient
  ) {
    this.editPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      lastname    : ['', [Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      birthDate   : ['', [this.birthDateValidator]],
      address     : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      missingPlace: ['', [Validators.minLength(2), Validators.maxLength(70)]],
      missingDate : ['', [this.birthDateValidator]],
      description : ['', [Validators.minLength(10), Validators.maxLength(300)]],
      status      : ['', []],
    });
  }

  ngOnInit() {
    this.userId = this.authService.getDecryptedUserId();
    this.postId = this.route.snapshot.paramMap.get('id');
    // Check if user is logged
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get user
    this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
      this.user = user;
    });
    // Get post
    this.getPost();
  }

  /**
  * Fet the post with the ID
  */
  getPost() {
    this.postService.getPostById(this.postId).subscribe((post: Post) => {
      if (post) {
        this.post = post;
        // Birth date formated to age
        const birthDate = new Date(this.post.birthDate);
        const today = new Date();
        const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        this.post.age = age;
      }
      return this.post;
    });
  }


  /**
   * Filter the cities withe teh value
   * @param value - The value of the input
   */
  filteredCities(value: string) {
    console.log(value);
    const filterValue = value.toLowerCase();
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
    .subscribe({
      next: (response: any) => {
        this.filteredCitiesArray = response.slice(0, 4).map((city: any) => city.nom);
        console.log(this.filteredCitiesArray);
      },
      error: (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des villes:', error);
      }
    });
  }


  /**
   * Select a city
   * @param city - The city selected
   */
  selectCity(city: string) {
    console.log('Ville sélectionnée:', city);
    this.selectedCity = city;
    this.filteredCitiesArray = [];
  }

  /**
   * Filter missing places with the value
   * @param value - The value of the input
   */
  filteredMissingPlaces(value: string) {
    const filterValue = value.toLowerCase();
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.filteredMissingPlacesArray = response.slice(0, 4).map((place: any) => place.nom);
        console.log(this.filteredMissingPlacesArray);
      },
      error: (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des lieux de disparition:', error);
      }
    });
  }

  /**
   * Select a missing place
   * @param missingPlace - Missing place selected
   */
  selectMissingPlace(missingPlace: string) {
    this.selectedMissingPlace = missingPlace;
    this.filteredMissingPlacesArray = [];
  }


  /**
   * Drop down th e menu
   * @param event - Click event
   */
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

  /**
   * Custom validator for birthDate field to check if it is after the missingDate field
   * @param control - The birthDate form control
   * @returns Validation error if birthDate is after missingDate, null otherwise
   */
  birthDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const missingDateControl = control.root.get('missingDate');

    if (missingDateControl && birthDate > new Date(missingDateControl.value)) {
      return { 'birthDateAfterMissingDate': true };
    }
    return null;
  }


  /**
   * Select a status.
   * @param status - Selected status.
   */
  onSelectStatus(status: string): void {
    this.editPostForm.get('status').setValue(status);
    this.selectedStatus = status;
  }


  /**
   * Function to validate that the selected date is not after today's date.
   * @param event - The date selection event.
   */
  validateDate(event: any) {
    const selectedDate = new Date(event.target.value);
    const now = Date.now();
    if (selectedDate.getTime() > now) {
      event.target.value = '';
    }
  }


  /**
   * Check if the form fields are correct.
   */
  checkFields() {
    this.isFieldsCorrect = this.editPostForm.valid;
  }


  /**
   * Check if the form fields are valid.
   * @returns boolean - True if the form fields are valid, false otherwise.
   */
  areFieldsValid() {
    return this.editPostForm.valid;
  }


  /**
   * Method called when a file is selected.
   * @param event - The file selection event.
   */
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.isFile = true;
      this.fileName.innerHTML = this.image.name;
      console.log(2,this.isFile)
    }
  }


  /**
   * Edit a post.
   * @param event - The click event.
   * @param postId - The ID of the post to edit.
   */
  editPost(event: Event, postId: string) {
    event.preventDefault();
    postId = this.postId;
    this.editPostForm.get('address').value = this.selectedCity;
    this.editPostForm.get('missingPlace').value = this.selectedMissingPlace;

    if (this.userId === this.user._id && this.isFieldsCorrect === true ||
        this.userId === this.user._id && this.selectedStatus) {
      // Get datas from post
      let oldPost = {
        firstname: this.user.firstname,
        lastname : this.user.lastname,
        birthDate: this.user.birthDate,
        address  : this.user.address,
        missingPlace: this.user.missingPlace,
        missingDate : this.user.missingDate,
        description : this.user.description
      };

      const formValues = this.editPostForm.value;
      formValues.address = this.selectedCity;
      formValues.missingPlace = this.selectedMissingPlace;
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the updatedUser object with new datas
      oldPost = { ...oldPost, ...nonEmptyValues };

      this.postService.editPost(postId, oldPost)
      .subscribe({
        next: () => {
          this.post = oldPost;
          this.getPost();
        },
        error: (error) => {
          this.message = 'Une erreur est survenue lors de la modification du post';
        }
      });
    } else {
      this.errorMessage = true;
    }
  }


  /**
   * Update the picture of the post.
   * @param event - The click event.
   */
  updatePostPicture(event: Event) {
    event.preventDefault();

    console.log(this.image)
    if (!this.image) {
      return;
    }
    if (this.isFile) {
      const formData = new FormData();
      formData.append('image', this.image, this.image.name);

      this.postService.updatePostPicture(formData, this.post._id).subscribe({
        next: (post: Post) => {
          // Update user information with new profile picture
          this.post = post;
          this.getPost();
        },
        error: (error) => {
          this.message = 'Une erreur est survenue lors de la modification du post';
        }
      });
    } else {
      this.errorFile = true;
    }
  }
}
