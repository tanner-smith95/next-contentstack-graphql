const env = process.env.CONTENTSTACK_ENVIRONMENT;
const apiKey = process.env.CONTENTSTACK_API_KEY;
const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;

async function queryData(query) {
  if (env && apiKey && deliveryToken) {
    const response = await fetch(
      `https://graphql.contentstack.com/stacks/${apiKey}?environment=${env}&query=query${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          access_token: deliveryToken,
          branch: "main",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    return response;
  }
  return null;
}

export default queryData;
