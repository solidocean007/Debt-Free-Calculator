import { useState, useEffect } from "react";
import "./Form.css";
import MinAlert from "./MinAlert";
import PaymentHistory from "./PaymentHistory";

function Form() {
  // State hooks
  const [inputs, setInputs] = useState({
    totalDebt: 0,
    interestRate: 0,
    makePayment: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);

  //Input functions
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userPayment = parseFloat(inputs.makePayment) || 0;

    // Retrieve principal and interestRate
    const { principal, interestRate } = getInputs();

    if (userPayment < calculateMinimumDue()) {
      setAlertMessage(
        "Please enter an amount equal to or greater than the minimum due."
      );
      setShowAlert(true);
    } else {
      processPayment(userPayment, principal, interestRate);
      updateMinimumDue(principal, interestRate);
    }
  };

  // Calculate functions
  const getInputs = () => {
    const userPayment = parseFloat(inputs.makePayment);
    const principal = parseFloat(inputs.totalDebt);
    const interestRate = parseFloat(inputs.interestRate) / 100;
    return { userPayment, principal, interestRate };
  };

  const calculateInterest = (principal, interestRate) => {
    return (principal * interestRate) / 12;
  };

  const calculateMinPrincipal = (debt) => {
    return (debt * 0.01).toFixed(2);
  };

  const calculateMinimumDue = () => {
    const { principal, interestRate } = getInputs();
    const minPrincipal = calculateMinPrincipal(principal);
    const interest = calculateInterest(principal, interestRate);
    const due =
      principal <= 100 ? principal * 1.01 : parseFloat(minPrincipal) + interest;
    return due;
  };

  const calculatePaymentsRemaining = () => {
    const { userPayment, principal, interestRate } = getInputs();

    if (userPayment <= 0) {
      return "N/A";
    }

    let remainingBalance = principal;
    let paymentsRemaining = 0;

    while (remainingBalance > 0) {
      const interest = calculateInterest(remainingBalance, interestRate);
      if (userPayment <= interest) {
        return "N/A";
      }
      const principalPayment = userPayment - interest;
      remainingBalance -= principalPayment;
      paymentsRemaining++;
    }

    return paymentsRemaining;
  };

  const calculateTotalPrincipalPaid = () => {
    return paymentHistory.reduce(
      (accumulator, payment) => accumulator + payment.principal,
      0
    );
  };

  const calculateTotalInterestPaid = () => {
    return paymentHistory.reduce(
      (accumulator, payment) => accumulator + payment.interest,
      0
    );
  };


// State functions
  const processPayment = (userPayment, principal, interestRate) => {
    const interest = calculateInterest(principal, interestRate);
    const principalPayment = userPayment - interest;
    const newBalance = principal - principalPayment;

    setInputs((values) => ({ ...values, totalDebt: newBalance }));
    setPaymentHistory([
      ...paymentHistory,
      {
        payment: userPayment,
        principal: principalPayment,
        interest: interest,
        remainingBalance: newBalance,
      },
    ]);

    const newDue = calculateMinimumDue();
    setInputs((values) => ({ ...values, due: newDue }));
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  // Retrieve total loan amount 
  const { principal } = getInputs();

  return (
    <div className="Form">
      <h1>Debt Free Calculator</h1>
      <form onSubmit={handleSubmit} action="">
        <div className="formInput">
          <div className="debtEntry">
            {/* Loan amount input */}
            <div className="entry">
              <label htmlFor="totalDebt">Loan amount</label>
              <br />
              <input
                className="numInput"
                name="totalDebt"
                type="number"
                step="0.01"
                id="totalDebt"
                onChange={handleChange}
              />
              <div>
                Current Loan Amount: $
                {parseFloat(inputs.totalDebt || 0).toFixed(2)}
              </div>
            </div>

            {/* Interest rate input */}
            <div className="entry">
              <label htmlFor="interestRate">Interest Rate</label>
              <br />
              <input
                className="numInput"
                name="interestRate"
                type="number"
                id="interestRate"
                value={inputs.interestRate || ""}
                onChange={handleChange}
              />
            </div>

            {/* Make a payment field */}
            <div className="entry">
              <label htmlFor="makePayment">Make a payment</label>
              <p>Minimum payment is: ${calculateMinimumDue().toFixed(2)}</p>

              <input
                className="numInput"
                name="makePayment"
                type="number"
                id="makePayment"
                value={inputs.makePayment || ""}
                placeholder={calculateMinimumDue().toFixed(2)}
                onChange={handleChange}
              />

              <input type="submit" />
            </div>
          </div>
        </div>

        {/* Loan details */}
        <div className="loanDetails">
          <h3>Monthly Payments</h3>
          <h1>${calculateMinimumDue().toFixed(2)}</h1>
          <div>
            <h4>
              Interest is: $
              {calculateInterest(
                parseFloat(inputs.totalDebt) || 0,
                parseFloat(inputs.interestRate) / 100 || 0
              ).toFixed(2)}{" "}
              per month.
            </h4>

            <h4>
              Minimum principal is: ${calculateMinPrincipal(principal)} per
              month.
            </h4>
          </div>
          <div>
            {paymentHistory.length > 0 && (
              <h4>
                Total Principal Paid: $
                {calculateTotalPrincipalPaid().toFixed(2)}
              </h4>
            )}
            {paymentHistory.length > 0 && (
              <h4>
                Total Interest Paid: ${calculateTotalInterestPaid().toFixed(2)}
              </h4>
            )}
          </div>
        </div>
      </form>

      {paymentHistory.length > 0 && (
        <PaymentHistory
          paymentHistory={paymentHistory}
          calculatePaymentsRemaining={calculatePaymentsRemaining}
        />
      )}

      <MinAlert
        showAlert={showAlert}
        closeAlert={closeAlert}
        message={alertMessage}
      />
    </div>
  );
}

export default Form;
