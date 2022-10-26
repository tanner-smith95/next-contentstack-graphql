import queryData from "../utils/contentstack/queryData";

export default function Home({ data }) {
  return (
    <>
      {Object.keys(data).map((key, index) => (
        <pre key={`obj-${key}-${index}`}>
          {JSON.stringify(data[key]?.items?.length, null, 2)}
        </pre>
      ))}
    </>
  );
}

export async function getStaticProps(context) {
  const queryArray = [
    {
      type: "all_placeholder_content",
      params: {
        limit: 6327,
      },
      query: "{ items { title } }",
    },
    {
      type: "all_placeholder_content_2",
      query: "{ items { title } }",
    },
  ];

  const response = await queryData(queryArray);

  return {
    props: {
      data: response || "NOT FOUND",
    },
  };
}
