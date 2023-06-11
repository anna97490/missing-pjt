export class Post {
  _id         : string;
  firstname   : string;
  lastname    : string;
  birthDate   : Date;
  address     : string;
  missingDate : Date;
  missingPlace: string;
  description : string;
  image       : string;
  status      : string;
  comments: {
    _id      : string;
    comment  : string;
    userId   : string;
    createdAt: Date;
  }[];
  createdAt  : Date;
  userId     : string;

  constructor(
    _id         : string,
    firstname   : string,
    lastname    : string,
    birthDate   : Date,
    address     : string,
    missingDate : Date,
    missingPlace: string,
    description : string,
    image       : string,
    status      : string,
    comments: {
      _id      : string;
      comment  : string;
      userId   : string;
      createdAt: Date;
    }[],
    createdAt: Date,
    userId   : string
  ) {
    this._id          = _id;
    this.firstname    = firstname;
    this.lastname     = lastname;
    this.birthDate    = birthDate;
    this.address      = address;
    this.missingDate  = missingDate;
    this.missingPlace = missingPlace;
    this.description  = description;
    this.image        = image;
    this.status       = status;
    this.comments     = comments;
    this.createdAt    = createdAt;
    this.userId       = userId;
  }
}
