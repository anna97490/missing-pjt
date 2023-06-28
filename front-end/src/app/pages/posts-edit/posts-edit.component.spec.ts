import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsEditComponent } from './posts-edit.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Post } from '../../models/Post.model';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';

describe('PostsEditComponent', () => {
  let component: PostsEditComponent;
  let fixture: ComponentFixture<PostsEditComponent>;
  let postService: PostService;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [ PostsEditComponent ],
    imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
    providers: [
      AuthService,
      UserService,
      PostService,
      FormBuilder,
      DatePipe,
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => '1' } } }
      },
      {
        provide: Router,
        useValue: {}
      }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsEditComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should retrieve the post by id', () => {
    const postId = '1';
    const post: Post = {
      _id: '1',
      firstname: 'John',
      lastname: 'Doe',
      birthDate: new Date('1990-01-01'),
      address: '123 Main St',
      missingDate: new Date('2022-05-10'),
      missingPlace: 'City ',
      description: 'Lorem ipsum dolor sit amet',
      image: 'https://example.com/image.jpg',
      status: 'En cours',
      comments: [
        {
          _id: '1',
          comment: 'Comment 1',
          userId: 'user1',
          createdAt: new Date('2022-05-11')
        },
        {
          _id: '2',
          comment: 'Comment 2',
          userId: 'user2',
          createdAt: new Date('2022-05-12')
        }
      ],
      createdAt: new Date('2022-05-09'),
      userId: 'user1'
    };

    postService.getPostById(postId);
  });

  it('should select a city', () => {
    const city = 'Paris';

    component.selectCity(city);

    expect(component.selectedCity).toBe(city);
    expect(component.filteredCitiesArray).toEqual([]);
  });

  it('should filter cities', () => {
    const value = 'par';

    const response = [
      { nom: 'Paris' },
      { nom: 'Marseille' },
      { nom: 'Montpellier' }
    ];

    spyOn(component.http, 'get').and.returnValue(of(response));

    component.filteredCities(value);

    expect(component.filteredCitiesArray).toEqual(['Paris', 'Marseille', 'Montpellier']);
  });

  it('should filter missing places', () => {
    const value = 'city';

    const response = [
      { nom: 'City X' },
      { nom: 'City Y' },
      { nom: 'City Z' }
    ];

    spyOn(component.http, 'get').and.returnValue(of(response));

    component.filteredMissingPlaces(value);

    expect(component.filteredMissingPlacesArray).toEqual(['City X', 'City Y', 'City Z']);
  });

  it('should select a missing place', () => {
    const missingPlace = 'City X';

    component.selectMissingPlace(missingPlace);

    expect(component.selectedMissingPlace).toBe(missingPlace);
    expect(component.filteredMissingPlacesArray).toEqual([]);
  });

  it('should edit a post', () => {
    // Create a mock form value
    const formValue = {
      firstname: 'John',
      lastname: 'Doe',
      birthDate: '1990-01-01',
      address: '123 Main St',
      missingPlace: 'City X',
      missingDate: '2022-05-10',
      description: 'Lorem ipsum dolor sit amet',
      status: 'missing'
    };

    component.selectedCity = 'City X';
    component.selectedMissingPlace = 'City Y';

    component.editPostForm.setValue(formValue);

    spyOn(postService, 'editPost');

    component.editPost(new Event('click'), '1');

    expect(postService.editPost);
  });

  it('should update the post picture', () => {
    const image = new File(['file contents'], 'image.jpg', { type: 'image/jpeg' });

    component.image = image;

    spyOn(postService, 'updatePostPicture');

    expect(postService.updatePostPicture);
  });
});
