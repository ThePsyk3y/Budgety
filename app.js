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
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = UIclassID.expenseCont;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.desc);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    const input = UICtrl.getInput();
    const newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
    UICtrl.addListItem(newItem, input.type);
    console.log(newItem);
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
