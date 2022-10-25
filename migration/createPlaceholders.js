import contentstack from "@contentstack/management";
import getPlaceholder from "./getPlaceholder.js";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

async function createPlaceholders() {
  const contentType = "placeholder_content";

  const contentstackClient = contentstack.client();

  const branch = process.env.CONTENTSTACK_BRANCH || "main";

  const stack = contentstackClient.stack({
    api_key: process.env.CONTENTSTACK_API_KEY,
    management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    branch_uid: branch,
  });

  const entry = getPlaceholder(-1);

  let entryUid = null;
  let entryVersion = null;
  let entryTitle = null;

  if (entry) {
    await stack
      .contentType(contentType)
      .entry()
      .create({ entry })
      .then((result) => {
        entryUid = result?.uid;
        entryVersion = result?._version;
        entryTitle = result?.title;
      });
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
    });

    req.on("error", (e) => {
      console.error(e);
    });

    req.write(postData);
    req.end();
  }
}

createPlaceholders();
