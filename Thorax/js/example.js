//  This is the todo list dynamic template.
var gobalTemplate = [
  '<div class="ui input">',
  '<input type="text" id="todoThing" name="todoThing" value="" placeholder="write something here.">',
  '</div>',
  '<div class="ui buttons button-area">',
  '<div class="ui button green">ALL</div>',
  '<div class="or"></div>',
  '<div class="ui button">Active</div>',
  '<div class="or"></div>',
  '<div class="ui button">Complete</div>',
  '</div>',
  '<div class="ui primary button button-save">SAVE</div>',
  '{{#collection tag="div" id="todoUl" class="ui relaxed list"}}',
  '<div class="item">',
  '<div class="content">',
  '<input type="checkbox" id="done{{id}}" {{#done}}checked{{/done}} class="checkboxTodo">',
  '<span class="todoItemText {{#done}}done{{/done}}" todoId="{{id}}">{{name}}</span>',
  '</div>',
  '</div>',
  '{{/collection}}'
].join('');

jQuery(function($){
  var _getTodoList;
  var _getTodoItem;
  var _putTodoItem;
  var _changeTodoItem;
  var _view;
  var _buttonView;

  //  Load the todo list.
  _getTodoList = function() {
    var _todoItem;
    $.ajax({
      url: 'http://beta.fandorashop.com/api/todos',
      dataType: 'JSON',
      async: false,
      method: 'GET'
    }).done(function(callBackData){
      _todoItem = callBackData.data
    }).error(function(e){
      alert('Okay, Huston, we\'ve had a problem here! \n We cannot get anything.');
    });
    return _todoItem;
  }

  //  Insert the todo item.
  _putTodoItem = function(_wantTodo) {
    var _todoData = {
      done: 0,
      name: _wantTodo
    };
    $.ajax({
      url: 'http://beta.fandorashop.com/api/todos',
      dataType: 'JSON',
      data: _todoData,
      method: 'POST'
    }).done(function(callBackData){
      $('#todoThing').val('');
      var _id = callBackData.data;
      $('#todoUl').prepend(
        '<div class="item">' +
        '<div class="content">' +
        '<input type="checkbox" id="done' + _id + '" class="checkboxTodo">' +
        '<span class="todoItemText" todoId="' + _id + '">' + _wantTodo + '</span>' +
        '</div>' +
        '</div>'
      );
    }).error(function(e){
      alert('Okay, Huston, we\'ve had a problem here! \n We cannot insert todo item.');
    });
  }

  //  Change the todo item.
  _changeTodoItem = function(_wantTodo, _done, _todoId, _targetParentObj, _switchTag) {
    var _todoData = {
      done: _done,
      name: _wantTodo
    };
    $.ajax({
      url: 'http://beta.fandorashop.com/api/todos/' + _todoId,
      dataType: 'JSON',
      data: _todoData,
      method: 'PUT'
    }).done(function(data){
      if (_switchTag) {
        var _tempEl = _targetParentObj.parent();
        _targetParentObj.remove();
        if (_done) {
          _tempEl.append('<span class="todoItemText done" todoId="' + _todoId +'">' + _wantTodo + '</span>');
        } else {
          _tempEl.append('<span class="todoItemText" todoId="' + _todoId +'">' + _wantTodo + '</span>');
        }
      }
    }).error(function(e){
      alert('Okay, Huston, we\'ve had a problem here! \n We cannot change todo item.');
    });
  }

  _view = new Thorax.View({
    collection: new Thorax.Collection(_getTodoList()),
    events: {
      'click div.buttons div.button': function(event) {
        $(event.target).parent().find('div.button').removeClass('green');
        $(event.target).addClass('green');
        var _todoItems = $('div#todoUl');
        switch($(event.target).text()){
          case 'ALL':
            _todoItems.find('div.item').show();
          break;
          case 'Active':
            _todoItems.find('div.item').show();
            _todoItems.find('div.item span.done').parents('div.item').hide();
          break;
          case 'Complete':
            _todoItems.find('div.item').hide();
            _todoItems.find('div.item span.done').parents('div.item').show();
          break;
        }
      },
      'click span.todoItemText': function(event) {
        var _tempEl = $(event.target);
        var _tempText = _tempEl.text();
        var _tempId = _tempEl.attr('todoId');
        if(_tempEl.prev().prop('checked')) {
          alert('本項目已經完成');
        } else {
          if (_tempEl.parents('div#todoUl').find('input#tempTodo').length > 0) {
            alert('請先完成目前的編輯事項');
          } else {
            _tempEl.parent().find('span').remove().end()
              .append('<div class="ui input"><input type="text" value="' + _tempText + '" id="tempTodo" todoId="' + _tempId + '"></div>');
          }
        };
      },
      'keydown input#todoThing': function(event) {
        var _tempText = $(event.target).val();
        if (event.keyCode == 13) {
          if (_tempText != '') {
            _putTodoItem(_tempText);
          } else {
            alert('請輸入待辦事項。');
          }
        }
      },
      'click div.button-save': function(event) {
        if ($('#main-container').find('input#tempTodo').length > 0) {
          var _tempText = $('input#tempTodo').val();
          var _tempId = $('input#tempTodo').attr('todoId');
          var _tempDown = $('input#tempTodo').parent().prev().prop('checked');
          _tempDown = (_tempDown) ? 1 : 0;
          if (_tempText != '') {
            _changeTodoItem(_tempText, _tempDown, _tempId, $('input#tempTodo').parent(), true);
          } else {
            alert('請輸入待辦事項。');
          }
        } else {
          var _tempText = $('#todoThing').val();
          if (_tempText != '') {
            _putTodoItem(_tempText);
          } else {
            alert('請輸入待辦事項。');
          }
        }
      },
      'keydown input#tempTodo': function(event) {
        var _tempText = $(event.target).val();
        var _tempId = $(event.target).attr('todoId');
        var _tempDown = $(event.target).parent().prev().prop('checked');
        if (event.keyCode == 13) {
          _tempDown = (_tempDown) ? 1 : 0;
          if (_tempText != '') {
            _changeTodoItem(_tempText, _tempDown, _tempId, $(event.target).parent(), true);
          } else {
            alert('請輸入待辦事項。');
          }
        }
      },
      'change input[type="checkbox"]': function(event) {
        var _tempDown = $(event.target).prop('checked');
        var _tempText = $(event.target).parent().find('span').text();
        var _tempId = $(event.target).parent().find('span').attr('todoId');
        $(event.target).next().toggleClass('done');
        _tempDown = (_tempDown) ? 1 : 0;
        _changeTodoItem(_tempText, _tempDown, _tempId, $(event.target).parent(), false);
      }
    },
    template: Handlebars.compile(gobalTemplate)
  });

  _view.appendTo('#main-container');

  Handlebars.registerViewHelper('on', function(evName, helperView) {
    return helperView.listenTo(helperView.parent, evName, function() {
      return helperView.render();
    });
  });
});