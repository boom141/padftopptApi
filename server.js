import { exportImages } from "./services/pdfContentExtract.js"

exportImages('hostFiles/file1.pdf', 'images')
  .then(images => console.log('Exported', images))
  .catch(console.error)
