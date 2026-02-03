ZazaGuide is a multilingual (EN/KA/RU) tours website for Georgia with a Next.js App Router frontend, Prisma, and PostgreSQL (Supabase).

## Getting Started

First, set your environment variables in `.env`:

```
DATABASE_URL="postgresql://postgres.erzigynyrbfzqenjszam:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.erzigynyrbfzqenjszam.supabase.co:5432/postgres"
NEXTAUTH_SECRET="[REPLACE-ME]"
NEXTAUTH_URL="http://localhost:5000"
SUPABASE_URL="https://erzigynyrbfzqenjszam.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[REPLACE-ME]"
SUPABASE_STORAGE_BUCKET="tours"
```

Make sure you have a public Supabase Storage bucket named `tours` (or change `SUPABASE_STORAGE_BUCKET`).

Then run the development server:

```bash
npm run dev
```

Open http://localhost:5000 and you will be redirected to `/en`.

Seed the database (creates the admin user and default homepage settings):

```bash
npm run prisma:seed
```

Admin seed defaults to `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

Run migrations locally:

```bash
npx prisma migrate dev
```

Deploy migrations in production:

```bash
npx prisma migrate deploy
```

This project uses `next/font` to load Playfair Display and Manrope.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
