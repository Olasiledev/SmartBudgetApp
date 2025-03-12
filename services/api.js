// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8005/api",
});

const AI_API = axios.create({
    baseURL: "http://127.0.0.1:5000",
    });

export const getUserTransactions = async (uid) => {
  try {
    console.log("Sending UID in header:", uid);

    const response = await API.get("/transaction/transactions", {
      headers: {
        "user-id": uid,
      },
    });

    console.log("Transaction response:", response.data);

    return response.data || [];
    
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    throw error;
  }
};


//Expense 
export const categorizeExpenses = async (transactions) => {
  try {
    const payload = {
      transactions: transactions.map((tx) => ({
        transaction_details: `${tx.transactionType || 'General'} - ${tx.billerName || tx.merchantName || tx.billerType || 'Unknown'}`,
        date:
          typeof tx.timestamp === 'object'
            ? new Date(tx.timestamp._seconds * 1000).toISOString()
            : new Date(tx.timestamp).toISOString(),
        withdrawal_amt: tx.amount,
        deposit_amt: 0.0,
        category: tx.transactionType || 'General',
      })),
    };

    console.log('Sending to AI for categorization:', JSON.stringify(payload, null, 2));

    const response = await AI_API.post('/expense/predict', payload);
    let categorizedExpenses = response.data.predictions || [];

    categorizedExpenses = categorizedExpenses.map((expense, index) => {
      if (transactions[index].transactionType === "Transfer") {
        return { ...expense, predicted_category: "Transfer" };
      }
      return expense;
    });

    console.log('AI Categorized Expenses (Final):', categorizedExpenses);
    return { predictions: categorizedExpenses };

  } catch (error) {
    console.error('Error categorizing expenses:', error.response?.data || error.message);
    throw error;
  }
};


//Savings 
export const getSavingsAdvice = async (transactions) => {
    try {
      const payload = {
        transactions: transactions.map((tx) => ({
          date: typeof tx.timestamp === 'object'
            ? new Date(tx.timestamp._seconds * 1000).toISOString()
            : new Date(tx.timestamp).toISOString(),
          category: tx.transactionType || 'Unknown',
          amount: tx.amount,
        })),
      };
  
      console.log('Sending to AI for savings advice:', JSON.stringify(payload, null, 2));
  
      const response = await AI_API.post('/savings/predict', payload);
  
      console.log('AI Savings Advice Response:', response.data);
  
      return response.data;
    } catch (error) {
      console.error(
        'Error getting savings advice:',
        error.response?.data || error.message
      );
      throw error;
    }
  };
  

  //Budget
  export const getBudgetAdvice = async (transactions, periods = 5) => {
    try {
      const payload = {
        transactions: transactions.map((tx) => ({
          "Account No": tx.accountNumber || "N/A",
          "Date": typeof tx.timestamp === 'object'
            ? new Date(tx.timestamp._seconds * 1000).toISOString()
            : new Date(tx.timestamp).toISOString(),
          "Transaction Details": tx.transactionNote || tx.merchantName || "No description",
          "Withdrawal Amt": tx.amount || 0,
          "Deposit Amt": 0,
          "Category": tx.aiPredictedCategory || tx.transactionType || "Unknown",
        })),
        periods,
      };
  
      console.log('🔼 Sending to AI for budget advice:', JSON.stringify(payload, null, 2));
  
      const response = await AI_API.post('/budget/forecast', payload);
  
      console.log('AI Budget Advice Response:', response.data);
  
      return response.data;
    } catch (error) {
      console.error('Error fetching budget advice:', error.response?.data || error.message);
      throw error;
    }
  };
  

  //Transfer
  export const transferFunds = async (senderId, receiverEmail, amount, currency, paymentMethod, note, senderIp, receiverIp) => {
    try {
      const response = await API.post("/transfer/transfer", {
        senderId,
        receiverEmail,
        amount,
        currency,
        paymentMethod,
        note,
        senderIp,
        receiverIp,
      });
  
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };


  //MAKE BILL PAYMENT 
  export const payBill = async (billData) => {
    try {
      const response = await API.post("/billPayment/payBill", billData);
      return response.data;
    } catch (error) {
      console.error("Error processing bill payment:", error.response?.data || error.message);
      throw error;
    }
  };
  