class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      // Эти элементы хранят ссылки на текстовые области, где будут отображаться предыдущие и текущие значения
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.readyToReset = false; // Флаг, чтобы сбрасывать текущее значение после вычислений
      this.clear(); // Сброс всех значений
    }
  
    // Метод для очистки всех значений и операций
    clear() { 
      this.currentOperand = ''; // Текущее значение (операнд)
      this.previousOperand = ''; // Предыдущее значение
      this.operation = undefined; // Операция
    }
  
    // Удаление последнего символа в текущем операнде
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  
    // Добавление числа или точки в операнд
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return; // Не добавляем более одной точки
      this.currentOperand = this.currentOperand.toString() + number.toString(); // Добавление цифры
    }
  
    // Выбор операции: при этом, если уже есть предыдущий операнд, производим вычисление
    chooseOperation(operation) {
      if (this.currentOperand === '') return; // Игнорируем, если текущее значение пустое
      if (this.previousOperand !== '') {
        this.compute(); // Если ранее было введено значение, сначала вычисляем его
      }
      if (operation === 'Xn') {
        this.operation = '^'; // Обработка возведения в степень (X^n)
      } 
      else if  (operation === '%') {
        this.operation = '%';
      }
      else if (operation === 'sin' || operation === 'cos' || operation === 'tan') {
        this.computeTrig(operation); 
      }
      else {
        this.operation = operation; // Сохраняем выбранную операцию
      }
      this.previousOperand = this.currentOperand; // Переносим текущее значение в предыдущее
      this.currentOperand = ''; // Очищаем текущее значение для ввода нового
    }
  
    // Основной метод вычисления

compute() {
    let computation; // Переменная для результата
    const prev = parseFloat(this.previousOperand); // Преобразуем строку в число
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return; // Проверяем, что оба операнда — числа
    switch (this.operation) {
      case '+':
        computation = prev + current; // Сложение
        break;
      case '-':
        computation = prev - current; // Вычитание
        break;
      case '*':
        computation = prev * current; // Умножение
        break;
      case '÷':
        computation = prev / current; // Деление
        break;
      case '^':
        computation = prev ** current; // Возведение в степень
        break;
      case '%':
          computation = prev * (current / 100); // Процент от предыдущего значения
          break;
          case 'sin':
            computation = Math.sin(current * (Math.PI / 180)); // Вычисление синуса (угол в градусах)
            break;
          case 'cos':
            computation = Math.cos(current * (Math.PI / 180)); // Вычисление косинуса (угол в градусах)
            break;
          case 'tan':
            computation = Math.tan(current * (Math.PI / 180)); // Вычисление тангенса (угол в градусах)
            break;    
      default:
        return; // Если операция не найдена, ничего не делаем
    }
    this.readyToReset = true; // Готовы сбросить результат после вычисления
    this.currentOperand = computation; // Сохраняем результат
    this.operation = undefined; // Сбрасываем операцию
    this.previousOperand = ''; // Очищаем предыдущее значение
  }
  
  // Метод для отображения числа в удобочитаемом формате (с разделением тысяч)
getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]); // Целая часть
    const decimalDigits = stringNumber.split('.')[1]; // Дробная часть
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }
  
    if (decimalDigits != null) {
      // Преобразуем обратно в число, чтобы убрать лишние нули
      return parseFloat(number).toFixed(6).replace(/\.?0+$/, ''); // Обрезаем лишние нули в дробной части
    } else {
      return integerDisplay;
    }
  }
  
  
  
    // Обновление отображения значений в интерфейсе
    updateDisplay() {
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand);
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
      } else {
        this.previousOperandTextElement.innerText = '';
      }
    }
  
    // Метод для смены знака у числа
    changeNegative() {
      this.currentOperand *= -1;
    }
  
    // Метод для вычисления квадратного корня
    sqrt() {
      const current = parseFloat(this.currentOperand);
      if (isNaN(current)) return; // Проверка на корректность числа
      if (current < 0) {
        alert("Не стоит извлекать корень квадратный из отрицательного числа"); // Ошибка при отрицательных числах
        return;
      } else {
        this.currentOperand = Math.sqrt(current); // Вычисление корня
        this.readyToReset = true; // Флаг для сброса
        this.operation = undefined;
      }
    }
  }
  
  // Получение кнопок и элементов интерфейса
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.querySelector('[data-equals]');
  const deleteButton = document.querySelector('[data-delete]');
  const allClearButton = document.querySelector('[data-all-clear]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]');
  const currentOperandTextElement = document.querySelector('[data-current-operand]');
  const negativeButton = document.querySelector('[data-change-negative]');
  const sqrtButton = document.querySelector('[data-sqrt]');
  
  // Создание объекта калькулятора
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
  
  // Обработчики событий для кнопок чисел
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (calculator.previousOperand === "" &&
        calculator.currentOperand !== "" &&
        calculator.readyToReset) {
        calculator.currentOperand = "";
        calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    })
  })
  
  // Обработчики для кнопок операций
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText);
      calculator.updateDisplay();
    })
  })
  
  // Обработчик для кнопки "="
  equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
  })
  
  // Обработчик для кнопки очистки "AC"
  allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
  })
  
  // Обработчик для кнопки удаления символов
  deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
  })
  
  // Обработчик для смены знака у числа
  negativeButton.addEventListener('click', button => {
    calculator.changeNegative();
    calculator.updateDisplay();
  })
  
  // Обработчик для вычисления квадратного корня
  sqrtButton.addEventListener('click', button => {
    calculator.sqrt();
    calculator.updateDisplay();
  })
  