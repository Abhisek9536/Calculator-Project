// Calculator Script
// Self-invoking function to keep variables private
(() => {
  
  // ===== Selecting elements =====
  const opDisp = document.getElementById('operationDisplay');
  const resDisp = document.getElementById('resultDisplay');
  const btns = document.getElementById('buttonsGrid');

  const out1 = document.getElementById('multiOutput1');
  const out2 = document.getElementById('multiOutput2');
  const out3 = document.getElementById('multiOutput3');

  // ===== Variables =====
  let current = "0";
  let prev = "";
  let op = null;
  let waitSecond = false;
  let justDone = false;

  // last 3 results
  let last3 = ["-", "-", "-"];

  // ===== Update last 3 results =====
  function updateHistory(newVal) {
    last3.shift();
    last3.push(newVal);
    out1.textContent = last3[2];
    out2.textContent = last3[1];
    out3.textContent = last3[0];
  }

  // ===== Update display =====
  function show() {
    resDisp.innerText = current;
    if (op && prev) {
      opDisp.innerText = `${prev} ${getOp(op)} ${waitSecond ? "0" : current}`;
    } else if (op) {
      opDisp.innerText = `${prev} ${getOp(op)}`;
    } else {
      opDisp.innerText = prev || "0";
    }
  }

  // ===== Operator symbols =====
  function getOp(o) {
    switch (o) {
      case "+": return "+";
      case "-": return "-";
      case "*": return "×";
      case "/": return "÷";
      case "%": return "%";
      default: return o;
    }
  }

  // ===== Add number =====
  function addNum(n) {
    if (justDone) {
      current = n === "." ? "0." : n;
      prev = "";
      op = null;
      waitSecond = false;
      justDone = false;
      show();
      return;
    }
    if (waitSecond) {
      current = n === "." ? "0." : n;
      waitSecond = false;
    } else {
      if (n === "." && current.includes(".")) return;
      if (current === "0" && n !== ".") {
        current = n;
      } else {
        current += n;
      }
    }
    show();
  }

  // ===== Add operator =====
  function addOp(o) {
    if (op !== null && !waitSecond) {
      doCalc();
    }
    prev = current;
    op = o;
    waitSecond = true;
    justDone = false;
    current = "0";
    show();
  }

  // ===== Do calculation =====
  function doCalc() {
    if (op === null) return;
    let secondNum = waitSecond ? 0 : parseFloat(current);
    const firstNum = parseFloat(prev);
    if (isNaN(firstNum) || isNaN(secondNum)) return;

    let ans;
    switch (op) {
      case "+": ans = firstNum + secondNum; break;
      case "-": ans = firstNum - secondNum; break;
      case "*": ans = firstNum * secondNum; break;
      case "/": ans = secondNum === 0 ? "Error" : firstNum / secondNum; break;
      case "%": ans = firstNum % secondNum; break;
      default: return;
    }

    updateHistory(ans.toString());
    opDisp.innerText = `${prev} ${getOp(op)} ${secondNum} =`;
    current = ans.toString();
    op = null;
    prev = "";
    waitSecond = false;
    justDone = true;
    show();
  }

  // ===== Clear all =====
  function clearAll() {
    current = "0";
    prev = "";
    op = null;
    waitSecond = false;
    justDone = false;
    show();
  }

  // ===== Delete last =====
  function delLast() {
    if (justDone || waitSecond) return;
    if (current.length === 1) {
      current = "0";
    } else {
      current = current.slice(0, -1);
    }
    show();
  }

  // ===== Square function =====
  function squareNum() {
    let num = parseFloat(current);
    if (isNaN(num)) return;
    num = num * num;
    updateHistory(num.toString());
    current = num.toString();
    opDisp.innerText = "";
    waitSecond = false;
    justDone = true;
    op = null;
    prev = "";
    show();
  }

  // ===== Button clicks =====
  btns.addEventListener("click", (e) => {
    const t = e.target;
    if (!t.matches("button")) return;

    const act = t.dataset.action;
    const val = t.dataset.value;

    if (act === "number") {
      addNum(val);
    } else if (act === "operator") {
      addOp(val);
    } else if (act === "equals") {
      doCalc();
    } else if (act === "clear") {
      clearAll();
    } else if (act === "delete") {
      delLast();
    } else if (act === "square") {
      squareNum();
    }
  });

  // ===== Keyboard support =====
  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (e.key >= "0" && e.key <= "9") {
      addNum(e.key);
    } else if (e.key === ".") {
      addNum(".");
    } else if (["+","-","*","/","%"].includes(e.key)) {
      addOp(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      doCalc();  // Enter = calculate
    } else if (e.key === "Backspace") {
      delLast();
    } else if (e.key === "Escape") {
      clearAll();
    }
  });

  // ===== Initial display =====
  show();

})();
