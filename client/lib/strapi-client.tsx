import { strapi } from "@strapi/client";
import { getStrapiURL } from "./utils";

const PATH = "/api";
const STRAPI_BASE_URL = getStrapiURL();
const url = new URL(PATH, STRAPI_BASE_URL);

const client = strapi({ baseURL: url.toString() });

export async function getAllArticles() {
  const articles = await client.collection("articles").find();
  return articles;
}

export async function getArticleBySlug(slug: string, status: "draft" | "published") {
  console.log(slug, "slug")
  const article = await client.collection("articles").find({
    filters: { slug: { $eq: slug } },
    status: status,
  });
  return article;
}

export async function submitToNewsletter(email: string) {
  try {    
    const response = await fetch(`${STRAPI_BASE_URL}/api/newsletters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email: email,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}