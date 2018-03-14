//budget control
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
 
        if(totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
        this.percentage = -1;
    }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //internal private function
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {

            sum += cur.value;

        });

        data.totals[type] = sum;
        
    };

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
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);
            //Return the new element
            return newItem;
            },

            deleteItem: function(type, id) {
                var ids, index;

                ids = data.allItems[type].map(function(current) {
                return current.id;
                });

                index = ids.indexOf(id);

                if (index !== -1) {
                    data.allItems[type].splice(index, 1);
                }

            },

            calculateBudget: function() {

                //calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');
                //calculate the income - expenses
                data.budget = data.totals.inc - data.totals.exp;
                // calculate the percentage of income that we spent
                if (data.totals.inc > 0) {
                data.percentage = data.totals.exp / data.totals.inc * 100;
                } else {
                    data.percentage = -1;
                }
            },

            calculatePercentages: function() {

                data.allItems.exp.forEach(function(cur) {
                    cur.calcPercentage(data.totals.inc);
                });

            },

            getPercentages: function() {

                var allPerc = data.allItems.exp.map(function(cur) {
                    return cur.getPercentage();
                });

                return allPerc;

            },

            getBudget: function() {
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                }
            },

            testing: function() {
                console.log(data);
            }
        };
})();

//UI Control
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        /*
        + or - before the number,
        exactly 2 decimal points,
        coma separating the thousands 
        */

        num = Math.abs(num);
        num = num.toFixed(2);
        // split the number into the integer and decimal part and store in a variable
        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3 ) {
            int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length) //if the input is 2310 the result is 2,310
        }

        dec = numSplit[1];

        return  (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    return {
            getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        //object the same what we used in the function constructor CtrlAddItem
            addListItem: function(obj, type) {
                var html, newHtml, element;
            // Create an HTML string with placeholder text
                if (type === 'inc') {
                    element = DOMStrings.incomeContainer;
                
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') {
                    element = DOMStrings.expensesContainer;
                    
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

            // Replace the placeholder text with the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            // Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        getDOMStrings: function() {
            return DOMStrings;
        },

        displayBudget: function(obj) { /*we dont want to change the html just the text-textContent*/
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
        
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            
            nodeListForEach(fields, function(current, index) {

            if(percentages[index] > 0){
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
                console.log(percentages);   
            }

            });  
            
        },

        displayMonth: function() {
                var now, month, months, year
                now = new Date();

                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                month = now.getMonth();
                year = now.getFullYear();
                document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        }
    };

})();


//Global app control
var controller = (function(budgetCtrl, UICtrl) {
    
    var DOM = UICtrl.getDOMStrings();

    var setupEventListeners = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

    };
    
    var updateBudget = function () {
        //1. Calculate budget
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget = budgetController.getBudget();
        //3. Display the budget to the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function() {
        //1. Calculate percentages.
        budgetCtrl.calculatePercentages();
        //2. Read percentages from the budget controller.
        var percentages = budgetCtrl.getPercentages();
        //3. Display the updated percentages, update the UI
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function() {
        var input, newItem;

         //1. Get field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            //2. Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI.
            UIController.addListItem(newItem, input.type);

            //4. Clear fields
            UIController.clearFields();

            //5. Calculate and update the budget
            updateBudget();    

            //6. Update percentages.
            updatePercentages();
        
        }
        
    };

    var ctrlDeleteItem = function(event) {
       var itemID, splitID, type, ID;
        //traverse up the DOM to the element which contains the unique ID for the element to delete
        itemID = event.target.parentNode.parentNode.parentNode.id;
       
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //1. delete the item from the data structure
            budgetController.deleteItem(type,ID);
            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            //3. update and show new budget
            updateBudget();
            //4. update percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            setupEventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };

})(budgetController, UIController);

controller.init();