import { exportImages } from "./services/imageHosting.js"
import pdfTextExtract from "pdf-text-extract"
import express from "express";

const file = 'file1.pdf';
const app = express();
const port = 5000;

app.get("/api/contentExtract", async (req, res) => {
    const images = await exportImages(file, 'images')
    pdfTextExtract(file, { splitPages: false }, (err, text) =>{
    if (err) {
        res.send(err)
    }
        const result = { texts: text, images: images}
        res.send(result);
    })
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});



