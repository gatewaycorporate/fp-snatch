# FP-Snatch
## Developed by Gateway Corporate Solutions LLC

FP-Snatch is an open-source data collection script to be run client-side in tandem with Gateway Corporate's FP-Devicer fingerprinting software.
The script can be embedded into any HTML-based web server after setting `targetURL` in your copy of snatch.js.
After modifying the script to your desire, you can embed it into your web page with a simple script tag.
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Your Web Server</title>
    <script src="/snatch.js"></script>
  </head>
  <body>
    // Your web content here
    // Access user data within-page by using document.dataset
  </body>
<html>
```

Your server located at `targetURL` should be configured to recieve and parse stringified JSON data in the following format for processing.
```typescript
type FPDataSet = {
  [key: string]: any;
}
```

