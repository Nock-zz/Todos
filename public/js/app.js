/*global jQuery, Handlebars, Router */
// jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		uuid: function () {
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
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			this.todos = util.store('todos-jquery');
			this.todoTemplate = Handlebars.compile((document.querySelector('#todo-template')).innerHTML);
			this.footerTemplate = Handlebars.compile((document.querySelector('#footer-template')).innerHTML);
			this.bindEvents();

      new Router({
				'/:routeFilter': function (routeFilter) {
					this.routeFilter = routeFilter;
					this.render();
				}.bind(this)
			}).init('/all');      
		},
		bindEvents: function () {
      //$ ('#new-todo').on('keyup', this.create.bind(this));
      (document.querySelector('#new-todo')).addEventListener('keyup', this.create.bind(this));
	  //$ ('#toggle-all').on('change', this.toggleAll.bind(this));
      (document.querySelector('#toggle-all')).addEventListener('change', this.toggleAll.bind(this));
      //$ ('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
      (document.querySelector('#footer')).addEventListener('click', this.destroyCompleted.bind(this));
 	  (document.querySelector('#todo-list')).addEventListener('change', this.toggle.bind(this));
 	  (document.querySelector('#todo-list')).addEventListener('dblclick', this.edit.bind(this));
 	  (document.querySelector('#todo-list')).addEventListener('keyup', this.editKeyup.bind(this));
 	  (document.querySelector('#todo-list')).addEventListener('focusout', this.update.bind(this));
 	  (document.querySelector('#todo-list')).addEventListener('click', this.destroy.bind(this));
//	  		$ ('#todo-list')
//      			.on('change', '.toggle', this.toggle.bind(this))
//      			.on('dblclick', 'label', this.edit.bind(this))
//      			.on('keyup', '.edit', this.editKeyup.bind(this))
//      			.on('focusout', '.edit', this.update.bind(this))
//      			.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
			var todos = this.getFilteredTodos();
			//$ ('#todo-list').html(this.todoTemplate(todos));
			document.querySelector('#todo-list').innerHTML = this.todoTemplate(todos);
// 			$ ('#main').toggle(todos.length > 0);
			if (todos.length > 0) { 
			         document.querySelector('#main').style.display = 'block';
			} else {
				     document.querySelector('#main').style.display = 'none';               
			} 
// 			$ ('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
			(this.getActiveTodos().length === 0) 
			? document.querySelector('#toggle-all').setAttribute('checked', 'checked') 
			: document.querySelector('#toggle-all').removeAttribute('checked');
			util.store('todos-jquery', this.todos);
			this.renderFooter();
// 			$ ('#new-todo').focus();
			document.querySelector('#new-todo').focus();
			
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
			var templateOutputHTML = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: this.routeFilter
			});

// 			$ ('#footer').toggle(todoCount > 0).html(templateOutputHTML);
//       document.querySelector('#footer').innerHTML = '';
           
        if (todoCount > 0) { document.querySelector('#footer').innerHTML = templateOutputHTML;
		    document.querySelector('#footer').style.display = 'none';
		    document.querySelector('#footer').style.display = 'block';
        } else {
          document.querySelector('#footer').style.display = 'none';
        }
//	    if (todoCount === 0) document.querySelector('#footer').innerHTML = ''; 
      
// 		    if (activeTodoCount == 0) {document.querySelector('#toggle-all').hasAttribute('checked') && document.querySelector('#toggle-all').removeAttribute('checked')
// 		    } else { !document.querySelector('#toggle-all').hasAttribute('checked') && document.querySelector('#toggle-all').setAttribute('checked')}
// 			document.querySelector('#todo-list').style.display = 'none';
// 			document.querySelector('#todo-list').style.display = 'block';			
		    

		},
		toggleAll: function (e) {
// 			console.log(document.querySelector('#toggle-all'));
// 			var isChecked = $ ( e.target).prop('checked') ;
// 			console.log(isChecked);
// 			console.log( (e.target).checked);
			if (e.target.matches('#toggle-all')) {
			var isChecked = (e.target).checked;
			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});
			}

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.routeFilter === 'active') {
				return this.getActiveTodos();
			}

			if (this.routeFilter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function (e) {
			
			if (e.target.innerText == "Clear completed") {
			this.todos = this.getActiveTodos();
			this.routeFilter = 'all';
			this.render();
			}
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
// 			var id = $(el).closest('li').data('id');
			var id = el.closest('li').getAttribute('data-id');
// 			console.log('id', id);
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
// 					console.log('indexFromEl', i);
					return i;
				}
			}
		},
		create: function (e) {
			if ((e.target).matches('#new-todo')) {
      var input = e.target;
			var val = input.value.trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			this.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

			input.value = '';
      }
			this.render();
		},
		toggle: function (e) {
// 			console.log(e.target);
			if (e.target.matches('#todo-list .toggle')) {
			var i = this.indexFromEl(e.target);
// 			console.log(i);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
			}
		},
		edit: function (e) {

			if (e.target.matches('#todo-list label')) {
			let closestParent = e.target.offsetParent;
			closestParent.classList.add('editing');
			let showInput = closestParent.lastElementChild;
			showInput.focus();
			//var $input = $ (e.target).closest('li').addClass('editing').find('.edit');
			//$input.val($input.val()).focus();
			}
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				e.target.setAttribute('abort', 'abort');
				e.target.blur();
			}
		},
		update: function (e) {
			if (e.target.matches('#todo-list .edit')) {
			var el = e.target;
			//var $el = $ (el);
			//var val = $el.val().trim();
			var val = el.value.trim();
			if (!val) {
				e.target.classList.add('destroy');
				this.destroy(e);
				return;
			}


			if (el.hasAttribute('abort')) {
				el.removeAttribute('abort');
			} else {
				this.todos[this.indexFromEl(el)].title = val;
			}

			this.render();
			}
		},
		destroy: function (e) {
			//console.log(e.target);
			if (e.target.matches('#todo-list .destroy')) {
//			console.log('this.indexFromEl(e.target)', this.indexFromEl(e.target));	
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		    } 
		}
	};

	App.init();
// });