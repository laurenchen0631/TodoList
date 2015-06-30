"use strict";

var TODOS = [{"name": "1", "Done": true}];

var Todo = React.createClass({
  handleChange: function() {
     this.props.toggle(this.props.index);
  },
  render: function() {
    return (
      <div className="todo">
        <input
            type="checkbox"
            checked={this.props.completed}
            onChange={this.handleChange}
            ref="completedInput"
        />
        {this.props.name}
      </div>
    );
  }
});

var TodoList = React.createClass({
    render: function () {
        var todoNodes = this.props.data.map(function (todo, index) {
          return (
            <Todo
              name={todo.name}
              completed={todo.Done}
              toggle={this.props.toggle}
              index={index}
            />
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
        if (!name) return;
        this.refs.name.getDOMNode().value = '';

       	//send new item to item manager --> TodoBox
        this.props.onSubmit({name: name, Done: false});
    },
    render: function () {
        return (
          <form className="TodoListForm" onSubmit={this.handleSubmit} >
              <input type="text" placeholder="Item name" ref="name"/>
              <input type="submit" value="Post" />
          </form>
        );
    }
});

var TodoBox = React.createClass({
    handleCommentSubmit: function (item) {
        var items = this.state.data;
        items.push(item);
        this.setState({data: items});
    },
	toggle: function (index) {
    		var todos = this.state.data;
    		todos[index].Done = !todos[index].Done;

    		this.setState({
    			data: todos
    		}, console.log(this.state.data));
    },
    getInitialState: function() {
        return {data: []};
    },
    //render which returns a tree of React components that will eventually render to HTML.
    componentDidMount: function () {
        this.setState({data: this.props.data});
    },
    render: function () {
        return (
            <div className="todoBox">
                <header>Todo List</header>
                <TodoListForm onSubmit={this.handleCommentSubmit} />
				<TodoList data={this.state.data} toggle={this.toggle}/>
            </div>
        );
    }
});

React.render( <TodoBox data={TODOS}/>,
    document.getElementById('content')
);
