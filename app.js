// ?Budget Controller
const budgetController = (function budget() {
  const Expense = function expenseConst(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function calPer(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function getPer() {
    return this.percentage;
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

    delItem(type, id) {
      const IDs = budgetData.allItems[type].map((current) => current.id);
      const index = IDs.indexOf(id);

      if (index !== -1) {
        budgetData.allItems[type].splice(index, 1);
      }
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

    calculatePercentage() {
      budgetData.allItems.exp.forEach((cur) => {
        cur.calcPercentage(budgetData.total.inc);
      });
    },

    getBudget() {
      return {
        budget: budgetData.budget,
        percentage: budgetData.percentage,
        totalinc: budgetData.total.inc,
        totalexp: budgetData.total.exp,
      };
    },

    getPercentage() {
      const allPercentages = budgetData.allItems.exp.map((cur) => cur.getPercentage());
      return allPercentages;
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
    percentListID: '.item__percentage',
    btnID: '.add__btn',
    delBtnID: '.item__delete--btn',
    incomeCont: '.income__list',
    expenseCont: '.expenses__list',
    budgetID: '.budget__value',
    incomeID: '.budget__income--value',
    expenseID: '.budget__expenses--value',
    percID: '.budget__expenses--percentage',
    container: '.container',
    monthID: '.budget__title--month',
  };

  const formatNumber = function formNum(num, type) {
    num = Math.abs(num);

    num = num.toFixed(2);

    const numSplit = num.split('.');

    let int = numSplit[0];
    const dec = numSplit[1];

    if (int.length > 3) {
      int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`;
    }

    if (type === 'inc') {
      num = `+ ${int}.${dec}`;
    } else {
      num = `- ${int}.${dec}`;
    }
    return num;
  };

  const nodeListForEach = function nodeFor(list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = UIclassID.expenseCont;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">25%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.desc);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into DOM
      document
        .querySelector(element)
        .insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem(selectorID) {
      const ele = document.getElementById(selectorID);
      ele.parentNode.removeChild(ele);
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
      let type;
      obj.budget >= 0 ? type = 'inc' : type = 'exp';

      document
        .querySelector(UIclassID.budgetID)
        .textContent = formatNumber(obj.budget, type);
      document
        .querySelector(UIclassID.incomeID)
        .textContent = formatNumber(obj.totalinc, 'inc');
      document
        .querySelector(UIclassID.expenseID)
        .textContent = formatNumber(obj.totalexp, 'exp');
      if (obj.percentage > 0) {
        document
          .querySelector(UIclassID.percID)
          .textContent = `${obj.percentage}%`;
      } else {
        document
          .querySelector(UIclassID.percID)
          .textContent = '---';
      }
    },

    displayPercentage(percentages) {
      const fields = document.querySelectorAll(UIclassID.percentListID);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]}%`;
        } else {
          current.textContent = '--';
        }
      });
    },

    displayMonth() {
      const now = new Date();

      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const curmonth = months[now.getMonth()];
      const curYear = now.getFullYear();

      document.querySelector(UIclassID.monthID).textContent = `${curmonth}, ${curYear}`;
    },

    changedType() {
      const fields = document.querySelectorAll(`${UIclassID.typeID},${UIclassID.descID},${UIclassID.valID}`);
      nodeListForEach(fields, (current) => {
        current.classList.toggle('red-focus');
      });
      document.querySelector(UIclassID.btnID).classList.toggle('red');
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

  const updatePercentages = function upPer() {
    // * Calculate Percentages of individual expense list items
    budgetCtrl.calculatePercentage();

    // *Read percentages from budget controller
    const percentages = budgetCtrl.getPercentage();

    // *Update the UI with new percentages
    UICtrl.displayPercentage(percentages);
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

      // *Calculate and update percentages
      updatePercentages();
    }
  };
  const ctrlDeleteItem = function del(event) {
    const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      const splitID = itemID.split('-');
      const type = splitID[0];
      const ID = parseInt(splitID[1], 10);

      // *Delete Item from data structure
      budgetCtrl.delItem(type, ID);

      // *Delete item from UI
      UICtrl.deleteListItem(itemID);

      // *Update and show new budget
      updateBudget();

      // *Calculate and update percentages
      updatePercentages();
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
    document
      .querySelector(ctrlClassID.container)
      .addEventListener('click', ctrlDeleteItem);
    document.querySelector(ctrlClassID.typeID).addEventListener('change', UICtrl.changedType);
  };

  return {
    init() {
      console.log('Application has started');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        percentage: -1,
        totalinc: 0,
        totalexp: 0,
      });
      setupEventListeners();
    },
  };
}(budgetController, UIController));

controller.init();
