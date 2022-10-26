import contentstack from "@contentstack/management";
import getPlaceholder from "./getPlaceholder.js";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

async function createPlaceholders() {
  const contentType = "placeholder_content";
  const numPlaceholders = 50000;
  const startIndex = 5095;
  const concurrentPromises = 10;

  let pause = false;

  let promises = [];

  const contentstackClient = contentstack.client();

  const branch = process.env.CONTENTSTACK_BRANCH || "main";

  const stack = contentstackClient.stack({
    api_key: process.env.CONTENTSTACK_API_KEY,
    management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    branch_uid: branch,
  });

  for (let i = startIndex; i < numPlaceholders; i += 1) {
    if (pause) {
      console.log(
        "\n*****************************\nWaiting...\n*****************************\n"
      );
      await new Promise((resolve) => setTimeout(resolve, 1100));
      pause = false;
    }

    promises.push(
      new Promise(async (resolve, reject) => {
        const entry = getPlaceholder(i);

        let entryUid = null;
        let entryVersion = null;
        let entryTitle = null;

        if (entry) {
          try {
            await stack
              .contentType(contentType)
              .entry()
              .create({ entry })
              .then((result) => {
                entryUid = result?.uid;
                entryVersion = result?._version;
                entryTitle = result?.title;
              });
          } catch (error) {
            console.log(`TEST Failed at entry ${i}`);

            console.log(error?.errorMessage);
            console.log(error?.errors);
          }
        }

        if (entryUid && entryVersion) {
          let postData = JSON.stringify({
            entry: {
              environments: ["prod"],
            },
            version: entryVersion,
          });

          let options = {
            hostname: "api.contentstack.io",
            path: `/v3/content_types/${contentType}/entries/${entryUid}/publish`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              api_key: process.env.CONTENTSTACK_API_KEY,
              authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
              branch: branch,
            },
          };

          let req = https.request(options, (res) => {
            res.on("data", (d) => {
              process.stdout.write(d);
            });

            console.log(`Entry Created: ${entryTitle} - UID: ${entryUid}`);
            resolve(true);
          });

          req.on("error", (e) => {
            console.error(e);
            reject(error);
          });

          req.write(postData);
          req.end();
        }
      })
    );

    if (promises.length >= 5) {
      await Promise.all(promises);

      pause = true;

      promises = [];
    }
  }
}

createPlaceholders();