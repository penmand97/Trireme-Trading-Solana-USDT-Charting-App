# SOL/USDT Trading Dashboard

This project is a full-stack application that displays a live candlestick chart and order book for the SOL/USDT trading pair. It uses React with TypeScript for the frontend and Node.js with Express for the backend.

## API Usage

This project uses the Binance public API to fetch real-time data for the SOL/USDT trading pair. The API is accessed through the backend server, which then relays the data to the frontend via WebSocket connections.

### Binance API Endpoints Used:

1. Candlestick Data: `https://api.binance.com/api/v3/klines`
   - Used to fetch candlestick data for different timeframes.
   - Parameters: 
     - `symbol`: SOLUSDT
     - `interval`: Varies based on selected timeframe (1m, 15m, 1h, 1d, 1w)
     - `limit`: 100 (fetches the last 100 candlesticks)

2. Order Book Data: `https://api.binance.com/api/v3/depth`
   - Used to fetch the current order book.
   - Parameters:
     - `symbol`: SOLUSDT
     - `limit`: 20 (fetches the top 20 bids and asks)

The backend server fetches data from these endpoints every 5 seconds and sends updates to connected clients via WebSocket.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/sol-usdt-trading-dashboard.git
   cd sol-usdt-trading-dashboard
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd server
   npm install
   cd ..
   ```

## Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```
   This will start the server on http://localhost:3001

2. In a new terminal, start the frontend development server:
   ```
   npm run dev
   ```
   This will start the frontend on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173 to view the application.

## Features

- Live candlestick chart for SOL/USDT trading pair
- Real-time order book display
- WebSocket connection for live data updates
- Multiple timeframe options (1m, 15m, 1h, 1d, 1w)

## Project Structure

- `src/`: Frontend React application
  - `components/`: React components
  - `App.tsx`: Main application component
  - `App.css`: Main application styles
- `server/`: Backend Node.js server
  - `src/server.ts`: Express server, WebSocket setup, and Binance API integration

## Development

- Frontend: The application uses Vite for fast development. You can modify the React components in the `src/` directory.
- Backend: The server code is in `server/src/server.ts`. It uses `nodemon` for auto-reloading during development.

## Building for Production

1. Build the frontend:
   ```
   npm run build
   ```

2. Build the backend:
   ```
   cd server
   npm run build
   ```

3. To run the production version:
   ```
   cd server
   npm start
   ```
   Then serve the `dist/` directory from the root folder using a static file server.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Disclaimer

This application is for educational purposes only. It is not financial advice, and should not be used for actual trading. Always do your own research before making any investment decisions.
