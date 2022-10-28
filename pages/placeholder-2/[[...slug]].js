/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import queryData from "../../utils/contentstack/queryData";
import getPlaceholders from "../../collections/getPlaceholdes";
import fragments from "../../queries/fragments";
import PlaceholderTemplate from "../../components/templates/placeholderTemplate";

export default function Page({ data }) {
  return data?.all_placeholder_content_2?.items?.[0] ? (
    <PlaceholderTemplate
      pageData={data?.all_placeholder_content_2?.items?.[0]}
    />
  ) : null;
}

export async function getStaticPaths() {
  console.log(
    `getStaticPaths[...slug] ------------------------------------------------------------------------`
  );

  const response = await getPlaceholders(false);

  const slugs = [];

  // Build all alternate placeholder routes
  for (let i = 0; i < response.all_placeholder_content_2.items.length; i += 1) {
    const currentUrl = response?.all_placeholder_content_2?.items?.[i]?.url;

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
      type: "all_placeholder_content_2",
      params: {
        limit: 1,
        where: `{url: "${slug?.join("/")}"}`,
      },
      query: `{
        items {
          system {
            content_type_uid
          }
          url
          title
          value_1
          value_2
          value_3
          description {
            ${fragments.richText}
          }
          banner_imageConnection {
            ${fragments.image}
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
