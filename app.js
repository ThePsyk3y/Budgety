/* eslint-disable no-console */
// *Budget Controller
const budgetController = (function budget() {

}());

// *UI Controller
const UIController = (function UI() {
  const UIclassID = {
    typeID: '.add__type',
    descID: '.add__description',
    valID: '.add__value',
  };

  return {
    getInput() {
      return {
        type: document.querySelector(UIclassID.type).value, // ?Retruns Income or Expense
        desc: document.querySelector(UIclassID.descID).value, // ?Returns description.
        val: document.querySelector(UIclassID.valID).value, // ?Returns entered value
      };
    },
  };
}());

// *App Controller
const controller = (function ctrl(budgetCtrl, UICtrl) {
  const ctrlClassID = {
    btnID: '.add__btn',
  };

  const ctrlAddItem = function add() {
    const input = UICtrl.getInput();
    console.log(input);
  };

  document.querySelector(ctrlClassID.btnID).addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
}(budgetController, UIController));
