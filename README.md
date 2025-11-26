# Mandazi Pro

A comprehensive business management application for Mandazi (East African fried pastry) production and sales. This app helps you track ingredients, manage recipes, monitor batch production, and analyze sales performance.

## 🎯 Overview

Mandazi Pro is a full-featured desktop application built with modern web technologies. It provides an integrated platform to:

- **Manage Ingredients**: Track ingredient inventory with pricing and unit measurements
- **Create & Manage Recipes**: Design recipes with specific ingredient combinations and expected yields
- **Monitor Production**: Track batch production with cost analysis and yield tracking
- **Record Sales**: Log sales transactions and monitor revenue
- **Analyze Performance**: Visualize business metrics through an intuitive dashboard

## 🚀 Features

### Ingredients Management

- Add and maintain a catalog of ingredients
- Track current pricing for each ingredient
- Support multiple unit types (kg, g, L, ml, pcs)
- Monitor price updates and historical data

### Recipe Management

- Create recipes with multiple ingredients
- Define expected yields and wastage percentages
- Automatically calculate ingredient costs per recipe
- Easy recipe modification and deletion

### Production Batches

- Plan and track batch production
- Monitor batch status (planned, in-progress, completed)
- Calculate actual vs. expected yield
- Track total production costs and cost per unit
- Add production notes for reference

### Sales Tracking

- Record sales with date and quantity information
- Link sales to production batches
- Track unit pricing and total revenue
- View sales history and trends

### Dashboard & Analytics

- View key business metrics at a glance
- Visualize production trends
- Monitor sales performance
- Track financial metrics

## 📋 Tech Stack

### Frontend

- **React** 19.2 - UI library
- **TypeScript** 5.9 - Type-safe JavaScript
- **Vite** 7.2 - Fast build tool and dev server
- **Tailwind CSS** 4.1 - Utility-first styling
- **Recharts** 3.5 - Data visualization charts

### Database

- **PouchDB** 9.0 - Local-first database (IndexedDB based)
- **PouchDB Find** - Query plugin for advanced searches

### Utilities

- **Zod** 4.1 - Schema validation
- **date-fns** 4.1 - Date manipulation
- **UUID** 13.0 - Unique ID generation
- **Lucide React** 0.554 - Icon library

### Development Tools

- **ESLint** - Code quality and style checking
- **TypeScript ESLint** - TypeScript linting
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
mandazi-app/
├── src/
│   ├── components/          # React components
│   │   ├── BatchForm.tsx     # Batch creation form
│   │   ├── BatchList.tsx     # Batch listing and management
│   │   ├── Dashboard.tsx     # Analytics dashboard
│   │   ├── IngredientForm.tsx # Ingredient entry form
│   │   ├── IngredientList.tsx # Ingredient inventory
│   │   ├── RecipeForm.tsx    # Recipe creation form
│   │   ├── RecipeList.tsx    # Recipe management
│   │   └── SalesForm.tsx     # Sales entry form
│   ├── services/            # Business logic
│   │   ├── batchService.ts    # Batch operations
│   │   ├── ingredientService.ts # Ingredient CRUD
│   │   ├── recipeService.ts   # Recipe CRUD
│   │   └── salesService.ts    # Sales operations
│   ├── db/
│   │   └── db.ts            # Database initialization
│   ├── types/
│   │   └── schema.ts        # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── App.css              # Global styles
│   └── index.css            # Base styles
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind configuration
└── eslint.config.js         # ESLint configuration
```

## 🏗️ Data Model

### Ingredient

```typescript
{
  _id: string;
  name: string;
  unit: "kg" | "g" | "L" | "ml" | "pcs";
  currentPrice: number;
  lastUpdated: string; // ISO Date
}
```

### Recipe

```typescript
{
  _id: string;
  name: string;
  expectedYield: number;
  wastagePercent: number;
  ingredients: RecipeIngredient[];
}
```

### Batch

```typescript
{
  _id: string;
  recipeId?: string;
  date: string; // ISO Date
  targetYield: number;
  actualYield?: number;
  totalCost: number;
  costPerUnit?: number;
  status: 'planned' | 'in-progress' | 'completed';
  notes?: string;
}
```

### Sale

```typescript
{
  _id: string;
  batchId?: string;
  date: string; // ISO Date
  quantitySold: number;
  unitPrice: number;
}
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 16+ and npm or yarn
- Modern web browser with IndexedDB support

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mandazi-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📝 Available Scripts

| Script            | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start development server with hot reload      |
| `npm run build`   | Compile TypeScript and build optimized bundle |
| `npm run lint`    | Run ESLint to check code quality              |
| `npm run preview` | Preview production build locally              |

## 💾 Database

The application uses **PouchDB** for local-first data storage:

- Data is stored in the browser's IndexedDB
- No backend server required
- Full offline capability
- Automatic data persistence
- Query support via PouchDB Find plugin

## 🎨 Styling

The project uses **Tailwind CSS** for styling with:

- Utility-first approach for rapid UI development
- Responsive design support
- Dark mode capabilities (configurable)
- Custom theme configuration via `tailwind.config.js`

## 🔍 Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code style and quality enforcement
- **React Hooks**: Plugin for best practices

Run linting:

```bash
npm run lint
```

## 🚀 Getting Started

1. Open the app in your browser
2. Add your ingredients to the inventory
3. Create recipes using the available ingredients
4. Plan and execute production batches
5. Log sales transactions
6. Monitor your business metrics on the dashboard

## 📊 Key Workflows

### Adding an Ingredient

1. Navigate to Ingredients
2. Click "Add Ingredient"
3. Enter name, unit type, and current price
4. Save

### Creating a Recipe

1. Navigate to Recipes
2. Click "New Recipe"
3. Add recipe name, expected yield, and wastage percentage
4. Select and add ingredients with quantities
5. Save

### Recording a Batch

1. Navigate to Batches
2. Click "New Batch"
3. Select recipe (optional)
4. Set target yield and date
5. Monitor with status updates
6. Save actual yield and notes

### Logging Sales

1. Navigate to Sales
2. Click "New Sale"
3. Enter date, quantity sold, and unit price
4. Link to batch if applicable
5. Save

## 🔐 Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Complete control over your business information

## 🛠️ Development

### File Organization

- Components are self-contained in `src/components/`
- Business logic is abstracted in `src/services/`
- Database operations centralized in `src/db/`
- Type definitions in `src/types/`

### Adding New Features

1. Create new component in `src/components/`
2. Add service methods in `src/services/` if needed
3. Update types in `src/types/schema.ts` if needed
4. Style using Tailwind CSS classes

## 📖 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [PouchDB Documentation](https://pouchdb.com)
- [Recharts Documentation](https://recharts.org)

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code follows the existing style
- TypeScript types are properly defined
- ESLint checks pass
- Features are documented

## 📄 License

[Add your license information here]

## 🐛 Troubleshooting

### App won't load

- Clear browser cache and reload
- Check browser console for errors
- Ensure IndexedDB is enabled

### Data not persisting

- Check IndexedDB is accessible in browser DevTools
- Verify storage quota hasn't been exceeded
- Try clearing and re-adding data

### Build errors

- Run `npm install` to ensure dependencies are installed
- Clear `node_modules` and reinstall if issues persist
- Check TypeScript errors with `npm run build`

## 📞 Support

For issues or questions, please refer to the project repository or contact the development team.

---

**Mandazi Pro** - Making Mandazi business management simple and efficient! 🍪
