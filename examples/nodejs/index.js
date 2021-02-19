import { createWriteStream, existsSync } from "fs";
import { readdir, mkdir } from "fs/promises";
import {
  SENTINEL_ENGINE_DEVICE_AUTH_KEY,
  SENTINEL_ENGINE_DEVICE_ID,
  SENTINEL_ENGINE_FILE_FOLDER,
  SENTINEL_ENGINE_URL,
  SENTINEL_ENGINE_POLL_FREQUENCY,
} from "./config.js";
import md5 from "md5-file";
import axios from "axios";

(async () => {
  console.log("Running SentinelEngine Device File Manager...");
  if (!existsSync(SENTINEL_ENGINE_FILE_FOLDER)) {
    console.log("SENTINEL_ENGINE_FILE_FOLDER missing, creating...");
    await mkdir(SENTINEL_ENGINE_FILE_FOLDER);
    console.log("Folder created.");
  }
  const headers = {
    authorization: SENTINEL_ENGINE_DEVICE_AUTH_KEY,
    deviceid: SENTINEL_ENGINE_DEVICE_ID,
  };

  while (true) {
    try {
      const localFilenames = await readdir(SENTINEL_ENGINE_FILE_FOLDER);
      const localFilesStates = await Promise.all(
        localFilenames.map(async (filename) => ({
          filename,
          md5: await md5(`${SENTINEL_ENGINE_FILE_FOLDER}/${filename}`),
        }))
      );

      console.log("Sync files...");
      const latestFileStates = (
        await axios.post(
          `${SENTINEL_ENGINE_URL}/device/sync`,
          localFilesStates,
          { headers }
        )
      ).data;

      if (latestFileStates.length < 1) {
        console.log("Folder up to date.");
      } else {
        console.log("Downloading new files...");
        await Promise.all(
          latestFileStates.map(async (file) => {
            const res = await axios.get(file.download, {
              responseType: "stream",
            });
            const destinationPath = `${SENTINEL_ENGINE_FILE_FOLDER}/${file.filename}`;
            const destination = createWriteStream(destinationPath);
            res.data.pipe(destination);
            return new Promise((resolve, reject) => {
              destination.on("finish", resolve);
              destination.on("error", reject);
            });
          })
        );
        console.log("Folder up to date.");
      }
      await new Promise((r) => setTimeout(r, SENTINEL_ENGINE_POLL_FREQUENCY));
    } catch (err) {
      // Log Error
      console.log("Oops something is wrong:");
      if (err.isAxiosError) {
        console.error(err?.message);
        console.error(`URL: ${err?.config?.url}`);
        console.error(
          `Headers: ${JSON.stringify(err?.response?.headers, null, 2)}`
        );
      } else {
        console.error(err);
      }

      // Error cool-off
      await new Promise((r) =>
        setTimeout(r, SENTINEL_ENGINE_POLL_FREQUENCY * 2)
      );
    }
  }
})();
