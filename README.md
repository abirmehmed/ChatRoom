# Modern Chat Room Application

A feature-rich, real-time chat application built with React, TypeScript, and Tailwind CSS. This application provides a beautiful, intuitive interface for group conversations with productivity tools integration.

![Chat Room Preview](https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=2000&auto=format&fit=crop)

## Features

### Chat Functionality
- Multiple chat groups with drag-and-drop reordering
- Real-time messaging with text and image support
- Message editing and deletion
- User avatars and customizable message colors
- Emoji picker integration
- Message timestamps and date separators

### Productivity Tools
- Multi-timer with customizable durations
- Task manager with priority levels
- Weekly schedule planner
- Daily tasks and weekly targets tracking

### User Management
- Custom user avatars
- User presence indicators
- Group member management
- Personalized message colors

### UI/UX
- Dark theme optimized for extended use
- Responsive design
- Drag-and-drop interface
- Intuitive navigation
- Real-time updates

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks and Local Storage
- **Icons**: Lucide React
- **Drag and Drop**: @dnd-kit
- **Development**: Vite
- **Package Manager**: npm

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Guide

### Creating a Chat Group
1. Click the "Add Group" button
2. Enter a group name
3. Optionally update the group avatar

### Managing Users
1. Select a group
2. Click "Add Member" in the sidebar
3. Enter member name
4. Customize user avatar and message color

### Sending Messages
1. Select a group and user
2. Type your message in the input field
3. Use emoji picker or attach images
4. Press Enter or click Send

### Using Productivity Tools
- **Timer**: Click the clock icon to set countdown timers
- **Tasks**: Manage daily tasks and weekly targets
- **Schedule**: Plan your week with the calendar view

## Project Structure

```
src/
├── components/         # React components
├── types/             # TypeScript interfaces
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## Key Components

- `ChatRoom`: Main chat interface
- `ChatGroupList`: Group management
- `UserList`: User management
- `ProductivityTools`: Timer and task management
- `MultiTimer`: Countdown timer
- `TaskManager`: Task tracking
- `WeeklySchedule`: Calendar planning

## Local Storage

The application uses browser local storage to persist:
- Chat messages
- User preferences
- Group configurations
- Tasks and schedules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using modern web technologies