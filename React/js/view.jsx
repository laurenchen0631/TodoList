"use strict";

var TODOS = [
    {
        "name": "1",
        "Done": true
    }
];

var Todo = React.createClass({
    handleChange: function() {
        this.props.toggle(this.props.index);
    },
    render: function() {
        return (
            <div className="todo">
                <input checked={this.props.completed} onChange={this.handleChange} ref="completedInput" type="checkbox"/>
                {this.props.name}
            </div>
        );
    }
});

var TodoList = React.createClass({
    render: function() {
        var todoNodes = this.props.data.map(function(todo, index) {
            if (todo.Done == true && this.props.filter == "Active" || todo.Done == false && this.props.filter == "Done")
                return;
            return (
                <Todo completed={todo.Done} index={index} name={todo.name} toggle={this.props.toggle}/>
            );
        }.bind(this));

        return (
            <div className="todoList">
                {todoNodes}
            </div>
        );
    }
});

//We pass some methods in a JavaScript object to React.createClass() to create a new React component.
var TodoListForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.refs.name.getDOMNode().value.trim();
        if (!name)
            return;
        this.refs.name.getDOMNode().value = '';

        //send new item to item manager --> TodoBox
        this.props.onSubmit({
            name: name,
            Done: false
        });
    },
    render: function() {
        return (
            <form className="TodoListForm" onSubmit={this.handleSubmit}>
                <input placeholder="Item name" ref="name" type="text"/>
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

var TodoFilter = React.createClass({
    setFilter: function(newfilter) {
        this.props.handleFilter(newfilter.target.id);
    },
    render: function() {
        return (
            <div className="todoFilter">
                <button id="All" onClick={this.setFilter}>All</button>
                <button id="Done" onClick={this.setFilter}>Done</button>
                <button id="Active" onClick={this.setFilter}>Active</button>
            </div>
        )
    }
});

var TodoBox = React.createClass({
    handleCommentSubmit: function(todo) {
        var todos = this.state.data;
        todos.push(todo);
        this.setState({
            data: todos
        });
    },
    handleFilter: function(filter) {
        this.setState({
            filterText: filter
        });
    },
    toggle: function(index) {
        var todos = this.state.data;
        todos[index].Done = !todos[index].Done;

        this.setState({
            data: todos
        });
    },
    getInitialState: function() {
        return {
            filterText: 'All',
            data: []
        };
    },
//render which returns a tree of React components that will eventually render to HTML.
    componentDidMount: function() {
        this.setState({
            data: this.props.data
        });
    },
    render: function() {
        return (
            <div className="todoBox">
                <header>Todo List</header>
                <TodoListForm onSubmit={this.handleCommentSubmit}/>
                <TodoFilter handleFilter={this.handleFilter}/>
                <TodoList data={this.state.data} filter={this.state.filterText} toggle={this.toggle}/>
            </div>
        );
    }
});

React.render(<TodoBox data={TODOS}/>, document.getElementById('content'));
