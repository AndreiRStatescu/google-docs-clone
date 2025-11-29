This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then start convex using

```
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Setup 3rd party tools

- Convex
- Clerk

- Liveblocks
  - Create new project
  - Go to API Keys -> get public and secret key
    (Created using Quickstat -> Text Editor -> Liveblocks Tiptap -> Next.JS)

## TODO Notes

- some console logs in toolbar-font-size-button.tsx are triggering mandatory reloads - fix this
- when editor is out of focus, we use a dummy cursor that doesn't blink in its place, but the behaviour doesn't work well on some behaviours, like Undo
- explore TanStack query from Convex
- removing a document on Home screen does not sync with pagination properly - will not add another document in the place of the deleted one, even the pagination requires so (e.g for a pagination of 5, removing 2 documents will leave only 3 docs on screen, until the user does a manual page refresh) - design a more elaborate way to handle this
- currently printing the the Clerk user id and org id in the frontend - remove that from prod version
- error page - ghost button barely visible
- denying access currently done only after 5 failed attempts to connect to liveblocks - that's a bit too long and a poor use experience
- enable pre-push gitguardian check
- notification sometimes show up 2-3 times for the same tagging, also having some frontend errors in Safari when tagging, despite no obvious issue being seen. Additionally, the displayed number of notifications show the count of all the notification, not just the unread ones as was the expected behaviour
- add authorization to api.documents.getById (check for other methods missing authorization as well)
- removing a doc from the doc page files menu will try to reload and end up with an error. This is because the mutation will trigger an exception before there is any change to route this back to the main page
- renaming a doc from the doc page files menu does not refresh the title on the page, unless you also a page reload
- right clicking a document from the files menu should open the doc in a new taqb, not select the doc
- adding proper use of liveblock/suspense with components wrapped properly into <ClientSideSuspense> tags may decrease loading time to the point where the "Room loading..." screen no longer shows up. 