import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});
  const [openMonth, setOpenMonth] = useState(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`https://expensebackend-production.up.railway.app/api/transactions?email=${email}`);
        setTransactions(res.data);
        calculateStats(res.data);

        const monthlyRes = await axios.get(`http://localhost:5000/api/transactions/summary/monthly?email=${email}`);
        setMonthlyData(monthlyRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [email]);

  const calculateStats = (data) => {
    let totalIncome = 0;
    let totalExpense = 0;
    const currentMonth = new Date().getMonth();

    data.forEach((item) => {
      const itemMonth = new Date(item.date).getMonth();
      if (itemMonth === currentMonth) {
        if (item.type === "income") totalIncome += item.amount;
        else totalExpense += item.amount;
      }
    });

    setIncome(totalIncome);
    setExpenses(totalExpense);
    setBalance(totalIncome - totalExpense);
  };

  const pieData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const currentMonthTransactions = transactions.filter(t => {
    const txnMonth = new Date(t.date).toLocaleString('default', { month: 'long' });
    return txnMonth === currentMonth;
  });

  const barData = currentMonthTransactions.map((t) => ({
    name: t.name,
    amount: t.amount,
  }));

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white pt-24">
      <motion.h2 
        className="text-3xl font-bold text-center mb-6 text-blue-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold text-green-400">Total Income</h3>
          <p className="text-2xl font-bold">${income}</p>
        </motion.div>

        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold text-red-400">Total Expenses</h3>
          <p className="text-2xl font-bold">${expenses}</p>
        </motion.div>

        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold text-blue-400">Balance</h3>
          <p className="text-2xl font-bold">${balance}</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses ({currentMonth})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Transaction Overview ({currentMonth})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="amount" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions ({currentMonth})</h3>
        <div className="overflow-auto max-h-60">
          {currentMonthTransactions.map((t) => (
            <div key={t._id} className="flex justify-between border-b border-gray-600 py-2">
              <span>{t.name}</span>
              <span className={t.type === "income" ? "text-green-400" : "text-red-400"}>${t.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-lg font-semibold mb-4">Monthly Transactions Summary</h3>
        {Object.entries(monthlyData).map(([month, data]) => (
          <div key={month} className="mb-6">
            <button
              onClick={() => setOpenMonth(openMonth === month ? null : month)}
              className="w-full text-left text-2xl font-bold text-blue-300 mb-2"
            >
              {month}
            </button>
            <AnimatePresence>
              {openMonth === month && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-400">Income: ${data.income}</p>
                      <p className="text-red-400">Expenses: ${data.expense}</p>
                      <div className="overflow-auto max-h-60 mt-4">
                        {data.transactions.map((txn) => (
                          <div key={txn._id} className="flex justify-between border-b border-gray-600 py-2">
                            <span>{txn.name}</span>
                            <span className={txn.type === "income" ? "text-green-400" : "text-red-400"}>${txn.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie data={[{ name: "Income", value: data.income }, { name: "Expenses", value: data.expense }]} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                              <Cell fill="#4CAF50" />
                              <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={[{ name: 'Income', value: data.income }, { name: 'Expenses', value: data.expense }]}> 
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3498db" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
