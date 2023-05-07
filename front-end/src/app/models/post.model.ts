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
  comments: {
    _id: string;
    comment: string;
    createdAt: Date;
  }[];
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
    comments: {
      _id: string;
      comment: string;
      createdAt: Date;
    }[],
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
    this.comments     = comments;
    this.createdAt    = createdAt;
    this.userId       = userId;
  }
}
