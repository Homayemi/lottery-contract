import "./App.css";
import React from "react";
import lottery from './lottery';
import web3 from "./web3";

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on trasaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'you have been entered! '});
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...'})
    
    await lottery.methods.pickWinner().send({
        from: accounts[0]
    })

    this.setState({ message: 'you have been entered! '})
  }

  render() {
    return (
      <div className="body">
        <div className="page-title">
        <h2>Lottery Contract</h2></div>

      <div>
        <p>This contract is managed by {this.state.manager} and  {this.state.players.length} people have currently entered the contract all 
            competing to win {web3.utils.fromWei(this.state.balance, 'ether' )} ether!
        </p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Write an amount of ether to enter</label>
            <input 
            value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form> 

        <hr />

          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>
        
        <hr />
        
        <h1>{this.state.message}</h1></div>
      
      </div>
    );
  }
}
export default App;
