export class Comment {
  _id      : string;
  userId   : string;
  postId   : string;
  comment  : string;
  createdAt: Date;

  constructor(
    _id      : string,
    userId   : string,
    postId   : string,
    comment  : string,
    createdAt: Date,
  ) {
    this._id       = _id;
    this.userId    = userId;
    this.postId    = postId;
    this.comment   = comment;
    this.createdAt = createdAt;
  }
}
