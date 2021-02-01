


module.exports = class Message {
  constructor(sender, receiver, message, subject) {
    this.sender = sender; 
    this.receiver = receiver;
    this.message = message;
    this.subject = subject;
    this.creation = new Date();
  }
}








