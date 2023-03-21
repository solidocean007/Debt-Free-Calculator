import React from "react";
import "./PaymentHistory.css";

const PaymentHistory = ({ paymentHistory, calculatePaymentsRemaining }) => {
  return (
    <>
      <div className="paymentBlock">
        <h3>{calculatePaymentsRemaining()} more payments to be debt free.</h3>
      </div>
      <div className="paymentHistory">
        <h2>Payment History</h2>
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
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
                <td>${payment.payment.toFixed(2)}</td>
                <td>${payment.principal.toFixed(2)}</td>
                <td>${payment.interest.toFixed(2)}</td>
                <td>${payment.remainingBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

PaymentHistory.defaultProps = {
  paymentHistory: [],
};

export default PaymentHistory;
