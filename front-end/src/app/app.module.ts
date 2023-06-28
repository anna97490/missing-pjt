import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/auth.guard';
import { UserService } from './service/user.service';
import { PostService } from './service/post.service';
import { CommentService } from './service/comment.service';
import { HttpClientModule } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SidebarModule } from 'ng-sidebar';
import { CardMissingComponent } from './components/card-missing/card-missing.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { UserInfosComponent } from './pages/user-infos/user-infos.component';
import { DatePipe } from '@angular/common';
import { PostsIndexComponent } from './pages/posts-index/posts-index.component';
import { PostsCreateComponent } from './pages/posts-create/posts-create.component';
import { PostsEditComponent } from './pages/posts-edit/posts-edit.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SigninComponent,
    CardMissingComponent,
    ModalComponent,
    UserInfosComponent,
    PostsIndexComponent,
    PostsCreateComponent,
    PostsEditComponent,
    FooterComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    SidebarModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    UserService,
    PostService,
    CommentService,
    AuthGuard,
    { provide: 'decodedToken', useValue: jwt_decode },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
  }
 }
