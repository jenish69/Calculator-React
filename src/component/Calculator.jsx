import React, { useEffect, useState } from "react";
import "./Calculator.css";
import { BiHistory } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { FaLongArrowAltLeft } from "react-icons/fa";

function Calculator() {
  const [input, setInput] = useState("0");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleClick = (value) => {
    const operators = "+-*/.";

    // Prevent multiple leading zeros like "00"
    if (input === "0" && value === "0") return;

    // If input is "0"
    if (input === "0") {
      if (value === ".") {
        setInput("0.");
      } else if (operators.includes(value)) {
        setInput("0" + value);
      } else {
        setInput(value);
      }
      return;
    }

    const lastChar = input.slice(-1);

    // Prevent multiple dots in a number segment
    if (value === ".") {
      const parts = input.split(/[\+\-\*\/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
    }

    // Replace last operator with the new one if two in a row
    if (operators.includes(lastChar) && operators.includes(value) && value !== ".") {
      setInput((prev) => prev.slice(0, -1) + value);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleClear = () => {
    setInput("0");
    setHistory([]);
  };

  const handleBackspace = () => {
    setInput((prev) => {
      const updated = prev.slice(0, -1);
      return updated === "" ? "0" : updated;
    });
  };

  const handleEqual = () => {
    try {
      const result = eval(input).toString();
      setHistory((prev) => [...prev, `${input} = ${result}`]);
      setInput(result);
    } catch {
      setInput("Error");
    }
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    
    if ("0123456789+-*/.".includes(key)) {
      e.preventDefault();
      handleClick(key);
    } else if (key === "Enter") {
      e.preventDefault();
      handleEqual();
    } else if (key === "Backspace") {
      e.preventDefault();
      handleBackspace();
    } else if (key === "Escape") {
      e.preventDefault();
      handleClear();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ];

  return (
    <div className="wrapper">
      <div className="calculator">
        <input className="input" type="text" value={input} onFocus={(e) => e.target.blur()} readOnly />
        <div className="buttons">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className="button"
              onClick={() => (btn === "=" ? handleEqual() : handleClick(btn))}
            >
              {btn}
            </button>
          ))}

          <button className="history-btn" onClick={() => setShowHistory((prev) => !prev)}><BiHistory /></button>

          {showHistory && (
            <div className="history">
              <div className="history-header">
                <h3 className="history-title">History</h3>
                <button className="history-close" onClick={() => setShowHistory(false)}><IoClose /></button>
              </div>
              <div className="history-list">
                {history.length === 0 ? (
                  <p className="history-empty">No history yet.</p>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="history-item">{item}</div>
                  ))
                )}
              </div>
              {history.length > 0 && (
                <button className="history-clear" onClick={() => setHistory([])}><GoTrash /></button>
              )}
            </div>
          )}

          <button className="clear" style={{ gridColumn: "span 2" }} onClick={handleClear}>C</button>
          <button className="clear" onClick={handleBackspace}><FaLongArrowAltLeft /></button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;