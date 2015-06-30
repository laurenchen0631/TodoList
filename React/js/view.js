'use strict';

var data = [{"name": "1", "isChecked": true}];

//We pass some methods in a JavaScript object to React.createClass() to create a new React component.
var ItemBox = React.createClass({
    handleCommentSubmit: function (item) {
        var items = this.state.data;
        items.push(item);
        this.setState({data: items});
		//tis.state.data;.push(item)';
        //console.log(this.state.data);
    },
	toggle: function (itemToToggle) {
		console.log("Item " + itemToToggle + " toggle event");
		var items = this.state.data;
		
		items[itemToToggle].isChecked = !(items[itemToToggle].isChecked);
		console.log(items[itemToToggle].name + "is toggled to " + items[itemToToggle].isChecked);
		
		this.setState({
			data: items
		});
		console.log(this.state.data);
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
            <div className = "itemBox">
                <h1>Todo List</h1>
                <ItemForm onSubmit={this.handleCommentSubmit}/>
								<ItemList data={this.state.data} checkChange={this.toggle}/>
            </div>
        );
    }
});

var ItemForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var name = React.findDOMNode(this.refs.name).value.trim();
        if (!name) return;
        React.findDOMNode(this.refs.name).value = '';
		
       	//send new item to item manager --> ItemBox
        this.props.onSubmit({name: name, isChecked: false});
        return;
    },
    render: function () {
        return ( 
          <form className="itemForm" onSubmit={this.handleSubmit} >
              <input type="text" placeholder="Item name" ref="name"/>
              <input type="submit" value="Post" />
          </form>
        );
    }
});


var ItemList = React.createClass({
    render: function () {
				var self = this;
				
        var itemNodes = this.props.data.map(function (item, index) {
          return (
            <Item name={item.name} isChecked={item.isChecked} onToggle={self.props.checkChange} index={index} />
          );
        });
        
        return ( 
						<div className = "itemList">
                {itemNodes}
            </div>
        );
    }
});


var Item = React.createClass({
	toggle: function (e){
		e.preventDefault();
		//console.log("item toggle");
		this.props.onToggle(this.props.index);
		
		return;
	},
  render: function() {
    return (
      <div className="item">
				<input className="toggle" type="checkbox" 
            checked={this.props.isChecked} onChange={this.toggle}/>
        {this.props.name}
      </div>
    );
  }
});

React.render( <ItemBox data={data}/>,
    document.getElementById('content')
);