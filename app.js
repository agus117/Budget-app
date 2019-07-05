// BUDGET CONTROLLER
var budgetController = (function() {

    // Constructor function for an expense input
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
        calcPercentage(totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            }
            else
                this.percentage = -1;
        }
        getPercentage() {
            return this.percentage;
        }
    }

    // Constructor function for an income input
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    //Calculates total income or expense depending on "type"
    var calculateTotal = function(type) {

        var sum = 0;

        // Iterating through array to obtain total sum.
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        // Adding the sum value to the totals property in data object.
        data.totals[type] = sum;
    };

    // Object that holds all income and expense objects and calculation values.
    var data = {

        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1
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

            // Return the new element.
            return newItem;
        },

        deleteItem: function(type, id) {

            var ids, index;

            ids = data.allItems[type].map(function(current) {
               return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1)
            {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {

            // Calculate total income and expenses.
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses.
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of the income that we spent.
            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else
            {
                data.percentage = -1;
            }

        },

        calculatePrecentages: function() {
          data.allItems.exp.forEach(function(current) {
              current.calcPercentage(data.totals.inc);
          });
        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function() {

            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            };
        },

        // For debugging
        showItems: function() {
            data.allItems.exp.forEach(function(current) {
                console.log(current);
            });
            data.allItems.inc.forEach(function(current) {
                console.log(current);
            });
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will return 'inc' or 'exp'. 'value' method is only used with input elements
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

                html  = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp')
            {
                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // 2. Replace the placeholder text with some actual data.
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // 3. Insert the HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(id) {
            var element =  document.getElementById(id);
            element.parentNode.removeChild(element);
        },

        // Resets input fields
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

        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExpense;

            if(obj.percentage > 0)
            {
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
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

        // Functionality for the delete button
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {

        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. Return the budget.
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI.
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePrecentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update UI with new percentages
        console.log(percentages);
    }

    var ctrlAddItem = function() {

        var input, newItem;

         // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, Number(input.value));

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear the input fields
        UICtrl.clearFields();

        // 5. Calculate the budget and update the budget UI
        updateBudget();

        // 6. Calculate and update percentages
        updatePercentages();

    }

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID)
        {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    }

    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayBudget(budgetCtrl.getBudget());
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Initialize event listeners y start application
controller.init();
