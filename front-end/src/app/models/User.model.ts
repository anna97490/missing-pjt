export class User {
  _id      : string;
  lastname : string;
  firstname: string;
  email    : string;
  password : string;
  status   : string;
  token    : string;

  constructor(
    _id      : string,
    firstname: string,
    lastname : string,
    email    : string,
    password : string,
    status   : string,
    token    : string
     ) {
      this._id       = _id;
      this.lastname  = lastname;
      this.firstname = firstname;
      this.email     = email;
      this.password  = password;
      this.status    = status;
      this.token     = token;
  }
}
