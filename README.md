# Task Manager

A modern task management application built with Next.js and TypeScript. This application provides a comprehensive solution for managing tasks with authentication, task creation, editing, and tracking capabilities.

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, view, edit, and manage tasks efficiently
- **Task Details**: Comprehensive task information including:
  - Title and description
  - Status tracking
  - Start and end dates
  - User assignment
  - Jira integration links
  - Pull request links
- **Responsive Design**: Modern UI built with React components
- **Real-time Updates**: Dynamic task list updates after modifications

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: Custom auth system
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
task-manager/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   │   ├── AuthForm.tsx    # Authentication form
│   │   ├── TaskCard.tsx    # Task display card
│   │   ├── TaskForm.tsx    # Task creation/editing form
│   │   └── ...             # Other components
│   ├── types/              # TypeScript type definitions
│   │   └── task.ts         # Task-related types
│   ├── globals.css         # Global styles
│   └── ...                 # Other app files
├── public/                 # Static assets
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```

## Key Components

### AuthForm
Handles user authentication including login and registration functionality.

### TaskCard
Displays individual task information in a card format with action buttons.

### TaskForm
Comprehensive form for creating new tasks and editing existing ones with validation and error handling.

### TaskModal
Modal component for viewing detailed task information and editing tasks in-place.

## API Endpoints

The application integrates with a backend API for task management operations:

- `POST /tasks` - Create new tasks
- `PUT /tasks/{task_id}` - Update existing tasks
- `GET /tasks` - Retrieve task list
- Authentication endpoints for user management

## Development

### Adding New Features

1. Create new components in the `app/components/` directory
2. Define TypeScript types in `app/types/`
3. Follow the existing component patterns and styling conventions
4. Test thoroughly across different screen sizes

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling and loading states
- Write descriptive component and function names

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
