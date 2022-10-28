/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import queryData from "../../utils/contentstack/queryData";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import parse from "html-react-parser";

export default function Page({ data }) {
  const pageData = data?.all_placeholder_content?.items?.[0];
  return (
    <>
      <h1>{pageData?.title}</h1>

      {pageData?.value_1 && <h2>Value 1: {pageData.value_1}</h2>}

      {pageData?.value_2 && <h2>Value 2: {pageData.value_2}</h2>}

      {pageData?.value_3 && <h2>Value 3: {pageData.value_3}</h2>}

      {pageData?.related_contentConnection?.edges?.[0]?.node?.url && (
        <h2>
          <a href={pageData.related_contentConnection.edges[0].node.url}>
            Related Content:{" "}
            {pageData?.related_contentConnection?.edges?.[0]?.node?.title ||
              pageData.related_contentConnection.edges[0].node.url}
          </a>
        </h2>
      )}

      {pageData?.banner_imageConnection?.edges?.[0]?.node?.url && (
        <img
          style={{ width: "100%" }}
          src={pageData.banner_imageConnection.edges[0].node.url}
          alt={pageData?.banner_imageConnection?.edges?.[0]?.node?.filename}
        />
      )}

      {pageData?.description?.json && (
        <div>{parse(jsonToHtml(pageData.description.json))}</div>
      )}

      <h2>Payload</h2>
      <pre>{JSON.stringify(pageData, null, 2)}</pre>
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
