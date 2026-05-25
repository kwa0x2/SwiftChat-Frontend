# SwiftChat Frontend

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg?logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Website](https://img.shields.io/badge/Live%20Demo-chat.alperkarakoyun.com-red.svg)](https://chat.alperkarakoyun.com/)

> A production-ready, real-time chat frontend built with Next.js. Powers [SwiftChat](https://chat.alperkarakoyun.com/) — a modern messaging platform with friends, rooms, file sharing and live presence.

---

## Overview

SwiftChat Frontend is the web client of SwiftChat, built with [Next.js 14](https://nextjs.org/) (App Router), TypeScript and Tailwind CSS. It talks to the [SwiftChat Backend](https://github.com/kwa0x2/SwiftChat-Backend) over REST and Socket.IO for real-time messaging, friend requests and presence.

## Screenshots

### Login
![Login](https://swift-chat-bucket.s3.eu-west-3.amazonaws.com/assets/login.jpeg)

### Chat
![Chat](https://swift-chat-bucket.s3.eu-west-3.amazonaws.com/assets/chat.jpeg)

### Friends
![Friends](https://swift-chat-bucket.s3.eu-west-3.amazonaws.com/assets/friends.jpeg)

### Profile
![Profile](https://swift-chat-bucket.s3.eu-west-3.amazonaws.com/assets/profile.jpeg)

## Features

- **Real-time messaging** powered by Socket.IO
- **Google OAuth** sign-in and email/password sign-up
- **Friends system** — send, accept and reject requests, block users
- **Chat rooms** with persisted history and live updates
- **File uploads** for profile photos and attachments
- **Responsive UI** built with Tailwind CSS and Radix primitives
- **Dark mode** via `next-themes`
- **State management** with Redux Toolkit

## Tech Stack

| Layer          | Technology                                                      |
|----------------|-----------------------------------------------------------------|
| Framework      | [Next.js 14](https://nextjs.org/) (App Router)                  |
| Language       | TypeScript 5                                                    |
| UI             | Tailwind CSS, Radix UI, shadcn/ui                               |
| State          | Redux Toolkit, React Redux                                      |
| Forms          | React Hook Form + Zod                                           |
| Auth           | NextAuth (v5 beta), JWT                                         |
| Real-time      | socket.io-client                                                |
| Animations     | Framer Motion                                                   |
| HTTP           | Axios                                                           |

## Getting Started

### Prerequisites

- Node.js 18+ and npm / pnpm / yarn / bun
- A running instance of the [SwiftChat Backend](https://github.com/kwa0x2/SwiftChat-Backend)

### 1. Clone the repository

```bash
git clone https://github.com/kwa0x2/SwiftChat-Frontend.git
cd SwiftChat-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Backend API
BASE_URL=http://localhost:9000/api/v1
SOCKET_IO_URL=http://localhost:9000/chat

# NextAuth — generate with: npx auth secret
AUTH_SECRET=your_auth_secret

# Uncomment in production / behind a proxy
# AUTH_TRUST_HOST=true
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # run ESLint
```

## Project Structure

```
SwiftChat-Frontend/
├── app/             # Next.js App Router pages, layouts & API routes
│   ├── (pages)/     # Route groups
│   ├── api/         # Route handlers
│   └── redux/       # Redux store setup
├── actions/         # Server actions
├── components/      # Reusable UI components
│   ├── dialogs/     # Modal dialogs
│   └── ui/          # shadcn/ui primitives
├── hooks/           # Custom React hooks
├── lib/             # Utilities & helpers
├── models/          # Shared types & data models
├── schemas/         # Zod validation schemas
├── public/          # Static assets
├── auth.ts          # NextAuth configuration
├── middleware.ts    # Route protection middleware
└── routes.ts        # Route definitions
```

## Related Repositories

- [SwiftChat Backend](https://github.com/kwa0x2/SwiftChat-Backend) — Go + Gin + Socket.IO

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
