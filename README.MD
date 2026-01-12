# MyPlannerView

MyPlannerView is a lightweight task management web application built with Preact, Vite, and Tailwind CSS. It features a beautiful weekly for visualizing task timelines.

## Features

- ✅ **Task Management**: Create, edit, and delete tasks with full CRUD operations
- 📅 **Weekly Timeline View**: Visual Gantt chart showing tasks across the week
- 🎨 **Color-Coded Tasks**: Organize tasks by category with custom colors
- 💾 **IndexedDB Storage**: All data persists locally in your browser
- 🎯 **Priority Levels**: Set task priorities (Low, Medium, High, Urgent)
- 📊 **Status Tracking**: Track tasks through Backlog, To Do, In Progress, and Done

## Tech Stack

- **Framework**: Preact (lightweight React alternative)
- **Build Tool**: Vite (via Bun)
- **Styling**: Tailwind CSS
- **State Management**: Preact Signals
- **Storage**: IndexedDB
- **Date Handling**: Day.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kushalshit27/planner.git
cd planner
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Task

1. Click the "New Task" button in the top-right corner
2. Fill in the task details:
   - Title (required)
   - Description
   - Start and end dates
   - Priority level
   - Status
   - Category
   - Color for visual identification
3. Click "Create Task" to save

### Viewing Tasks

- **Sidebar**: All tasks are listed in the left sidebar with status badges
- **Timeline**: Tasks appear as colored bars on the weekly Gantt chart
- The timeline shows the current week with today highlighted

### Editing a Task

- Click on any task card in the sidebar or task bar in the timeline
- Modify the task details in the form
- Click "Save Changes"

### Navigating the Timeline

- Use the **Previous/Next** arrows to move between weeks
- Click **Today** to jump back to the current week
- Switch between views using the view mode selector (Daily/Weekly/Monthly/Timeline)

## Project Structure

```
planner/
├── src/
│   ├── components/
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Header, Sidebar, MainContent
│   │   ├── task/         # Task-related components
│   │   ├── timeline/     # Gantt chart components
│   │   └── views/        # View components (Weekly, etc.)
│   ├── hooks/            # Custom hooks
│   ├── store/            # Preact Signals stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── spec/                 # Project specifications
│   ├── SPEC.md          # Technical specification
│   └── task.md          # Implementation roadmap
└── package.json
```

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run Biome linter
- `bun run lint:fix` - Fix linting issues
- `bun run format` - Format code with Biome
- `bun run type-check` - Run TypeScript type checking

## Roadmap

See [task.md](./spec/task.md) for the complete implementation roadmap.

### Completed ✅
- Basic project setup with Preact + Vite + TypeScript
- IndexedDB integration for data persistence
- Task CRUD operations
- Weekly timeline/Gantt chart view
- Task bars with color coding
- Responsive layout

### In Progress 🚧
- Drag-and-drop task rescheduling
- Interactive dependency creation
- Task filtering and search

### Planned 📋
- Daily and Monthly views
- Dark mode support
- JSON export/import functionality
- Keyboard shortcuts
- Task dependencies visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](./LICENSE) for details

## Acknowledgments

- Built with modern web technologies