import queryData from "../../utils/contentstack/queryData";

export default function Page({ data }) {
  return (
    <>
      <h1>Placeholder Page</h1>
      <h2>Payload</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export async function getStaticPaths() {
  console.log(
    `getStaticPaths[...slug] ------------------------------------------------------------------------`
  );

  const queryArray = [
    {
      type: "all_placeholder_content",
      params: {
        limit: 0,
      },
      query: "{ items { url } }",
    },
  ];

  const response = await queryData(queryArray);
  const slugs = [];

  for (let i = 0; i < response.all_placeholder_content.items.length; i += 1) {
    const currentUrl = response?.all_placeholder_content?.items?.[i]?.url;

    if (currentUrl) {
      slugs.push({ params: { slug: currentUrl.split("/") } });
    }
  }

  return {
    paths: slugs,
    fallback: false, // true, false, or 'blocking'
  };
}

export async function getStaticProps(context) {
  console.log(
    `getStaticProps[...slug] ------------------------------------------------------------------------`
  );

  return {
    props: {
      data: "NO DATA",
    },
  };
}
