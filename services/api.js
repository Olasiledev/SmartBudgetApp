// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8005/api",
});

const AI_API = axios.create({
    baseURL: "http://127.0.0.1:5000",
    // baseURL: "https://smart-budget-ai.onrender.com",
    
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
    console.log("Raw Transactions Before Processing:", JSON.stringify(transactions, null, 2));

    const payload = {
      transactions: transactions.map(tx => {
        let transactionDetails = "";
        if (tx.transactionType === "Bill Payment") {
          transactionDetails = tx.billerName ? tx.billerName.trim() : "Bill Payment";
        } else if (tx.transactionType === "Transfer") {
          transactionDetails = tx.transactionNote 
            ? `Transfer (${tx.transactionNote.trim()})` 
            : "Transfer";
        } else {
          transactionDetails = tx.merchantName 
            ? tx.merchantName.trim() 
            : (tx.transactionType ? tx.transactionType.trim() : "General Purchase");
        }

        let date;
        if (typeof tx.timestamp === "object" && tx.timestamp._seconds) {
          date = new Date(tx.timestamp._seconds * 1000).toISOString();
        } else {
          date = new Date(tx.timestamp).toISOString();
        }

        let category = "";
        if (tx.transactionType === "Bill Payment") {
          category = tx.billerType ? tx.billerType.trim() : "Bill Payment";
        } else if (tx.transactionType === "Transfer") {
          category = tx.transactionNote 
            ? tx.transactionNote.trim() 
            : "Transfer";
        } else {
          category = tx.category 
            ? tx.category.trim() 
            : (tx.transactionType ? tx.transactionType.trim() : "General");
        }

        return {
          transaction_details: transactionDetails,
          date: date,
          withdrawal_amt: tx.amount || 0,
          deposit_amt: 0.0,
          category: category
        };
      })
    };

    console.log("Sending to AI for categorization:", JSON.stringify(payload, null, 2));

    const response = await AI_API.post("/expense/predict", payload);
    console.log("AI Response Categorization:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error categorizing expenses:", error.response?.data || error.message);
    throw error;
  }
};





//Savings 
export const getSavingsAdvice = async (transactions) => {
  try {
    const payload = {
      transactions: transactions.map((tx) => ({
        date: typeof tx.timestamp === "object"
          ? new Date(tx.timestamp._seconds * 1000).toISOString()
          : new Date(tx.timestamp).toISOString(),

        category: tx.billerName || tx.billerType || tx.transactionType || "Unknown",

        amount: tx.amount,
      })),
    };

    const response = await AI_API.post("/savings/predict", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting savings advice:", error.response?.data || error.message);
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
  
      console.log('Sending to AI for budget advice:', JSON.stringify(payload, null, 2));
  
      const response = await AI_API.post('/budget/forecast', payload);
  
      console.log('AI Budget Advice Response:', response.data);
  
      return response.data;
    } catch (error) {
      console.error('Error fetching budget advice:', error.response?.data || error.message);
      throw error;
    }
  };


  //CHAT FEATURES 
  //chat response for budget advice
// services/api.js
export const getBudgetChatResponse = async (query, transactions, forecast) => {
  try {
    const payload = {
      query,
      transactions: transactions.map((tx) => ({
        date:
          typeof tx.timestamp === "object"
            ? new Date(tx.timestamp._seconds * 1000).toISOString()
            : new Date(tx.timestamp).toISOString(),
        category: tx.transactionType || "Unknown",
        amount: tx.amount || 0,
      })),
      forecast: forecast || [],
    };

    console.log("Sending budget chat query:", JSON.stringify(payload, null, 2));

    const response = await AI_API.post("/budget/chat", payload);
    
    return response.data.response;
  } catch (error) {
    console.error("Error fetching AI budget chat response:", error.message);
    return "Sorry, I couldn't process your request.";
  }
};

  
  
  
  
  //chat response for savings advice
  export const getSavingsChatResponse = async (query, uid) => {
    try {
        if (!uid) throw new Error("User ID is required.");

        console.log("Fetching transactions for UID:", uid);
        const transactions = await getUserTransactions(uid);
        const savingsData = await getSavingsAdvice(transactions);

        console.log("Sending savings chat query:", { query, transactions, predicted_savings: savingsData?.predicted_percentage_of_total || 0.2 });

        const response = await AI_API.post("/savings/chat", {
            query,
            transactions: transactions || [],
            predicted_savings: savingsData?.predicted_percentage_of_total || 0.2, 
        });

        return response.data.response;
    } catch (error) {
        console.error("Error fetching AI savings chat response:", error.response?.data || error.message);
        return "Sorry, I couldn't process your request.";
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
  