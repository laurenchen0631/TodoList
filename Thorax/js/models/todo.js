/*global Thorax*/
var Todo;

(function () {
    'use strict';

    Todo = Thorax.Model.extend({

        urlRoot: 'http://beta.fandorashop.com/api/todos',
        defaults: {
            name: '',
            done: false
        },
        
        // Toggle the `completed` state of this todo item.
        toggle: function () {
            this.save({
                done: !this.get('done')
            });
        },

        changeName: function (newName) {
            this.save({
                name: newName
            });
        },

        parse: function (response) {
            if (response.data) return response.data;
            return response;
        }
    });

}());