export class Comment {
  _id : string;
  userId: string;
  comment: string;
  createdAt: Date;

  constructor(
    _id: string,
    userId: string,
    comment: string,
    createdAt: Date,
  ) {
    this._id= _id;
    this.userId = userId;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}
