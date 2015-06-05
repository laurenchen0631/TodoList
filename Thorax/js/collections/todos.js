/*global Thorax, Todo, $*/
(function () {
    'use strict';

    var TodoList = Thorax.Collection.extend({

        //url: 'http://fandorashop.com/api/todos',
        url: 'http://beta.fandorashop.com/api/todos',
        model: Todo,
        initialize: function () {
            this.getCount();
        },

        count: 0,

        getCount: function () {
            var self = this;
            $.ajax({
                type: 'GET',
                url: self.url + '/count',
                dataType: 'JSON',
            }).done(function (data) {
                self.count = data.data;
            }).error(function (err) {
                console.log(err);
            });
        },

        // Filter down the list of all todo items that are finished.
        done: function () {
            return new TodoList(this.where({
                done: true
            }));
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function () {
            return new TodoList(this.where({
                done: false
            }));
        },

        parse: function (response) {
            return response.data;
        },

        //         fetch: function (operations) {
        //             var self = this;
        //             $.ajax({
        //                 type: 'GET',
        //                 url: self.url,
        //                 dataType: 'JSON',
        //             }).done(function (data) {
        //                 _.each(data.data, function (ele) {
        //                     self.add(ele);
        //                 });
        //                 if (operations.success) operations.success(data.data);
        //             }).error(function (err) {
        //                 if (operations.error) operations.error(err);
        //             });
        //         }
    });

    // Create our global collection of **Todos**.
    window.app.todos = new TodoList();
    window.app.todos.fetch();

}());