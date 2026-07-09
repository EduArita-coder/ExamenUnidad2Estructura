import { useState } from 'react';
import './Calculator.css';
import { HistoryList } from './HistoryList';
import { Stack } from '../estructuras/Pila';

interface HistoryEntry {
  expression: string;
  result: number;
}

export function DiseñoCalculadora() {
    const [valor, setValor] = useState<string>("0");
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);
    const [historyStack, setHistoryStack] = useState<Stack<HistoryEntry>>(() => new Stack<HistoryEntry>());

    const calculate = (firstValue: string, secondValue: string, currentOperator: string) => {
        const a = parseFloat(firstValue);
        const b = parseFloat(secondValue);

        switch (currentOperator) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "*":
                return a * b;
            case "÷":
                return b === 0 ? 0 : a / b;
            default:
                return b;
        }
    };

    const handleDigit = (digit: string) => {
        if (waitingForNewValue || valor === "0") {
            setValor(digit);
            setWaitingForNewValue(false);
            return;
        }

        setValor(prev => prev + digit);
    };

    const handleDecimal = () => {
        if (valor.includes('.')) {
            return;
        }

        if (waitingForNewValue || valor === "0") {
            setValor("0.");
            setWaitingForNewValue(false);
            return;
        }

        setValor(prev => prev + '.');
    };

    const handledOperator = (op: string) => {
        if (previousValue !== null && operator && !waitingForNewValue) {
            const result = calculate(previousValue, valor, operator);
            setValor(String(result));
            setPreviousValue(String(result));
        } else {
            setPreviousValue(valor);
        }

        setOperator(op);
        setWaitingForNewValue(true);
    };

    const pushResultToStack = (expression: string, result: number) => {
        const nextStack = new Stack<HistoryEntry>(historyStack.toArray());
        nextStack.push({ expression, result });
        setHistoryStack(nextStack);
    };

    const handleEqual = () => {
        if (previousValue && operator && !waitingForNewValue) {
            const result = calculate(previousValue, valor, operator);
            const resultText = String(result);
            setValor(resultText);
            pushResultToStack(`${previousValue} ${operator} ${valor}`, result);
        }

        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    const handleUndo = () => {
        if (historyStack.isEmpty()) {
            return;
        }

        const nextStack = new Stack<HistoryEntry>(historyStack.toArray());
        nextStack.pop();
        setHistoryStack(nextStack);

        const previousEntry = nextStack.peek();
        if (previousEntry) {
            setValor(String(previousEntry.result));
        }

        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    const handleClear = () => {
        setValor("0");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
        setHistoryStack(new Stack<HistoryEntry>());
    };

  return (
    <div className = "CalculatorPage">
      <div className="pantalla">
        <h1 style={{ fontSize: '24px', color: '#880000' ,marginTop: '1px'}}>Genial</h1>
        <h2 style={{ fontSize: '17px', color: '#959595' ,marginTop: '1px'}}>Tornillo Triste :c</h2>
        <input type="text" readOnly className="pantalla-input" value={valor} />
      </div>
      <div className="calculadora">
        <button onClick={() => handleDigit("7")}>7</button>
        <button onClick={() => handleDigit("8")}>8</button>
        <button onClick={() => handleDigit("9")}>9</button>
        <button onClick={() => handledOperator("+")}>+</button>
        <button onClick={() => handledOperator("*")}>*</button>
        <button onClick={() => handleDigit("4")}>4</button>
        <button onClick={() => handleDigit("5")}>5</button>
        <button onClick={() => handleDigit("6")}>6</button>
        <button onClick={() => handledOperator("-")}>-</button>
        <button onClick={() => handledOperator("÷")}>÷</button>
        <button onClick={() => handleDigit("1")}>1</button>
        <button onClick={() => handleDigit("2")}>2</button>
        <button onClick={() => handleDigit("3")}>3</button>
        <button onClick={handleEqual}>=</button>
        <button onClick={handleUndo}>↺</button>
        <button onClick={handleDecimal}>.</button>
        <button onClick={() => handleDigit("0")}>0</button>
        <button onClick={handleClear}>C</button>
      </div>

      <HistoryList entries={historyStack.toArray()} />
    </div>
  );
}
