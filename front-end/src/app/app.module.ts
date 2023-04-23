import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/auth.guard';
import { UserService } from './service/user.service';
import { PostService } from './service/post.service';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { ButtonComponent } from './components/button/button.component';
import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SidebarModule } from 'ng-sidebar';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CardMissingComponent } from './components/card-missing/card-missing.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { UserInfosComponent } from './pages/user-infos/user-infos.component';
import { DatePipe } from '@angular/common';
import { PostsIndexComponent } from './pages/posts-index/posts-index.component';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostsCreateComponent } from './pages/posts-create/posts-create.component';
import { PostsEditComponent } from './pages/posts-edit/posts-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ButtonComponent,
    LoginComponent,
    SigninComponent,
    SidebarComponent,
    CardMissingComponent,
    ModalComponent,
    UserInfosComponent,
    PostsIndexComponent,
    PostsListComponent,
    PostsCreateComponent,
    PostsEditComponent
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
    AuthGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
