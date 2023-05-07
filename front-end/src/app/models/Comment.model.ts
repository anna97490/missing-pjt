export class Comment {
  _id : string;
  text: string;
  createdAt: Date;
  posId: string;
  userId: string;

  constructor(
    _id: string,
    text: string,
    createdAt: Date,
    posId: string,
    userId: string
  ) {
    this._id= _id;
    this.text = text;
    this.posId = posId;
    this.createdAt = createdAt;
    this.userId = userId;
  }
}
