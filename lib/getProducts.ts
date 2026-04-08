import { shopifyClient } from "./shopify";

export const getProducts = async () => {
  const query = `
    {
      products(first: 250) {
        edges {
          node {
            id
            title
            description
            collections(first: 250) {
              edges {
                node {
                  handle
                }
              }
            }
            options {
              name
              values
            }
            images(first: 100) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyClient.request(query);

  return data.products.edges.map((item: any) => {
    const product = item.node;

    const collectionHandles = product.collections.edges.map(
      (edge: any) => edge.node.handle
    ).join(" ");

    const sizes =
      product.options.find((opt: any) => opt.name === "Size")?.values || [];

    const colors =
      product.options.find((opt: any) => opt.name === "Color")?.values || [];

    const images: Record<string, string> = {};

    product.variants.edges.forEach((variant: any) => {
      const colorOption = variant.node.selectedOptions.find(
        (opt: any) => opt.name === "Color"
      );

      if (colorOption && variant.node.image?.url) {
        images[colorOption.value.toLowerCase()] =
          variant.node.image.url;
      }
    });

    return {
      id: product.id,
      name: product.title,
      category: collectionHandles.toLowerCase() || "all",
      shortDescription: product.description,
      description: product.description,
      price: parseFloat(
        product.variants.edges[0].node.price.amount
      ),
      sizes,
      colors: colors.map((c: string) => c.toLowerCase()),
      images,
    };
  });
};