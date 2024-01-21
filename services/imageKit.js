import 'dotenv/config'
import ImageKit from "imagekit";

export const publicKey =  process.env.PUBLIC_KEY;
export const privateKey = process.env.PRIVATE_KEY;
export const urlEndpoint = process.env.URL_ENDPOINT;

export const imagekit = new ImageKit({
    publicKey : publicKey,
    privateKey : privateKey,
    urlEndpoint : urlEndpoint
});