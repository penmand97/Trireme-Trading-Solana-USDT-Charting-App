import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import CandlestickChart from "./components/CandlestickChart";
import OrderBook from "./components/OrderBook";

interface AppState {
  candlestickData: Array<{
    time: number;
    open: string;
    high: string;
    low: string;
    close: string;
  }>;
  orderBookData: any;
  error: string | null;
}

const timeframes = ["1m", "15m", "1h", "1d", "1w"];

function App() {
  const [state, setState] = useState<AppState>({
    candlestickData: [],
    orderBookData: null,
    error: null,
  });
  const [timeframe, setTimeframe] = useState("1h");
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setState((prev) => ({ ...prev, error: null }));
      ws.send(JSON.stringify({ type: "setTimeframe", timeframe }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        candlestickData: data.candlestick,
        orderBookData: data.orderBook,
        error: null,
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setState((prev) => ({
        ...prev,
        error:
          "WebSocket error occurred. Please check if the server is running.",
      }));
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected. Attempting to reconnect...");
      setState((prev) => ({
        ...prev,
        error: "WebSocket disconnected. Attempting to reconnect...",
      }));
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "setTimeframe", timeframe: newTimeframe })
      );
    }
  };

  return (
    <div className="App">
      <h1>SOL/USDT Trading Dashboard</h1>
      {state.error && <div className="error">{state.error}</div>}
      <div className="timeframe-selector">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => handleTimeframeChange(tf)}
            className={timeframe === tf ? "active" : ""}
          >
            {tf}
          </button>
        ))}
      </div>
      <div className="dashboard">
        <div className="candlestick-chart">
          <CandlestickChart data={state.candlestickData} />
        </div>
        <OrderBook data={state.orderBookData} />
      </div>
    </div>
  );
}

export default App;
