//budget control
var budgetController = (function() {


})();

//UI Control
var UIController = (function() {


    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
            getInput: function() {
            return {
                var type = document.querySelector(inputType).value, //either inc or exp
                var description = document.querySelector(inputDescription).value,
                var value = document.querySelector(inputValue).value,
            };
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();


//Global app control
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMStrings();
    var ctrlAddItem = function() {

         //1. Get field input data
        var input = UICtrl.getInput();
        //2. Add the item to the budget controller.

        //3. Add the item to the UI.

        //4. Calculate the budget

        //5. Display the budget to the UI

    }

    document.querySelector(DOM.inputBtn).addEventListener('click', function( {

       
    }))

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

})(budgetController, UIController);