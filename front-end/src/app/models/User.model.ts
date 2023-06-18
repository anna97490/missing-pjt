export class User {
  _id      : string;
  lastname : string;
  firstname: string;
  email    : string;
  password : string;
  token    : string;

  constructor(
    _id      : string,
    firstname: string,
    lastname : string,
    email    : string,
    password : string,
    token    : string
     ) {
      this._id       = _id;
      this.lastname  = lastname;
      this.firstname = firstname;
      this.email     = email;
      this.password  = password;
      this.token     = token;
  }
}
