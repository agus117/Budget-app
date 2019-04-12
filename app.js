// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {  
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        } 
    };
    
    return {
        addItem: function(type, des, val) {
            
            var newItem, ID;
           
            // Defining ID for new item depending on the type of item.
            if(data.allItems[type].length > 0)
            {
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
            }
            else 
            {
                ID = 0;
            }
            
            
            // Creating new item based on 'inc' or 'exp' type.
            if(type === 'exp')
            {
                newItem = new Expense(ID, des, val);
            }
            else if(type === 'inc')
            {
                newItem = new Income(ID, des, val);
            }
            
            // Push new item into our data structure.
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        }
    };
    
})();

// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description', 
        inputValue: '.add__value',
        inputBtn: '.add__btn', 
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will return 'inc' or 'exp'. 'value' method is used only used with input elements
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        }, 
        
        addListItem: function(obj, type) {
            
            var html, newHtml, element;
            
            // 1. Create HTML string with placeholder text.
            if(type === 'inc')
            {
                element = DOMstrings.incomeContainer;
                
                html  = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp')
            {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
             
            // 2. Replace the placeholder text with some actual data.
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // 3. Insert the HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        clearFields: function() {
            
            var fields, fieldsArray;
            
            // Storing elements to clear. Returns a list.
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            // Converting list to array.
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array) {
                    current.value = '';
            });
            
            fieldsArray[0].focus();
        },
        
        // Returns the user input value in each input of the page
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
 })();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings();
        
        // Functionality for the addItem button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Functionality for the 'ENTER' keypress anywhere on the page
        document.addEventListener('keydown', function(event) {

            if(event.key === 'Enter' || event.which === 'Enter')
            {
                ctrlAddItem();
            }

        });     
    };
    
    var ctrlAddItem = function() {
        
        var input, newItem;
        
         // 1. Get the field input data
        input = UICtrl.getInput();
        
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Clear the input fields
        UICtrl.clearFields();
        
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI
        
    }
    
    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

// Initialize event listeners y start application
controller.init();













