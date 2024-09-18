import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface CandlestickChartProps {
  data: Array<{
    time: number;
    open: string;
    high: string;
    low: string;
    close: string;
  }>;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [yAxisRange, setYAxisRange] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedData = data.map((d) => ({
        x: new Date(d.time).getTime(),
        y: [parseFloat(d.open), parseFloat(d.high), parseFloat(d.low), parseFloat(d.close)],
      }));
      setChartData(formattedData);

      const prices = data.flatMap((d) => [parseFloat(d.open), parseFloat(d.high), parseFloat(d.low), parseFloat(d.close)]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const padding = (maxPrice - minPrice) * 0.1;
      setYAxisRange([minPrice - padding, maxPrice + padding]);
    }
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: "candlestick",
      height: "100%",
      width: "100%",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      background: "#131722",
    },
    title: {
      text: "SOL/USDT",
      align: "left",
      style: {
        fontSize: "20px",
        color: "#E0E0E0",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#787B86",
          fontSize: "10px",
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
      axisBorder: {
        color: "#363C4E",
      },
      axisTicks: {
        color: "#363C4E",
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value) => value.toFixed(5),
        style: {
          colors: "#787B86",
          fontSize: "10px",
        },
      },
      min: yAxisRange[0],
      max: yAxisRange[1],
      tickAmount: 10,
      forceNiceScale: true,
      floating: false,
    },
    grid: {
      borderColor: "#363C4E",
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#26A69A",
          downward: "#EF5350",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: (value) => value.toFixed(5),
      },
      theme: "dark",
    },   
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ data: chartData }]}
      type="candlestick"
      height="100%"
      width="100%"
    />
  );
};

export default CandlestickChart;
