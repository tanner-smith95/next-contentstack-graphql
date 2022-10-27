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

  const { params: { slug } = {} } = context ?? {};

  console.log("Page route:", slug.join("/"));

  const queryArray = [
    {
      type: "all_placeholder_content",
      params: {
        limit: 1,
        where: `{url: "${slug?.join("/")}"}`,
      },
      query: `{
        items {
          url
          title
          value_1
          value_2
          value_3
          description {
            json
          }
          banner_imageConnection {
            edges {
              node {
                url
                title
                description
                dimension {
                  height
                  width
                }
                filename
              }
            }
          }
          related_contentConnection {
            edges {
              node {
                ... on PlaceholderContent2 {
                  title
                  url
                  banner_imageConnection {
                    edges {
                      node {
                        description
                        dimension {
                          height
                          width
                        }
                        filename
                        title
                        url
                      }
                    }
                  }
                  description {
                    json
                  }
                  value_1
                  value_3
                  value_2
                }
              }
            }
          }
        }
      }`,
    },
  ];

  const response = await queryData(queryArray);

  return {
    props: {
      data: response || "NO DATA",
    },
  };
}
