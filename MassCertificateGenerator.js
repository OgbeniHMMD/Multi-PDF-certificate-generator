// Add Name button on first page -- "dashboard"
getField("recipientName").value = getField("singleName").valueAsString;

getField("date").value = getField("myDate").valueAsString;

var a = this.getTemplate ("EmptyCert");
a.spawn();


// Page level script on the template page for the certificate
var x = this.getField("myDate");
x.value = util.printd ("mmmm dd, yyyy", new Date())

getField("singleName").setFocus();
