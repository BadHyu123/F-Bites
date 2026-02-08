# F-bites — Client

This folder contains the frontend (React + Vite) for the F-bites app after extracting from the monorepo root.

Quick start

1. Install dependencies from repo root and client:

```bash
npm install
npm --prefix client install
```

2. Run client dev server (from repo root):

```bash
npm run client:dev
# or from client folder
cd client
npm run dev
```

Build & preview

```bash
npm run client:build
npm run client:preview
```

Notes

- The root repository now exposes `client:*` scripts that proxy into the `client/` package.json.
- Keep the backend in `backend/` and run it independently with `npm run server:dev` from the repo root.
