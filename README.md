# Welth

Welth is a modern, one-stop finance platform built with [Next.js](https://nextjs.org/), [Clerk](https://clerk.com/), and [Tailwind CSS](https://tailwindcss.com/). It provides a seamless experience for managing your finances, tracking transactions, and more.

## Features

- User authentication and management with Clerk
- Responsive UI with Tailwind CSS and custom components
- Protected routes for dashboard, account, and transactions
- Modular component structure for easy scalability
- Modern design with Radix UI and Lucide icons

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/welth.git
   cd welth
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn
   # or
   pnpm install
 

3. Set up environment variables:

   Copy `.env.example` to `.env` and fill in your Clerk keys (already present in this repo for development).

### Running the Development Server

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

- `app/` - Next.js app directory (pages, layouts, authentication)
- `components/` - UI and shared React components
- `lib/` - Utility functions and libraries
- `public/` - Static assets (images, favicon, etc.)
- `middleware.js` - Route protection with Clerk
- `globals.css` - Global styles with Tailwind CSS

## Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint

## Customization

- UI components are built with Radix UI, Lucide icons, and Tailwind CSS.
- Authentication is handled by Clerk; update your Clerk keys in `.env` as needed.
- Modify or extend components in the `components/` directory for your needs.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the MIT License.

---

© 2025 Welth. All rights reserved.