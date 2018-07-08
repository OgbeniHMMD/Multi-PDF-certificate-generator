# Multi PDF Certificate Generator

_Rapid creation of printable certificates using Acrobat Javascript_

A dynamic template for certificates of completion I created for a trainer in my department. She needs to send PDFs to our print shop so I combined a standard PDF template with some groovy javascript and hidden buttons so she can rapidly create many pages/certs in a single PDF without removing her hands from the keyboard (stopping to use the mouse adds a lot of wasted time and effort). Another wee feature is she can either let the PDF insert today's date automatically or she can type in a date if she's creating a cert after the fact.

## Purpose

Using JavaScript in a PDF to quickly and easily generate multiple (20-30) course completion certificates each class.

Initial Problem: I designed a certificate template for a teacher to distribute to her students. She loved it but then, basically, asked, “So do I just have you make a bunch of these and type their names in them so I can send them to the printer each time I have a class?”

No. The answer was most definitely no. That wasn’t going to happen. I didn’t want to simply tell her no, however, and seem like an uncooperative team player (which is the only possible outcome of me stating that was her job, problem, circus, monkeys, etc.).

## Brainstorming and Designing the App

### Initial Idea:

Fortunately, I know Acrobat has a good relationship with Javascript. My first idea was to tell her she could import a text file containing a list of recipients and click a button to generate the required certs with their names and an automatically generated date—I would create the dynamic form fields, button, and Javascript.

### First Obstacle:

That method requires the text file to be tab-delimited requiring her to know enough Excel for that. Thus, importing the list is unacceptable because that means telling her she has to do something and learn something. Customers don’t like doing and learning things.

### Second Idea:

Creating an Acrobat form in which she could type or paste a list of names—theoretically, I thought, the button she’d then click would convert that list into an array and puke out a bunch of certificates. This required some thought and research on my part but I figured
* the idea of typing/pasting a list in a single field would be much faster and more reasonable to ask for than separate fields for each name
* One field is prettier than a bunch of fields
* Number of students vary so there would either be too few fields or I’d have to figure out an elegant way to dynamically create more as needed and, oh geez, it’s already a pain in the butt.

### Final Idea:

While I mulled over how to do that in a way that didn’t suck, I put together a prototype for a single name so I could hammer out the process and code. As it turns out, the prototype worked far faster and better than the other solutions. Check it out…

## Creating the Cert Generator Dynamic PDF

### Step #1: Create the Certificate itself

Basic “background” created in **Photoshop**. I had the Director write his signature large on a blank sheet of copier paper with a sharpie, scanned it, and changed that layer’s **Blend Mode** to **Multiply**. You’re welcome.

![Screenshot of certificate template with blank areas for dynamic text to populate student name and date](https://jotascript.files.wordpress.com/2015/12/fortute_01.png)

Saved the **PSD** as a **PDF** named _GreatCertGenerator.pdf_ and, in **Acrobat**, added two text fields that would populate dynamically: **recipientName** and **date**.

### Step #2: Create the Form

Just laid this out quickly in Photoshop.

![First and only visible page of PDF form with fields for student name and date](https://jotascript.files.wordpress.com/2015/12/fortute_02.png)

I also created button, which you’ll see in a moment, in a separate file. I’ll explain why the button is separate very soon. Saved it as _CertForm.pdf_ and imported it into _GreatCertGenerator.pdf_  using the following lame, convoluted method (Acrobat, like MS Office, becomes more of a pain in the ass every single version):
* Click the **Tools** tab (Grr … it makes me angry even just writing it).
* Click **Organize Pages** (another step that didn’t used to be there!).
* Choose **Insert > From File** and navigate to _CertForm.pdf_, select **Before Page 1** and click **OK**.
* Added two standard input text fields: **singleName** and **myDate**.

Originally, the form had only the **Name **field—the date was generated automatically on the certificate using the following code on page 1 (so it would happen as soon as the document opened):

_var x = this.getField("date"); x.value = util.printd ("mmmm dd, yyyy", new Date())_

However, I wanted to give the user the option to type in their own date if they’re reprinting an old cert or if they’re not creating these the day of the class so I created the **myDate** field in the form to “receive” the above code instead and, in the first line, changed **date** to **myDate**. The final version of the code in page 1’s **Page Properties > Actions > Run a JavaScript** looks like this:

_var x = this.getField("myDate"); x.value = util.printd ("mmmm dd, yyyy", new Date())_**
**
![Screenshot of Acrobat. Form page and template page are visible in pages panel.](https://jotascript.files.wordpress.com/2015/12/incontext.png)

Both pages visible--before making page 2 a template and hiding it--and the green **AddGrad** button created in **Step #4**.

### Step #3: Make the Certificate a Template

* On the certificate page (page 2 for me), click the **Tools** tab.
* Click **Organize Pages**.
* Choose **More > Page Templates**.
* Type a **Name** for the template (mine is “EmptyCert”).
* Click **Add** and click **Yes** when asked to confirm using the current page. EmptyCert is now listed among the Page Templates.
* Poke EmptyCert in the eye to toggle visibility. The page disappears from **Organize Pages** as well as the **Page Thumbnails** panel. This makes the process all magic and mystery for the users.
    
![Four screenshots of the Page Templates window in Acrobat Pro showing each task described in Step 3](https://jotascript.files.wordpress.com/2015/12/addpagetemplate.png)

### Step #4 Create the Magic Button

Because I’m assuming you already know how to create forms in Acrobat and I don’t want to type the lame, convoluted way you have to do it now because I’ll start ranting, I’ll just show you how I made my button prettier than the average button and added the JavaScript that generates each certificate with the name and date. First, I created the button in Photoshop and saved it as a PDF (see Step #2).

![Three screenshots of process for creating a button as described in step 4](https://jotascript.files.wordpress.com/2015/12/for_butt.png)

In **Button Properties**, under the **Options** tab (not the **Appearance** tab):
* I made the text in Photoshop, so I chose **Icon Only** for **Layout**.
* I chose **Push** for **Behavior**. You could, instead, choose **None** and, instead use separate images for each **State** in the **Icon and Label** section.
* Click **Choose Icon** and navigate to your button (which must be saved as a PDF).
* Under the **Actions** tab, the **Trigger** is **Mouse Up** and the **Action** is **Run a JavaScript** (see code below).
* Click **Close**.

Here’s the code and explanations a piece at a time:

Identify the template.

_var a = this.getTemplate ("EmptyCert");_

On the template, we’ve got a couple form fields waiting as placeholders.

Fill **recipientName** on the template with the contents of **singleName** in the form.

_getField("recipientName").value = getField("singleName").valueAsString;_

Fill **date** on the template with the contents of **myDate** in the form.

_getField("date").value = getField("myDate").valueAsString;_

Create (“spawn”) a new page based on that template.

_a.spawn();_

### Step #5 Creating the Over-the-Top Awesomeness

**New Problem:** When the user clicks **Add Grad**, they’re jumped to the new page/certificate. I hated the fact that the user must then stop, grab the mouse, click the first page in the Thumbnails panel to return to the form, click the Name filed, then move their hands back to the keyboard to type the next name. Life is way, way to freakin’ short for that nonsense.

One page 2 (the cert), I created an invisible button called **Return**. It’s invisible because the user never needs to click it so they don’t need to even know where it is. On **MouseUp**, the **Action** is **Go to Page 1**. Behold this line of JavaScript in Page 1’s **Page Properties** is:

_getField("singleName").setFocus(); _

So the PDF works like this at ludicrous speed: When the user opens the doc—the **Name** field is autofocused and ready.
* User types the Name, presses Tab and Enter to generate the cert
* New cert opens—user presses Tab and Enter to return to the form (GoTo step 1)

Lather, rinse, repeat (really, really fast).
![Screenshot of Acrobat Pro showing pages panel filled with multiple new custom certificates](https://jotascript.files.wordpress.com/2015/12/gloriouscerts.png)

After creating all the certs they need, the user saves the PDF and emails it to their printer.