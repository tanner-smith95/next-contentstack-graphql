import queryData from "../utils/contentstack/queryData";

export default function Home({ data }) {
  return (
    <>
      <h1>Contentstack GraphQL POC</h1>
      <h2>Collections</h2>
      {Object.keys(data).map((key, index) => (
        <pre key={`obj-${key}-${index}`}>
          {key}: {JSON.stringify(data[key]?.items?.length, null, 2)}
        </pre>
      ))}
      <h2>Payload</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export async function getStaticProps(context) {
  const queryArray = [
    {
      type: "englishPlaceholders: all_placeholder_content",
      params: {
        limit: 3,
        locale: "en-us",
      },
      query: "{ items { title system { uid locale } } }",
    },
    {
      type: "Placeholder2English: all_placeholder_content_2",
      params: {
        limit: 0,
        locale: "en-us",
      },
      query: "{ items { title system { uid locale } } }",
    },
    {
      type: "Placeholder2French: all_placeholder_content_2",
      params: {
        limit: 0,
        locale: "fr",
      },
      query: "{ items { title system { uid locale } } }",
    },
  ];

  const response = await queryData(queryArray);

  // Generate a list of placeholder UIDs

  // const uids = [];

  // for (let i = 0; i < response.all_placeholder_content.items.length; i += 1) {
  //   const currentID =
  //     response?.all_placeholder_content?.items?.[i]?.system?.uid;

  //   if (currentID) {
  //     uids.push(currentID);
  //   }
  // }

  // const fs = require("fs");

  // fs.writeFile("uids.json", JSON.stringify(uids, null, 2), (err) => {
  //   if (err) console.log(err);
  // });

  // console.log(uids);

  return {
    props: {
      data: response || "NOT FOUND",
    },
  };
}
