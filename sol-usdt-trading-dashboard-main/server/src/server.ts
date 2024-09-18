import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import axios from 'axios';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

interface Candle {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface OrderBookEntry {
  price: string;
  amount: string;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

const fetchCandlestickData = async (timeframe: string): Promise<Candle[]> => {
  const interval = getTimeframeInterval(timeframe);
  const response = await axios.get(`${BINANCE_API_BASE}/klines`, {
    params: {
      symbol: 'SOLUSDT',
      interval: interval,
      limit: 100
    }
  });

  return response.data.map((candle: any) => ({
    time: candle[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4]
  }));
};

const fetchOrderBookData = async (): Promise<OrderBook> => {
  const response = await axios.get(`${BINANCE_API_BASE}/depth`, {
    params: {
      symbol: 'SOLUSDT',
      limit: 20
    }
  });

  return {
    bids: response.data.bids.map((bid: string[]) => ({ price: bid[0], amount: bid[1] })),
    asks: response.data.asks.map((ask: string[]) => ({ price: ask[0], amount: ask[1] }))
  };
};

const getTimeframeInterval = (timeframe: string): string => {
  switch (timeframe) {
    case '1m': return '1m';
    case '15m': return '15m';
    case '1h': return '1h';
    case '1d': return '1d';
    case '1w': return '1w';
    default: return '1m';
  }
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  let timeframe = '1h';
  let interval: NodeJS.Timeout;

  const sendData = async () => {
    try {
      const [candlestickData, orderBookData] = await Promise.all([
        fetchCandlestickData(timeframe),
        fetchOrderBookData()
      ]);

      ws.send(JSON.stringify({ candlestick: candlestickData, orderBook: orderBookData }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  ws.on('message', async (message: string) => {
    const data = JSON.parse(message);
    if (data.type === 'setTimeframe') {
      timeframe = data.timeframe;
      clearInterval(interval);
      await sendData(); // Send initial data for the new timeframe
      interval = setInterval(sendData, 5000); // Update every 5 seconds
    }
  });

  // Send initial data
  sendData();

  // Set up interval for sending updates
  interval = setInterval(sendData, 5000); // Update every 5 seconds

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});