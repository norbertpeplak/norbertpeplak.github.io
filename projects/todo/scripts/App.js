 class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            clicks: 0
        };
    }

    AddTodo = () => {
        let todos = this.state.todos;
        let clicks = this.state.clicks + 1;
        todos.push('Task number ' + clicks);
        this.setState({
            clicks: clicks,
            todos: todos
        });

    }
    
    RemoveTodo = () => {
        if (this.state.clicks > 0) {
            let todos = this.state.todos;
            let clicks = this.state.clicks - 1;
            todos.pop();
            this.setState({
                clicks: clicks,
                todos: todos
            });
        }
    }
    
    ClearTodo = () => {
        this.setState({
            clicks: 0,
            todos: []
        });
    } 

    render() {
        return (
          <div className="container">
            <h1 className="heading">TODO app</h1>
            <button className="btn" onClick={this.AddTodo}> Add</button>
            <button className="btn" onClick={this.RemoveTodo}> Remove</button>
            <button className="btn" onClick={this.ClearTodo}> Clear</button>
            <ul className="todo-list">
              {this.state.todos.map((todo, index) => {
                return (
                  <li className="todo-item" key={index} todo={todo}>
                    {todo}
                  </li>
                );
              })}
            </ul>
          </div>
        );
            }
    }

ReactDOM.render(<App />, document.getElementById("app"));