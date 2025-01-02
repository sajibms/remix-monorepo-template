import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// * load the .env file
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  root: __dirname,
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      // routes(defineRoutes) {
      //   return defineRoutes((route) => {
      //     // main layout
      //     route("/", "routes/home/layout.tsx", () => {
      //       route("", "routes/home/route.tsx", { index: true });
      //       route(":slug", "routes/home/slug.tsx");
      //       route("blogs", "routes/blogs/route.tsx", { index: true });
      //       route("blogs/:slug", "routes/blogs/blogDetails.tsx");
      //       route("career", "routes/career/route.tsx", { index: true });
      //       route("contact-us", "routes/contact-us/route.tsx", { index: true });
      //       route("pricing", "routes/pricing/route.tsx", { index: true });
      //     });

      //     // dashboard layout
      //     route("/admin/dashboard", "routes/dashboard/layout.tsx", () => {
      //       route("", "routes/dashboard/route.tsx", { index: true });
      //       route("credential", "routes/dashboard/credential/route.tsx");
      //       route(
      //         "general-settings",
      //         "routes/dashboard/general-settings/route.tsx"
      //       );
      //       route("seo-settings", "routes/dashboard/seo-settings/route.tsx");
      //       route(
      //         "footer-settings",
      //         "routes/dashboard/footer-settings/route.tsx"
      //       );
      //       route(
      //         "other-settings",
      //         "routes/dashboard/other-settings/route.tsx"
      //       );

      //       // nested custom pages
      //       route(
      //         "custom-pages",
      //         "routes/dashboard/custom-pages/layout.tsx",
      //         () => {
      //           route("", "routes/dashboard/custom-pages/route.tsx", {
      //             index: true,
      //           });
      //           route(":slug", "routes/dashboard/custom-pages/slug.tsx");
      //         }
      //       );

      //       // post settings
      //       route(
      //         "post-settings",
      //         "routes/dashboard/post-settings/layout.tsx",
      //         () => {
      //           route("", "routes/dashboard/post-settings/route.tsx", {
      //             index: true,
      //           });
      //           route(":slug", "routes/dashboard/post-settings/slug.tsx");
      //           route(
      //             "upload-csv",
      //             "routes/dashboard/post-settings/upload-csv.tsx"
      //           );
      //         }
      //       );

      //       // nested important pages
      //       route(
      //         "important-pages",
      //         "routes/dashboard/important-pages/layout.tsx",
      //         () => {
      //           route("", "routes/dashboard/important-pages/route.tsx", {
      //             index: true,
      //           });
      //           route(":edit", "routes/dashboard/important-pages/slug.tsx");
      //         }
      //       );
      //     });

      //     // extra routes
      //     route("login", "routes/login/route.tsx", { index: true });
      //     route("logout", "routes/lib/logout.ts", { index: true });
      //     route("sitemap.xml", "routes/sitemap/route.tsx", { index: true });
      //     route("robots.txt", "routes/robots.txt/route.tsx", { index: true });
      //   });
      // },
    }),
    nxViteTsPaths(),
  ],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  }
});
