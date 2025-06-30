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

// Page related functions (for your dynamic pages)
export async function getAllPages() {
  const query = {
    fields: ['slug', 'title'],
    sort: ['createdAt:desc'],
  };

  const pages = await client.collection("pages").find(query);
  console.log(pages, "pages")
  return pages;
}

export async function getPageBySlug(slug: string) {
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ["SEO", "blocks"],
  };

  try {
    const response = await client.collection("pages").find(query);
    console.log(response, "response");
    
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}