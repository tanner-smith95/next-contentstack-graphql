/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import fs from "fs";
import queryData from "../utils/contentstack/queryData";

const queryArray = [
  {
    type: "all_placeholder_content",
    params: {
      limit: 0,
    },
    query: "{ items { url } }",
  },
];

async function fetchPlaceholders() {
  const entries = await queryData(queryArray);

  return entries;
}

const cacheDir = "/tmp";
const cachePath = `${cacheDir}/cache.placeholderEntries.json`;

async function getPlaceholders(refreshCache = false) {
  let cachedData;

  if (!refreshCache) {
    try {
      cachedData = await fs.readFileSync(cachePath, "utf8");
      cachedData = JSON.parse(cachedData);
      if (cachedData) {
        return cachedData;
      }
    } catch (error) {
      console.error("News cache NOT found");
    }
  }

  try {
    const data = await fetchPlaceholders();
    cachedData = data;
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(cachePath, JSON.stringify(data), "utf8");
    // await fs.closeSync(0);
    console.log("Placeholder cache saved", JSON.stringify(cachedData)?.length);
  } catch (error) {
    console.error("Placeholder cache NOT saved", error);
  }

  return cachedData;
}

export default getPlaceholders;
