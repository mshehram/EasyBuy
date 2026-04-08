
import { shopifyClient } from "./shopify";

export const getSingleProduct = async (id: string) => {
  const query = `
    query ($id: ID!) {
      product(id: $id) {
        id
        title
        description
        options {
          name
          values
        }
        variants(first: 10) {
          edges {
            node {
              price {
                amount
              }
              selectedOptions {
                name
                value
              }
              image {
                url
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyClient.request(query, { id });

  const product = data.product;

  const sizes =
    product.options.find((o: any) => o.name === "Size")?.values || [];

  const colors =
    product.options.find((o: any) => o.name === "Color")?.values || [];

  const images: Record<string, string> = {};

  product.variants.edges.forEach((variant: any) => {
    const color = variant.node.selectedOptions.find(
      (o: any) => o.name === "Color"
    );

    if (color && variant.node.image?.url) {
      images[color.value.toLowerCase()] = variant.node.image.url;
    }
  });

  return {
    id: product.id,
    name: product.title,
    description: product.description,
    shortDescription: product.description,
    price: parseFloat(
      product.variants.edges[0].node.price.amount
    ),
    sizes,
    colors: colors.map((c: string) => c.toLowerCase()),
    images,
  };
};