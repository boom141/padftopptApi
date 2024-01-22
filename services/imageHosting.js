import { unlinkSync, readFileSync } from 'fs'
import { imagekit} from './imageKit.js'
import pdfjs from 'pdfjs-dist/legacy/build/pdf.js'
import sharp from 'sharp'
import Path from 'path'

const { getDocument, OPS } = pdfjs

const uploadImage = async (imageBuffers, name) =>{
  return imagekit.upload({
    file : imageBuffers, 
    fileName : name
  }).then(response => {
      return response;
  }).catch(error => {
      return error;
  });
}

export const exportImages = async (src, dst, filter = []) => {
    const doc = await getDocument(src).promise
    const pageCount = doc._pdfInfo.numPages
    const images = []
    for (let p = 1; p <= pageCount; p++) {
      const page = await doc.getPage(p)
      const ops = await page.getOperatorList()

      const perPageImages = []
      for (let i = 0; i < ops.fnArray.length; i++) {
        try {
          if (
            ops.fnArray[i] === OPS.paintImageXObject ||
            ops.fnArray[i] === OPS.paintInlineImageXObject
          ) {
            const name = ops.argsArray[i][0]
            const common = await page.commonObjs.has(name)
            const img = await (common
              ? page.commonObjs.get(name)
              : page.objs.get(name)
            )
            const { width, height} = img
            const bytes = img.data.length
            const channels = bytes / width / height
            if (!(channels === 1 || channels === 2 || channels === 3 || channels === 4)) {
              throw new Error(`Invalid image channel: ${channels} for image ${name} on page ${page}`)
            }

            const file = Path.join(dst, `${name}.png`)
            await sharp(img.data, {
              raw: { width, height, channels }
            }).toFile(file)
            
            const imageBuffer = readFileSync(file);
            unlinkSync(file);

            const filename = `${name}.png`;

            perPageImages.push(await uploadImage(imageBuffer, filename));
          }
        } catch (error) {
          return error
        }
      }
      images.push({page: page._pageIndex + 1, images: perPageImages})
    }
    return images
  }



