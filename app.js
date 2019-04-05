// BUDGET CONTROLLER
var budgetController = (function() {
    
  
    
})();

// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description', 
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will return 'inc' or 'exp'. 'value' method is used only used with input elements
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        }, 
        
        // Returns the user input value in each input of the page
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
 })();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var DOM = UICtrl.getDOMstrings();
    var ctrlAddItem = function() {
        
         // 1. Get the field input data
        var input = UIController.getInput();
        console.log(input);
        
        // 2. Add the item to the budget controller
        
        // 3. Add the item to the UI
        
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI
        
    }
   
    // Functionality for the addItem button
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
    // Functionality for the 'ENTER' keypress anywhere on the page
    document.addEventListener('keydown', function(event) {
    
        if(event.key === 'Enter' || event.which === 'Enter')
        {
            ctrlAddItem();
        }
        
    });
    
})(budgetController, UIController);
















