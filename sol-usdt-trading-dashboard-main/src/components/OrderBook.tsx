import React from 'react';

interface OrderBookProps {
  data: {
    bids: Array<{ price: string; amount: string }>;
    asks: Array<{ price: string; amount: string }>;
  } | null;
}

const OrderBook: React.FC<OrderBookProps> = ({ data }) => {
  if (!data) return <div className="order-book">Loading...</div>;

  const renderOrders = (orders: Array<{ price: string; amount: string }>, type: 'bid' | 'ask') => (
    <table className={type === 'bid' ? 'bids' : 'asks'}>
      <thead>
        <tr>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={`${type}-${index}`}>
            <td className={`price ${type}`}>{parseFloat(order.price).toFixed(5)}</td>
            <td>{parseFloat(order.amount).toFixed(5)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="order-book">
      <h2>Order Book</h2>
      <div className="order-book-tables">
        {renderOrders(data.bids, 'bid')}
        {renderOrders(data.asks, 'ask')}
      </div>
    </div>
  );
};

export default OrderBook;