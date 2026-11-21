# Mosswell — concept revenue & operations dashboard

A fictional admin dashboard for a made-up coffee brand ("Halden Coffee Co."), built as a portfolio
concept by [Codemade Studio](https://codemade.studio). All data is generated demo data.

Stack: React 19 · Vite · Tailwind CSS 4 · React Router · Recharts · Lucide icons · Inter.

Pages: Login (`/login`), Overview (`/`), Orders (`/orders`), Customers (`/customers`), Settings (`/settings`).

```bash
npm install
npm run dev     # local dev server
npm run build   # production build to dist/
```

Deploy on Vercel: import the repo, framework preset **Vite**. `vercel.json` rewrites all routes to
`index.html` so refreshing a sub-page works.
