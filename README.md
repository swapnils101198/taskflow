# taskflow

Small team task tracker. Projects, tasks, status transitions.

- client/ — Vite + React + TypeScript
- server/ — Express + TypeScript, domain rules in server/src/domain
- shared/ — types shared by client and server

## Setup

    nvm use
    npm install
    npm run dev

Client on http://localhost:5173, server on http://localhost:4000.

## Scripts

- npm run dev — start client + server
- npm test — run all tests
- npm run typecheck — TypeScript check
- npm run build — production build
