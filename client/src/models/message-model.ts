export class MessageModel {
  content: string;
  clientId: number;
  indexNumber: number;

  constructor(jsonObj) {
    this.content = jsonObj.content;
    this.clientId = jsonObj.clientId;
    this.indexNumber = jsonObj.indexNumber;
  }
}
