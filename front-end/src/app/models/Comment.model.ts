export class Comment {
  _id : string;
  comment: string;
  createdAt: Date;

  constructor(
    _id: string,
    comment: string,
    createdAt: Date,
  ) {
    this._id= _id;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}
