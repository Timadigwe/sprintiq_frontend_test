import "firebase/compat/storage";

import multiavatar from "@multiavatar/multiavatar";
import { initializeApp } from "firebase/app";
import {
  type FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import sharp from "sharp";
import { Readable } from "stream";
import {
  type Config,
  uniqueUsernameGenerator,
} from "unique-username-generator";
const firebaseConfig = {
  storageBucket: "sprintiq.appspot.com",
};

export class HelperService {
  /**
   * Generate a unique username using a predefined list of nouns and additional configuration.
   *
   * @return {string} the generated unique username
   */
  public static generateUserName(): string {
    const sprintIQNouns = ["Solstar", "Gamer", "SprintQuzer"];
    const config: Config = {
      dictionaries: [sprintIQNouns],
      separator: "",
      style: "capital",
      randomDigits: 3,
    };

    const username: string = uniqueUsernameGenerator(config);
    return username;
  }

  /**
   * A description of the entire function.
   *
   * @param {string} username - description of parameter
   * @return {Promise<string>} description of return value
   */
  public static async generateUserNameImage(username: string): Promise<string> {
    const image_svg = multiavatar(username);
    const image_buffer = await this.svgToPng(image_svg);
    const image_url = await this.uploadImage(image_buffer);
    return image_url;
  }
  /**
   *
   * @param {Buffer} buffer - parameter for the image buffer
   * @return {Promise<string>} returns a Promise with the download URL of the uploaded image
   */
  private static async uploadImage(buffer: Buffer): Promise<string> {
    initializeApp({
      storageBucket: firebaseConfig.storageBucket,
    });
    const storage = getStorage();
    const storageRef = ref(storage, `images/${Date.now()}.png`);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/png",
    });
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  }
  /**
   * A function that converts an SVG string to a PNG buffer.
   *
   * @param {string} svgString - the SVG string to convert
   * @return {Promise<Buffer>} a Promise that resolves to a PNG buffer
   */
  private static svgToPng(svgString: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const svgStream = new Readable();

      svgStream.push(svgString);

      svgStream.push(null);

      svgStream.pipe(
        sharp()
          .png()

          .toBuffer((err, buffer) => {
            if (err) {
              reject(err);
            } else {
              resolve(buffer);
            }
          }),
      );
    });
  }
}
