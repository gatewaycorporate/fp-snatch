# FP-Snatch
## Developed by Gateway Corporate Solutions LLC

FP-Snatch is an open-source data collection script to be run client-side in tandem with Gateway Corporate's FP-Devicer fingerprinting software.
After modifying the script to your desire, you can embed it into your web page by importing the script and creating a new Snatch instance. The script can be embedded into any HTML-based web server.
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Your Web Server</title>
    <script src="./dist/bundle.js"></script>
    <script defer>
      var Snatch = window["snatch"];
      var agent = new Snatch({url: "http://localhost", method: "POST"});
      agent.send();
    </script>
  </head>
  <body>
    // Your web content here
    // Access user data within-page by using agent.dataset
  </body>
<html>
```

Your server located at `url` should be configured to recieve and parse stringified JSON data in the following format for processing.
```javascript
type FPDataSet = {
  [key: string]: any;
}
```

