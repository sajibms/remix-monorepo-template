# Creating a new workspace

- npx create-nx-workspace@latest

# Creating a new remix application

- npx nx g @nx/remix:app apps/app-name

# Creating a new remix library

- npx nx g @nx/remix:lib libs/lib-name

# Creating a new ts library

- npx nx g @nx/js:lib libs/lib-name

# Adding tailwind to an existing application

- npx nx g @nx/remix:tailwind app-name
  Or
- npx nx generate setup-tailwind ...

# Running the application in development mode

- npx nx run app-name:dev
- npx nx dev app-name

# Building the application

- npx nx run app-name:build
- npx nx build app-name

# Checking linting errors

- npx nx run app-name:lint
- npx nx lint app-name

# Adding a route to an existing application

- npx nx g @nx/remix:route path-to-the-route/route-name

# Adding loader to an existing route

- npx nx g @nx/remix:loader path-to-the-route/route-name.extension

# Adding action to an existing route

- npx nx g @nx/remix:action path-to-the-route/route-name.extension

# libs folder contains all the libraries, which are shared across the application

# apps folder contains all the applications
