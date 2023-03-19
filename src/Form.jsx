import { useState, useEffect } from "react";
import "./Form.css";
import MinAlert from "./MinAlert";
import PaymentHistory from "./PaymentHistory";

function Form() {
  const [inputs, setInputs] = useState({
    totalDebt: 0,
    interestRate: 0,
    makePayment: 0,
    due: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);

  //Retrieve principal and interest rate
  const getPrincipalAndInterestRate = () => {
    const principal = parseFloat(inputs.totalDebt);
    const interestRate = parseFloat(inputs.interestRate) / 100;
    return { principal, interestRate};
  }

  useEffect(() => {
    const { principal, interestRate } = getPrincipalAndInterestRate();
    updateMinimumDue(principal, interestRate);
  }, [inputs.totalDebt, inputs.interestRate]);

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const calculateInterest = (principal, interestRate) => {
    return (principal * interestRate) / 12;
  };

  const calculateMinPrincipal = (debt) => {
    return (debt * 0.01).toFixed(2);
  };

  // Calculate the minimum due and add or update that value to state for tracking
  const updateMinimumDue = (principal, interestRate) => {
    const minPrincipal = calculateMinPrincipal(principal);
    const interest = calculateInterest(principal, interestRate);
    const due =
      principal <= 100 ? principal * 1.01 : parseFloat(minPrincipal) + interest;
    setInputs((values) => ({ ...values, due }));
  };

  //
  const processPayment = (userPayment, principal, interestRate) => {

    const interest = calculateInterest(principal, interestRate);
    const principalPayment = userPayment - interest;
    const newBalance = principal - principalPayment;

    setInputs((values) => ({ ...values, totalDebt: newBalance }));
    setPaymentHistory([
      ...paymentHistory,
      {
        principal: principalPayment,
        interest: interest,
        remainingBalance: newBalance,
      },
    ]);
    updateMinimumDue();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userPayment = parseFloat(inputs.makePayment) || 0;

    // Retrieve principal and interestRate
    const { principal, interestRate } = getPrincipalAndInterestRate();

    if (userPayment < inputs.due) {
      setAlertMessage(
        "Please enter an amount equal to or greater than the minimum due."
      );
      setShowAlert(true);
    } else {
      processPayment(userPayment, principal, interestRate);
    }
  };

  

  // Calculate payments remaining
  const calculatePaymentsRemaining = () => {
    const principal = parseFloat(inputs.totalDebt) || 0;
    const userPayment = parseFloat(inputs.makePayment) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
  
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

  const principal = parseFloat(inputs.totalDebt) || 0;
  const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
  const interest = calculateInterest(principal, interestRate);

  return (
    <div className="Form">
      <h1>Debt Free Calculator</h1>
      <form onSubmit={handleSubmit} action="">
        <div className="formInput">
          <div className="debtEntry">

            {/* Loan amount input */}
            <label htmlFor="totalDebt">Loan amount</label>
            <br />
            <input
              className="numInput"
              name="totalDebt"
              type="number"
              value={inputs.totalDebt || ''}
              id="totalDebt"
              onChange={ handleChange }
            />

            <br />
            <span>
              Current Loan Amount: $
              {parseFloat(inputs.totalDebt || 0).toFixed(2)}
            </span>
            <br />

            {/* Interest rate input */}
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
            <br />

            {/* Make a payment field */}
            <label htmlFor="makePayment">Make a payment</label>
            <p>Minimum payment is: ${inputs.due}</p>
            <br />
            <input
              className="numInput"
              name="makePayment"
              type="number"
              id="makePayment"
              value={inputs.makePayment || ''}
              placeholder={inputs.due}
              onChange={handleChange}
            />
            <br />

            <input type="submit" />
          </div>
        </div>

        {/* Loan details */}
        <div className="loanDetails">
          <h3>Monthly Payments</h3>
          <h1>${inputs.due}</h1>
          <div>
            <h4>Interest is: ${interest.toFixed(2)} per month.</h4>
            <h4>Minimum principal is: ${calculateMinPrincipal(principal)} per month.</h4>
          </div>
          <div>
            {paymentHistory.length > 0 && (
              <h4>Total Principal Paid ${calculateMinPrincipal(principal)} per month.</h4>
            )}
            {paymentHistory.length > 0 && (
              <h4>
                Total Interest Paid ${calculateInterest(interest)} per month.
              </h4>
            )}
          </div>
        </div>
      </form>

      <div className="paymentBlock">
        <h3>{calculatePaymentsRemaining()} more payments to be debt free.</h3>
        {console.log(calculatePaymentsRemaining + ' :cpr')}
      </div>

      <PaymentHistory paymentHistory={paymentHistory} />

      <MinAlert
        showAlert={showAlert}
        closeAlert={closeAlert}
        message={alertMessage}
      />
    </div>
  );
}

export default Form;
