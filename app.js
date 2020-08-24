/* eslint-disable no-console */
// ?Budget Controller
const budgetController = (function budget() {
  const Expense = function expenseFuncConstructor(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };
  const Income = function incomeFuncConstructor(id, desc, value) {
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
  };

  return {
    getInput() {
      return {
        type: document.querySelector(UIclassID.typeID).value, // ?Retruns Income or Expense
        desc: document.querySelector(UIclassID.descID).value, // ?Returns description.
        val: document.querySelector(UIclassID.valID).value, // ?Returns entered value
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

    getClassID() {
      return UIclassID;
    },
  };
}());

// !------------------------------------------------------------------------------------------------

// ?App Controller
const controller = (function ctrl(budgetCtrl, UICtrl) {
  const ctrlAddItem = function add() {
    // *Get input data
    const input = UICtrl.getInput();
    // *Add new item to budget controller
    const newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
    // *Add item to UI
    UICtrl.addListItem(newItem, input.type);
    console.log(newItem);

    // *Clear Input fields
    UICtrl.clearFields();

    // *Calculate the budget

    // *Update the budget
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
