# Blog and Auth Page Router

A personal blog with email/password authentication built with the Next.js **pages** router. Posts are written in Markdown, rendered with syntax highlighting, and the site includes a profile page and contact form. Blog posts can be authored in English or Russian.

## Features

- User registration and login using NextAuth Credentials provider
- Blog posts written in Markdown and highlighted with `react-syntax-highlighter`
- Contact form with server-side validation and notifications
- Profile page for authenticated users
- Localization: English and Russian
- MongoDB for persistence

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create an `.env.local` file based on `.env.example` and provide the values:

```
MONGODB_URI=<your_mongodb_credentials>
NEXTAUTH_SECRET=<optional_nextauth_secret>
NEXTAUTH_URL=<optional_nextauth_url>
```

3. Run the development server:

```bash
npm run dev
```

4. Build and start for production:

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` – run the development server
- `npm run build` – create an optimized production build
- `npm start` – start the production server
- `npm run prettier:fix` – format files with Prettier

## Technologies

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [NextAuth](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Deployment

The project can be deployed to [Vercel](https://vercel.com/).
The link to the deployed version can be found in the repository’s GitHub interface under the About section.
