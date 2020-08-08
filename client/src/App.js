import React from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      tName: 'Aaaaaaa',
    };
  }

  componentDidMount() {
    this.socket = io.connect(process.env.NODE_ENV === "production" ? process.env.PORT : "http://localhost:8000");

    // TESTOWE DODANIE DANYCH DO STATE.TASKS
    this.socket.on('updateData', tasks => {
      this.updateData(tasks);
    });

    this.socket.on('removeTask', tasksNew => {
      this.setState({ tasks: tasksNew});
    }); 

    //const {tasks} = this.state;
    //tasks.push({idx: '333', name: 'Shopping something',});
    //tasks.push({idx: 'aard', name: 'Go out with the dog',});
    //console.log('tasks:', tasks);
    //console.log('this.state:', this.state);
    //console.log(this.state.tasks[0]);
        
    //this.setState({...tasks, tName: 'Bbbbbb'});

    
    
    // DO USUNIĘCIA

    
  }

  updateData(tasks) {
    this.setState({ tasks: tasks });
  }

  removeTask(id) {
    const { tasks } = this.state;
    const tasksNew = tasks.filter(task => task.idx !== id);
    console.log('taskNew:', tasksNew);
    this.setState({tasks: tasksNew});
    this.socket.emit('removeTask', id);
    console.log('this.state:', this.state);
  }

  submitForm(event) {
    event.preventDefault();
    /*
    const { taskName } = this.state;

    const task = {
      id: v4(),
      name: taskName,
    }
      */
     const textField = document.getElementById('task-name');
     const id = v4();
     console.log('textField:', textField.value, 'id:', id);
     console.log('Oj, oj, oj...');
     textField.value = '';
    }


  render() {
    return (
      <div className="App">
  
       <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <h2>Taski {this.state.tName}</h2>
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

        <form id="add-task-form" onClick={this.submitForm.bind(this)} > 
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button  className="btn" type="submit">Add</button>
        </form>

      </section>
      </div>
    );
  };
};

export default App;
