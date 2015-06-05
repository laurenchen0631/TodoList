/*global Thorax, ENTER_KEY, _*/
(function () {
    'use strict';

    // The DOM element for a todo item...
    Thorax.View.extend({
        className: "ui card todo",
        name: 'todo-item',
        initialize: function (options) {
            window.setTimeout(function () {$('.ui.checkbox').checkbox();}, 1);
        },
        events: {
            'change .toggle': 'toggleDone',
            'dblclick .todoHeader': 'edit',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close',
            
            // The "rendered" event is triggered by Thorax each time render() is called 
            rendered: function () {
                this.$('.header').toggleClass('completed', this.model.get('done'));
            }
        },

        // Toggle the 'Done' state of the model.
        toggleDone: function () {
            this.model.toggle();
            if(view.filter!=='All')
                view.collection.remove(this.model);
            else
                $('.ui.checkbox').checkbox();
        },

        // Switch this view into "editing" mode, displaying the input field.
        edit: function () {
            this.$('.editBlock').addClass('editing');
            this.$('.edit').focus();
        },

        // Close the "editing" mode, saving changes to the todo.
        close: function () {
            var value = this.$('.edit').val().trim();
            if (value !== '')
                this.model.changeName(value);

            this.$el.removeClass('editing');
        },

        // Hit enter, then close editing the item.
        updateOnEnter: function (e) {
            if (e.which === ENTER_KEY)
                this.close();
        }

    });
}());