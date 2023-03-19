import React from "react";
import './PaymentHistory.css';

const PaymentHistory = ({paymentHistory}) => {
  return (
    <div className="paymentHistory">
    <h2>Payment History</h2>
    <table>
      <thead>
        <tr>
          <th>Payment</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Remaining Balance</th>
        </tr>
      </thead>
      <tbody>
        {paymentHistory.map((payment, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>${payment.principal.toFixed(2)}</td>
            <td>${payment.interest.toFixed(2)}</td>
            <td>${payment.remainingBalance.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
  
};

PaymentHistory.defaultProps = {
  paymentHistory: [],
}


export default PaymentHistory;