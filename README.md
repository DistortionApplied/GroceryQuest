# GroceryQuest

A simple and effective grocery list app built with Next.js, React, and TypeScript. Create shopping lists and check off items as you purchase them.

## Features

- **Create Lists**: Organize your shopping with named lists (Weekly Groceries, Party Supplies, etc.)
- **Add Items**: Add items to your lists one by one or in batches
- **Check Off Items**: Mark items as purchased with a simple tap while shopping
- **Progress Tracking**: Visual progress bars showing shopping completion
- **Dark Mode**: Built-in dark mode support
- **Responsive Design**: Works on mobile and desktop

## How It Works

1. **Create a List**: Start by creating a named shopping list
2. **Add Items**: Add all the items you need to buy to your list
3. **Go Shopping**: Select your list and check off items as you purchase them
4. **Track Progress**: See your completion progress with visual indicators

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Local Storage
- **Package Manager**: Bun

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the development server:
   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
bun run build
bun run start
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── app/
│   ├── add/page.tsx          # Add new grocery item
│   ├── request/[id]/page.tsx # View/edit individual item
│   ├── requests/page.tsx     # Main grocery list
│   └── layout.tsx            # App layout
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── TaskItem.tsx          # Individual task/item component
│   ├── RequestCard.tsx       # Grocery item card
│   ├── XPBar.tsx             # XP and level display
│   └── ...                   # Other components
└── lib/
    └── clientData.ts         # Data management and storage
```



## License

This project is based on the original TaskQuest app and follows the same license terms.</content>
<parameter name="filePath">README.md