/**
 * Creates a Google Doc and copy the texts of mails in it.
 * Mails will be retrieved by sender. This script is intended
 * as a way to get information from newsletters in a single document
 */
function getMailsToDoc() {
  // Create a new Google Doc named 'Hello, world!'
  //TODO: check if the document already exists, if not, creates it
  var date = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");
  var doc = DocumentApp.create('Alexander mails - Helth and Sport ' + date);
  
  // Define a custom paragraph style.
  var styleTitle = {};
  styleTitle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  styleTitle[DocumentApp.Attribute.BOLD] = true;
  
  var styleBody = {};
  styleBody[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  styleBody[DocumentApp.Attribute.BOLD] = false;
  // Get the email address of the active user - that's you.
  var email = Session.getActiveUser().getEmail();
  
  //var threads = GmailApp.search('from:Alexander', 0, 20);
  var threads = GmailApp.search('from:Alexander');
  Logger.log("Number of threads found from Alexander> " + threads.length);
  var senderEmail = 'Alexander <admin@alexanderjuanantoniocortes.com>';
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages()
    Logger.log(messages[0].getPlainBody()); // Log contents of the body
    for (var j = 0; j < messages.length; j++) {
      if(senderEmail == messages[j].getFrom()){
        Logger.log(messages[0].getFrom()); // Log contents of the body
        var title = doc.getBody().appendParagraph(messages[j].getSubject());
        title.setAttributes(styleTitle);
        var cuerpo = doc.getBody().appendParagraph(messages[j].getPlainBody());
        cuerpo.setAttributes(styleBody);
        doc.getBody().appendHorizontalRule();
      }
    }
    
    //Mark the mail thread as read
    threads[i].moveToTrash();    
  }
  doc.saveAndClose();
  
}
