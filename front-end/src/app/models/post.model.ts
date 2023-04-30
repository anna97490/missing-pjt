export class Post {
  _id         : string;
  firstname   : string;
  lastname    : string;
  birthDate   : Date;
  address     : string;
  image       : string;
  missingDate : Date;
  missingPlace: string;
  description : string;
  createdAt   : Date;
  userId      : string;

  constructor(
    _id         : string,
    firstname   : string,
    lastname    : string,
    birthDate   : Date,
    address     : string,
    image       : string,
    missingDate : Date,
    missingPlace: string,
    description : string,
    createdAt   : Date,
    userId      : string
  ) {
    this._id          = _id;
    this.firstname    = firstname;
    this.lastname     = lastname;
    this.birthDate    = birthDate;
    this.address      = address;
    this.image        = image;
    this.missingDate  = missingDate;
    this.missingPlace = missingPlace;
    this.description  = description;
    this.createdAt    = createdAt;
    this.userId       = userId;
  }
}
