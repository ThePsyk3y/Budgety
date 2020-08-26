/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// ?Budget Controller
const budgetController = (function budget() {
  const Expense = function expenseConst(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };
  const Income = function incomeConst(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  const budgetData = {
    allItems: {
      exp: [],
      inc: [],
    },
    total: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  const calculateTotal = function total(type) {
    let sum = 0;
    budgetData.allItems[type].forEach((current) => {
      sum += current.value;
    });
    budgetData.total[type] = sum;
  };

  return {
    addItem(type, des, val) {
      let newItem = 0;
      let ID = 0;

      // *Create new ID
      // ID = lastID + 1
      if (budgetData.allItems[type].length > 0) {
        ID = budgetData.allItems[type][budgetData.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // *Create new Item based on Income or Expense
      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }

      // *Insert it into data structure
      budgetData.allItems[type].push(newItem);

      // *Return the new Element
      return newItem;
    },
    calculateBudget() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate the budget: income - expenses
      budgetData.budget = budgetData.total.inc - budgetData.total.exp;
      // Calculate the expense percentage
      budgetData.percentage = Math.round((budgetData.total.exp / budgetData.total.inc) * 100);
    },
    getBudget() {
      return {
        budget: budgetData.budget,
        percentage: budgetData.percentage,
        totalinc: budgetData.total.inc,
        totalexp: budgetData.total.exp,
      };
    },
    testing() {
      console.log(budgetData);
    },
  };
}());

// !------------------------------------------------------------------------------------------------

// ?UI Controller
const UIController = (function UI() {
  const UIclassID = {
    typeID: '.add__type',
    descID: '.add__description',
    valID: '.add__value',
    btnID: '.add__btn',
    incomeCont: '.income__list',
    expenseCont: '.expenses__list',
    budgetID: '.budget__value',
    incomeID: '.budget__income--value',
    expenseID: '.budget__expenses--value',
    percID: '.budget__expenses--percentage',
  };

  return {
    getInput() {
      return {
        type: document.querySelector(UIclassID.typeID).value, // ?Retruns Income or Expense
        desc: document.querySelector(UIclassID.descID).value, // ?Returns description.
        val: parseFloat(document.querySelector(UIclassID.valID).value), // ?Returns entered value
      };
    },

    addListItem(obj, type) {
      // Create HTML string with placeholder text
      let html;
      let newHtml;
      let element;

      if (type === 'inc') {
        element = UIclassID.incomeCont;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">&#8377;%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = UIclassID.expenseCont;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">&#8377;%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.desc);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields() {
      const fields = document.querySelectorAll(`${UIclassID.descID}, ${UIclassID.valID}`);
      const fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => {
        current.value = '';
      });

      fieldsArr[0].focus();
    },
    displayBudget(obj) {
      document.querySelector(UIclassID.budgetID).textContent = obj.budget;
      if (obj.totalinc % 1 !== 0) {
        document.querySelector(UIclassID.incomeID).textContent = `+ ${obj.totalinc}`;
      } else {
        document.querySelector(UIclassID.incomeID).textContent = `+ ${obj.totalinc}.00`;
      }
      if (obj.totalexp % 1 !== 0) {
        document.querySelector(UIclassID.expenseID).textContent = `- ${obj.totalexp}`;
      } else {
        document.querySelector(UIclassID.expenseID).textContent = `- ${obj.totalexp}.00`;
      }
      document.querySelector(UIclassID.percID).textContent = `${obj.percentage}%`;
    },

    getClassID() {
      return UIclassID;
    },
  };
}());

// !------------------------------------------------------------------------------------------------

// ?App Controller
const controller = (function ctrl(budgetCtrl, UICtrl) {
  const updateBudget = function up() {
    // *Calculate the budget
    budgetCtrl.calculateBudget();
    // *Return the budget
    const budget = budgetCtrl.getBudget();

    // *Update the budget
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = function add() {
    // *Get input data
    const input = UICtrl.getInput();
    if (!isNaN(input.val) && input.desc !== '' && input.val > 0) {
      // *Add new item to budget controller
      const newItem = budgetCtrl.addItem(input.type, input.desc, input.val);

      // *Add item to UI
      UICtrl.addListItem(newItem, input.type);

      // *Clear Input fields
      UICtrl.clearFields();

      // *Call Update Budget function
      updateBudget();
    }
  };

  const setupEventListeners = function eventList() {
    const ctrlClassID = UICtrl.getClassID();

    document
      .querySelector(ctrlClassID.btnID)
      .addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init() {
      console.log('Application has started');
      setupEventListeners();
    },
  };
}(budgetController, UIController));

controller.init();
