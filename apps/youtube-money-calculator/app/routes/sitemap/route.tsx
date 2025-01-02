import { getAllSitemap } from "@acme/models";

export const loader = async () => {
  const sitemapInfo = await getAllSitemap();
  const siteUrl =
    sitemapInfo?.robotsInfo?.find((url) => url.siteUrl)?.siteUrl ||
    "https://example.com";

  // Construct the sitemap content
  const sitemap = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapInfo?.customPages
          ?.map(
            (post) => `
          <url>
            <loc>${siteUrl}/${post.slug}/</loc>
            <lastmod>${new Date(post.updatedAt as Date).toISOString()}</lastmod>
            <priority>0.8</priority>
          </url>
        `,
          )
          .join("")}
      </urlset>
    `;

  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
