import { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaRobot, FaUserCircle } from "react-icons/fa";
import { HiOutlineSun, HiMoon } from "react-icons/hi";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { user: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBtEzTwu_ThMYeWhpyUd2haI_O14rpiDKA",
        {
          prompt: input,
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      );

      const botReply = response.data?.content || "Sorry, I couldn't get a response.";

      setMessages([...newMessages, { bot: botReply, timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      console.error("Error during API call:", error);
      setMessages([...newMessages, { bot: "Error, please try again.", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"} min-h-screen flex flex-col justify-center items-center transition duration-500`}>
      <motion.div
        className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-indigo-900 dark:text-indigo-300">
            AI Chat with Gemini
          </h1>
          <button
            onClick={toggleTheme}
            className="p-3 text-xl rounded-full focus:outline-none"
          >
            {isDarkMode ? (
              <HiOutlineSun className="text-yellow-500" />
            ) : (
              <HiMoon className="text-gray-500" />
            )}
          </button>
        </div>

        <div className="flex flex-col space-y-4 h-96 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.user ? "justify-end" : "justify-start"}`}>
              <motion.div
                className={`max-w-xs p-4 rounded-xl ${message.user ? "bg-indigo-500 text-white" : "bg-gray-700 text-white"}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  {message.user ? (
                    <FaUserCircle className="text-indigo-400" size={24} />
                  ) : (
                    <FaRobot className="text-indigo-200" size={24} />
                  )}
                  <p>{message.user ? "You: " + message.user : "Bot: " + message.bot}</p>
                </div>
                {message.timestamp && (
                  <span className="text-sm text-gray-400 mt-1">{message.timestamp}</span>
                )}
              </motion.div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <motion.div
                className="max-w-xs p-3 bg-gray-300 text-black rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p>Bot is typing...</p>
              </motion.div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 transition duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
          >
            <FiSend size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
