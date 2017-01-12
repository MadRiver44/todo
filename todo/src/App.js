import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      todos: {}
    };

    this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios({
      url: '/todos.json',
      baseURL: 'https://todo-app-f7821.firebaseio.com/',
      method: "GET"
    }).then((response) => {
      console.log(response.data)
      this.setState({ todos: response.data });
    }).catch((error) => {
      console.log(error);
    });
  }

  createTodo(todoText) {
    let newTodo = { title: todoText, createdAt: new Date() };

    axios({
      url: '/todos.json',
      baseURL: 'https://todo-app-f7821.firebaseio.com/',
      method: "POST",
      data: newTodo
    }).then((response) => {
      let todos = this.state.todos;
      let newTodoId = response.data.name;
      todos[newTodoId] = newTodo;
      this.setState({ todos });
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteTodo(todoId){
    axios({
      url:`/todos/${todoId}.json`,
      baseURL: 'https://todo-app-f7821.firebaseio.com/',
      method: "DELETE",
    }).then((resp) => {
      let todos = this.state.todos;
      delete todos[todoId];
      this.setState( {todos: todos} )
    }).catch((error) =>{
      console.log(error);
    })
  }

  selectTodo(todoId) {
    this.setState( { currentTodo: todoId} )

  }

  handleNewTodoInput(event) {
    if (event.charCode === 13) {
      this.createTodo(event.target.value);
      event.target.value = "";
    }
  }


  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <input className="w-100" placeholder="What do you have to do?" onKeyPress={ this.handleNewTodoInput } />
      </div>
    );
  }

  renderSelectedTodo(todoId) {
    let content;
    if(this.state.currentTodo) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      content = (
        <div>
          <h1>{currentTodo.title} </h1>
        </div>
        );
    }
    return content;
  }

  renderTodoList() {
    let todoElements = [];

    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2" onClick={ () => this.selectTodo(todoId) }>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button
            className="ml-4 btn btn-link"
            onClick={ () => { this.deleteTodo(todoId) } }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }


    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
          <div className="col-6 px-4">{this.renderSelectedTodo()}</div>
        </div>
      </div>
    );
  }
}

export default App;
