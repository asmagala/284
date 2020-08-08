import React from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: '',
    };

    this.submitForm = this.submitForm.bind(this);
    //this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    this.socket = io.connect(process.env.NODE_ENV === "production" ? process.env.PORT : "http://localhost:8000");

    this.socket.on('updateData', tasks => {
      this.updateData(tasks);
    });

    this.socket.on('removeTask', idx => {
      //this.setState({ tasks: tasksNew});
      this.removeTaskLocally(idx);
    }); 


    this.socket.on('addTask', tasksNew => {
      this.addTask(tasksNew);
    }); 


  }

  addTask(task) {
    const { tasks } = this.state;
    tasks.push(task);
    this.setState(tasks);
    //this.socket.emit('addTask', task);
  }

  updateData(tasks) {
    this.setState({ tasks: tasks });
  }

  removeTask(id) {
    this.removeTaskLocally(id);
    this.socket.emit('removeTask', id);
  }

  removeTaskLocally(id) {
    const { tasks } = this.state;
    const tasksNew = tasks.filter(task => task.idx !== id);
    console.log('taskNew:', tasksNew);
    this.setState({tasks: tasksNew});
    console.log('this.state:', this.state);
  }

  changeValue(event) {
    this.setState({
      taskName: event.target.value,
    });
  }

  submitForm(event) {
    event.preventDefault();
    const task = { idx: v4(), name: this.state.taskName};
    this.addTask(task);
    this.socket.emit('addTask', task);
    this.setState({taskName: ''});
    //const textField = document.getElementById('task-name');
    //textField.value = '';
    /*
    const textField = document.getElementById('task-name');
    const id = v4();
    console.log('textField:', textField.value, 'id:', id);
    console.log('Oj, oj, oj...');
    textField.value = '';
    */
    }


  render() {
    return (
      <div className="App">
  
       <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <h2>Taski {this.state.taskName}</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {
            this.state.tasks.map((task) => {
              return (
                <li key={task.idx} className='task'>{task.name} - {task.idx}
                  <button onClick={() => this.removeTask(task.idx)} className="btn btn--red">Remove</button>
                </li>
              );
          })}
        </ul>

        <form id="add-task-form" onSubmit={this.submitForm} > 
          <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            value={this.state.taskName} 
            onChange={this.changeValue.bind(this)} 
          />
          <button  className="btn" type="submit">Add</button>
        </form>

      </section>
      </div>
    );
  };
};

export default App;
