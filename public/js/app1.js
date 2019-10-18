/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

// 	var util = {
// 		uuid: function () {
// 			/*jshint bitwise:false */
// 			var i, random;
// 			var uuid = '';

// 			for (i = 0; i < 32; i++) {
// 				random = Math.random() * 16 | 0;
// 				if (i === 8 || i === 12 || i === 16 || i === 20) {
// 					uuid += '-';
// 				}
// 				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
// 			}

// 			return uuid;
// 		},
// 		pluralize: function (count, word) {
// 			return count === 1 ? word : word + 's';
// 		},
// 		store: function (namespace, data) {
// 			if (arguments.length > 1) {
// 				return localStorage.setItem(namespace, JSON.stringify(data));
// 			} else {
// 				var store = localStorage.getItem(namespace);
// 				return (store && JSON.parse(store)) || [];
// 			}
// 		}
// 	};


var util_uuid =
		 function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		};
var util_pluralize = function (count, word) {
			return count === 1 ? word : word + 's';
		};

var util_store = function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
        store && console.log('store is: ', JSON.parse(store));
				return (store && JSON.parse(store)) || [];
			}
		};
	




// 	var App = {
// 		init: function () {
// 			this.todos = util.store('todos-jquery');
// 			this.todoTemplate = Handlebars.compile($('#todo-template').html());
// 			this.footerTemplate = Handlebars.compile($('#footer-template').html());
// 			this.bindEvents();

//       new Router({
// 				'/:filter': function (filter) {
// 					this.filter = filter;
// 					this.render();
// 				}.bind(this)
// 			}).init('/all');      
// 		},
// 		bindEvents: function () {
// 			//function whatIsThis() {console.log(this);};
//       $('#new-todo').on('keyup', this.create.bind(this));
// 			$('#toggle-all').on('change', this.toggleAll.bind(this));
// 			//$('#toggle-all').on('change', whatIsThis);
//       $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
// 			$('#todo-list')
// 				.on('change', '.toggle', this.toggle.bind(this))
// 				.on('dblclick', 'label', this.edit.bind(this))
// 				.on('keyup', '.edit', this.editKeyup.bind(this))
// 				.on('focusout', '.edit', this.update.bind(this))
// 				.on('click', '.destroy', this.destroy.bind(this));
// 		},
// 		render: function () {
// 			var todos = this.getFilteredTodos();
// 			$('#todo-list').html(this.todoTemplate(todos));
// 			$('#main').toggle(todos.length > 0);
// 			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
// 			this.renderFooter();
// 			$('#new-todo').focus();
// 			util.store('todos-jquery', this.todos);
// 		},
// 		renderFooter: function () {
// 			var todoCount = this.todos.length;
// 			var activeTodoCount = this.getActiveTodos().length;
// 			var template = this.footerTemplate({
// 				activeTodoCount: activeTodoCount,
// 				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
// 				completedTodos: todoCount - activeTodoCount,
// 				filter: this.filter
// 			});

// 			$('#footer').toggle(todoCount > 0).html(template);
// 		},
// 		toggleAll: function (e) {
// 			var isChecked = $(e.target).prop('checked');

// 			this.todos.forEach(function (todo) {
// 				todo.completed = isChecked;
// 			});

// 			this.render();
// 		},
// 		getActiveTodos: function () {
// 			return this.todos.filter(function (todo) {
// 				return !todo.completed;
// 			});
// 		},
// 		getCompletedTodos: function () {
// 			return this.todos.filter(function (todo) {
// 				return todo.completed;
// 			});
// 		},
// 		getFilteredTodos: function () {
// 			if (this.filter === 'active') {
// 				return this.getActiveTodos();
// 			}

// 			if (this.filter === 'completed') {
// 				return this.getCompletedTodos();
// 			}

// 			return this.todos;
// 		},
// 		destroyCompleted: function () {
// 			this.todos = this.getActiveTodos();
// 			this.filter = 'all';
// 			this.render();
// 		},
// 		// accepts an element from inside the `.item` div and
// 		// returns the corresponding index in the `todos` array
// 		indexFromEl: function (el) {
// 			var id = $(el).closest('li').data('id');
// 			var todos = this.todos;
// 			var i = todos.length;

// 			while (i--) {
// 				if (todos[i].id === id) {
// 					return i;
// 				}
// 			}
// 		},
// 		create: function (e) {
// 			var $input = $(e.target);
// 			var val = $input.val().trim();

// 			if (e.which !== ENTER_KEY || !val) {
// 				return;
// 			}

// 			this.todos.push({
// 				id: util.uuid(),
// 				title: val,
// 				completed: false
// 			});

// 			$input.val('');

// 			this.render();
// 		},
// 		toggle: function (e) {
// 			var i = this.indexFromEl(e.target);
// 			this.todos[i].completed = !this.todos[i].completed;
// 			this.render();
// 		},
// 		edit: function (e) {
// 			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
// 			$input.val($input.val()).focus();


// 		},
// 		editKeyup: function (e) {
// 			if (e.which === ENTER_KEY) {
// 				e.target.blur();
// 			}

// 			if (e.which === ESCAPE_KEY) {
// 				$(e.target).data('abort', true).blur();
// 			}
// 		},
// 		update: function (e) {
// 			var el = e.target;
// 			var $el = $(el);
// 			var val = $el.val().trim();

// 			if (!val) {
// 				this.destroy(e);
// 				return;
// 			}

// 			if ($el.data('abort')) {
// 				$el.data('abort', false);
// 			} else {
// 				this.todos[this.indexFromEl(el)].title = val;
// 			}

// 			this.render();
// 		},
// 		destroy: function (e) {
// 			this.todos.splice(this.indexFromEl(e.target), 1);
// 			this.render();
// 		}
// 	};

var todos = util_store('todos-jquery');
var app_todoTemplate = Handlebars.compile($('#todo-template').html());
var app_footerTemplate = Handlebars.compile($('#footer-template').html());  
  
var app_init = function () {
			
// 			let app_todoTemplate = Handlebars.compile($('#todo-template').html());
// 			let app_footerTemplate = Handlebars.compile($('#footer-template').html());
			//this.bindEvents();
			app_registerEvents();

      new Router({
				'/:filter1': function (filter1) {
					todos.filter1 = filter1;
					app_render();
				}.bind(todos)
			}).init('/all');      
		};

var app_registerEvents = function() {					
      $('#new-todo').on('keyup', app_create);
	  $('#toggle-all').on('change', app_toggleAll);
			
      $('#footer').on('click', '#clear-completed',app_destroyCompleted);
	  $('#todo-list')
				.on('change', '.toggle', app_toggle)
				.on('dblclick', 'label', app_edit)
				.on('keyup', '.edit', app_editKeyup)
				.on('focusout', '.edit', app_update)
				.on('click', '.destroy', app_destroy);
};

var app_render = function () {
			var filteredTodos = app_getFilteredTodos();
			$('#todo-list').html(app_todoTemplate(filteredTodos));
			$('#main').toggle(filteredTodos.length > 0);
			$('#toggle-all').prop('checked', app_getActiveTodos().length === 0);
			app_renderFooter();
			$('#new-todo').focus();
			util_store('todos-jquery', todos);
		};
		
var app_renderFooter = function () {
			
			var todoCount = todos.length;
			var activeTodoCount = app_getActiveTodos().length;
			var template = app_footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util_pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: todos.filter1
			});

			$('#footer').toggle(todoCount > 0).html(template);
		};
var	app_toggleAll = function (e) {
			var isChecked = $(e.target).prop('checked');

			todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			app_render();
		};
var		app_getActiveTodos = function () {
      console.log('active', todos);
			return todos.filter( (todo) => {
				return !todo.completed;
			});
		};
var app_getCompletedTodos = function () {
      console.log('completed', todos);
			return todos.filter(function (todo) {
				return todo.completed;
			});
		};
var	app_getFilteredTodos = function () {
			if (todos.filter1 === 'active') {
				return app_getActiveTodos();
			}

			if (todos.filter1 === 'completed') {
				return app_getCompletedTodos();
			}
      console.log('todos', todos);
			return todos;
		};

var 	app_destroyCompleted = function () {
			todos = app_getActiveTodos();
			todos.filter1 = 'all';
			app_render();
		};
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
var		app_indexFromEl = function (el) {
			var id = $(el).closest('li').data('id');
			//var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		};

var 	app_create = function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			todos.push({
				id: util_uuid(),
				title: val,
				completed: false
			});

			$input.val('');

			app_render();
		};

var		app_toggle = function (e) {
			var i = app_indexFromEl(e.target);
			todos[i].completed = !todos[i].completed;
			app_render();
		};

var 	app_edit = function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();


		};
var 		app_editKeyup = function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		};

var		app_update = function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if (!val) {
				app_destroy(e);
				return;
			}

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				todos[app_indexFromEl(el)].title = val;
			}

			app_render();
		};
var 	app_destroy = function (e) {
			todos.splice(app_indexFromEl(e.target), 1);
			app_render();
		};
	

// 	App.init();


app_init();
});