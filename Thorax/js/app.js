/*global Thorax, Backbone, Handlebars, window, Todo, $*/
/*jshint unused:false*/
var ENTER_KEY = 13;
var view;

(function () {
    'use strict';

    var gobalTemplate = [
        '<div class="ui page grid">',
            '<div class="sixteen wide column">',
                '<div class="ui fluid left icon action input">',
                    '<i class="add square icon"></i>',
                    '<input type="text" id="newTodo" placeholder="Add your new todo">',
                    '<button id="addTodo" class="ui button">ADD</button>',
                '</div>',
            '</div>',
            '<div class="ui equal width grid">',
                '<div class="column">',
                    '<div class="ui button" id="allBtn" >',
                        'All',
                    '</div>',
                '</div>',
                '<div class="column">',
                    '<div class="ui button" id="completedBtn" tabindex="0">',
                        'Completed',
                    '</div>',
                '</div>',
                '<div class="column">',
                    '<div class="ui button" id="activeBtn" tabindex="0">',
                        'Active',
                    '</div>',
                '</div>',
            '</div>',
        
            '<div class="ui horizontal divider">',
                'Todo List',
            '</div>',

            '<div class="two wide column"></div>',
            '{{#collection item-view="todo-item" tag="div" class="twelve wide column"}}',
                    '<div class="content unselectable">',
                        '<div class="ui right floated checkbox">',
                            '<input type="checkbox" class="toggle" {{#done}}checked{{/done}}>',
                        '</div>',
                        '<h3 class="ui header todoHeader">{{name}}</h3>',
                        '<div class="ui corner labeled input editBlock">',
                          '<input class="edit" type="text" value="{{name}}">',
                          '<div class="ui corner label">',
                            '<i class="write icon"></i>',
                          '</div>',
                        '</div>',
                    '</div>',
            '{{/collection}}',
        '</div>'].join('');

    // Kick things off by creating the **App**.
    view = new Thorax.View({
        template: Handlebars.compile(gobalTemplate),
        events: {
            "keypress #newTodo": function (e) {
                if (e.which !== ENTER_KEY) return;
                this.newTodo();
            },
            "click #addTodo": "newTodo",
            "click #allBtn": "filterAll",
            "click #completedBtn": "filterDone",
            "click #activeBtn": "filterActive"
        },
        newTodo: function(){
            var name = this.$('#newTodo').val();
            if (name === '') return;
            this.createTodo(name);
            this.$('#newTodo').val('');
        },
        createTodo: function (title) {
            var model = new Todo({name: title});
            if (this.filter === 'Done') this.filterAll();
            this.collection.add(model, {at: 0});
            model.save();
        },
        filter: 'All',
        filterAll: function () {
            if (this.filter === 'All') return;
            this.setCollection(window.app.todos);
            this.filter = 'All';
        },
        filterDone: function () {
            if (this.filter === 'Done') return;
            this.setCollection(window.app.todos.done());
            this.filter = 'Done';
        },
        filterActive: function () {
            if (this.filter === 'Active') return;
            this.setCollection(window.app.todos.remaining());
            this.filter = 'Active';
        }
    });

    
    Backbone.history.start();

    view.appendTo('#main-container');
    view.setCollection(window.app.todos);
    //            Handlebars.registerViewHelper('on', function(eventName, helperView) {
    //              helperView.listenTo(helperView.parent, eventName, function() {
    //                helperView.render();
    //              });
    //            });

}());