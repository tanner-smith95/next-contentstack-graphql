import queryData from "../utils/contentstack/queryData";

export default function Home({ data }) {
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export async function getStaticProps(context) {
  const response = await queryData(
    "{ all_placeholder_content { items { title } } all_placeholder_content_2 { items { title } } }"
  );

  return {
    props: {
      data: response?.data || "NOT FOUND",
    },
  };
}
