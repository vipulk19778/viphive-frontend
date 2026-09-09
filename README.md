# VIPHive

VIPHive is a Next.js storefront with authentication, product browsing, cart and checkout flows, order history, payments, and an admin area.

See [CHANGELOG.md](CHANGELOG.md) for release history. Every push and pull request targeting `main` or `master` runs the checks in [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file from [.env.example](.env.example), then update the API and Razorpay values:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                      | Description                            |
| ----------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`        | Application name shown by the frontend |
| `NEXT_PUBLIC_API_URL`         | Backend API base URL                   |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key used by checkout   |

Use the environment-specific files as references for local development and production. Do not commit private credentials.

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
```

## Logging

Application logs are routed through `src/lib/logger.ts`:

- Local development logs are enabled.
- Vercel Preview deployment logs are enabled.
- Vercel Production deployment logs are disabled.

The logger uses Vercel's `VERCEL_ENV` value so Preview deployments remain distinguishable from Production even when `NODE_ENV` is `production`.

## Deploying on Vercel

The repository includes [vercel.json](vercel.json) with the Next.js framework, install command, and build command configured.

In Vercel:

1. Set the Root Directory to the folder containing `package.json`.
2. Add the production values for `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_RAZORPAY_KEY_ID` under Project Settings > Environment Variables.
3. Assign API variables to the appropriate Production, Preview, and Development environments.
4. Deploy the latest commit.

The production build must complete before `npm run start` can be used locally.

## Project Structure

- `src/app` contains route segments and pages.
- `src/features` contains feature-specific components, hooks, schemas, and utilities.
- `src/services/api` contains backend API clients.
- `src/store` contains Redux store configuration and slices.
- `src/components` contains shared UI and layout components.
