import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import type { MetaFunction, LinksFunction } from '@remix-run/node';
import './tailwind.css';
import { Toaster } from 'react-hot-toast';
import { CookieConsentBanner } from '@acme/UI';

export const meta: MetaFunction = () => [
  {
    title: 'New Remix App',
  },
];

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Toaster position="top-right" />
        <CookieConsentBanner />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  const response = isRouteErrorResponse(error);

  if (response) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md">
          <h1 className="text-4xl font-bold text-red-600">
            {error.status} - {error.statusText}
          </h1>
          <p className="mt-4 text-lg">
            {error.data?.message ?? 'Something went wrong!'}
          </p>
          <p className="mt-6">
            <Link
              to="/"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Home Page!!
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md">
        <h1 className="text-4xl font-bold text-red-600">An error occurred!</h1>
        <p className="mt-4 text-lg">
          {error instanceof Error
            ? error.message.toString()
            : 'Something went wrong!'}
        </p>
        <p className="mt-6">
          <Link
            to="/"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Home Page!!
          </Link>
        </p>
      </div>
    </main>
  );
};
