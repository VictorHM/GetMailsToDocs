/**
 * Creates a Google Doc and copy the texts of mails in it.
 * Mails will be retrieved by sender. This script is intended
 * as a way to get information from newsletters in a single document
 */
function getMailsToDoc() {
  //Creates the document to contains extracted mail texts
  var date = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");
  var doc = DocumentApp.create('NewDocument ' + date);
  
  // Define a custom paragraph style.
  var styleTitle = {};
  styleTitle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  styleTitle[DocumentApp.Attribute.BOLD] = true;
  
  var styleBody = {};
  styleBody[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  styleBody[DocumentApp.Attribute.BOLD] = false;
  // Get the email address of the active user - that's you.
  var email = Session.getActiveUser().getEmail();
  
  //Search for the specific mail address you want to extract mails from
  var threads = GmailApp.search('from:NewsLetter');
  //DEBUG Log number of threads found with that email address
  Logger.log("Number of threads found from NewsLetter> " + threads.length);
  
  //This is the right format for the string used later for comparison
  var senderEmail = 'NewsLetter <admin@newsletter.com>';
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages()
    //DEBUG Log contents of the mails bodies to debug traces
    Logger.log(messages[0].getPlainBody());
    for (var j = 0; j < messages.length; j++) {
      if(senderEmail == messages[j].getFrom()){
        //DEBUG Log address of sender to debug traces
        Logger.log(messages[0].getFrom());
        
        var title = doc.getBody().appendParagraph(messages[j].getSubject());
        title.setAttributes(styleTitle);
        var bodytext = doc.getBody().appendParagraph(messages[j].getPlainBody());
        bodytext.setAttributes(styleBody);
        doc.getBody().appendHorizontalRule();
      }
    }
    
    //Mark the mail thread as read
    threads[i].markRead();
    //Send the thread to trash once we get the text in the document
    threads[i].moveToTrash();    
  }
  doc.saveAndClose();
  
}
