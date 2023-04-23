import { Router } from "@angular/router";

export class User {
  _id      : string;
  lastname : string;
  firstname: string;
  birthDate: Date;
  email    : string;
  password : string;
  image    : string;
  token    : string;

  constructor(
    _id      : string,
    firstname: string,
    lastname : string,
    birthDate: Date,
    email    : string,
    password : string,
    image    : string,
    token    : string
     ) {
      this._id       = _id;
      this.lastname  = lastname;
      this.firstname = firstname;
      this.birthDate = birthDate;
      this.email     = email;
      this.password  = password;
      this.image     = image;
      this.token     = token;
  }
}
