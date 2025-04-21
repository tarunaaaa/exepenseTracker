import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";

const Dashboard = () => {
  

    // Fetch transactions
    const [transactions, setTransactions] = useState([]);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [balance, setBalance] = useState(0);
    const [name, setName] = useState("");
    const email = localStorage.getItem("email"); // Retrieve email from localStorage

    // Fetch transactions for the logged-in user
    useEffect(() => {
        if (!email) return; // Prevent API call if email is missing

        const fetchData = async () => {
            try {
                const res = await axios.get(`https://expensebackend-production.up.railway.app/api/transactions?email=${email}`);
                setTransactions(res.data);
                calculateStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [email]);

    // Function to add a transaction
    const addTransaction = async (name, amount, type) => {
        if (!email) {
            alert("User email not found. Please log in again.");
            return;
        }

        try {
            const res = await axios.post(" https://expensebackend-production.up.railway.app/api/transactions", {
                name,
                amount,
                type,
                email,  // Include email in the request
            });

            setTransactions([...transactions, res.data.transaction]);
            calculateStats([...transactions, res.data.transaction]);
        } catch (err) {
            console.error(err);
        }
    };


    // Calculate financial stats
    const calculateStats = (data) => {
        let totalIncome = 0;
        let totalExpense = 0;
        data.forEach((item) => {
            if (item.type === "income") totalIncome += item.amount;
            else totalExpense += item.amount;
        });
        setIncome(totalIncome);
        setExpenses(totalExpense);
        setBalance(totalIncome - totalExpense);
    };

    // Chart Data
    const pieData = [
        { name: "Income", value: income },
        { name: "Expenses", value: expenses },
    ];

    const barData = transactions.map((t) => ({
        name: t.name,
        amount: t.amount,
    }));

    // Colors for Pie Chart
    const COLORS = ["#4CAF50", "#F44336"];

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white pt-24">
            <motion.h2 
                className="text-3xl font-bold text-center mb-6 text-blue-400"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Welcome, {name || "User"}! 🚀
            </motion.h2>

            {/* Stats Section */}
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

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Pie Chart */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
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

                {/* Bar Chart */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Transaction Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#3498db" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="overflow-auto max-h-60">
                    {transactions.map((t) => (
                        <div key={t._id} className="flex justify-between border-b border-gray-600 py-2">
                            <span>{t.name}</span>
                            <span className={t.type === "income" ? "text-green-400" : "text-red-400"}>
                                ${t.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
