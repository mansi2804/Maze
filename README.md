# 🎮 Maze Puzzle Game

A modern, responsive maze puzzle game built with React and Tailwind CSS. Navigate through procedurally generated mazes with different difficulty levels, track your progress with a timer and step counter, and enjoy smooth animations and sound effects.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)


## 🌟 Features 

- 🏁 Procedurally generated mazes with different difficulty levels
- 🎮 Intuitive controls (keyboard or touch)
- ⏱️ Built-in timer and step counter
- 🎨 Modern, responsive UI with smooth animations
- 🔊 Sound effects for better game feel
- 📱 Mobile-first design with touch controls
- 🎯 Win screen with game statistics

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/maze-game.git
   cd maze-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🎮 How to Play

- Use the arrow keys or WASD to move the player
- On mobile, use the on-screen controls or swipe gestures
- Navigate from the start (purple) to the end (green)
- Try to complete the maze in the fewest steps and shortest time
- Change the difficulty level to make the game easier or harder

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── maze/            # Maze-related components
│   ├── ui/              # General UI components
│   └── Game.js          # Main game component
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
│   ├── mazeGenerator.js # Maze generation logic
│   └── sounds.js        # Sound effects
├── App.js               # Main app component
└── index.js             # Entry point
```

## 🛠️ Technologies Used

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Howler.js](https://howlerjs.com/) - Audio library for the web
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [React Icons](https://react-icons.github.io/react-icons/) - Popular icons for React

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This will create a `build` folder with the production-ready files.

### Deploying to Netlify

1. Push your code to a GitHub repository
2. Sign up/Log in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Set the build command to `npm run build`
6. Set the publish directory to `build`
7. Click "Deploy site"

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Maze generation algorithm inspired by various maze generation techniques
- Sound effects from [Mixkit](https://mixkit.co/)
- Built with [Create React App](https://create-react-app.dev/)
