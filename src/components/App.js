import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    if (typeof window.ethereum === 'undefined') {
      window.alert('Please install MetaMask first');
    } else {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const netId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();
      const firstAccount = accounts[0];
      if (typeof firstAccount === 'undefined') {
        window.alert('Please login to MetaMask first');
      } else {
        const ethBalance = await web3.eth.getBalance(firstAccount);
        console.log("Working with network ID: " + netId + ". First account: " + accounts[0]);
        this.setState({ account: accounts[0], ethBalance: ethBalance, web3: web3 });
      }
      try {
        const tokenContract = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
        const dBankAddress = dBank.networks[netId].address;
        const dBankContract = new web3.eth.Contract(dBank.abi, dBankAddress);
        const tokenBalance = await tokenContract.methods.balanceOf(this.state.account).call();
        this.setState({ token: tokenContract, dbank: dBankContract, dBankAddress: dBankAddress, tokenBalance: tokenBalance });
        console.log("Bank address:", dBankAddress);
      } catch (e) {
        console.log("Failed to load contracts", e);
        window.alert("Contracts not deployed to the current network");
      }
    }
  }

  async deposit(amount) {
    amount = this.state.web3.utils.toWei(amount);
    console.log("Requested to deposit: " + amount);
    if (this.state.dbank !== "undefined") {
      try {
        await this.state.dbank.methods.deposit().send({ value: amount.toString(), from: this.state.account });
      } catch (e) {
        console.log("Failed to deposit because: ", e)
      }
    }

  }

  async withdraw(e) {
    e.preventDefault();
    if (this.state.dbank !== "undefined") {
      try {
        await this.state.dbank.methods.withdraw().send({ from: this.state.account });
      } catch (e) {
        console.log("Failed to withdraw because: ", e)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      ethBalance: 0,
      tokenBalance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={dbank} className="App-logo" alt="logo" height="32" />
            <b>dBank</b>
          </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br></br>
          <h1>Welcome to dBank</h1>
          <h2>Address: {this.state.account}</h2>
          <h2>ETH Balance: {this.state.ethBalance} WEI</h2>
          <h2>Token Balance: {this.state.tokenBalance} ZZZ WEI</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab eventKey="deposit" title="Deposit">
                    <div>
                      <br />
                      Enter deposit amount (min. is 0.01 ETH)
                      <br />
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        let amount = this.depositAmount.value;
                        this.deposit(amount);
                      }}>
                        <div className="form-group mr-sm-2">
                          <br />
                          <input id="depositAmount" step="0.01" type="number" className="form-control form-control-md" placeholder="amount..." required ref={(input) => { this.depositAmount = input }} />
                        </div>
                        <button type="submit" className="btn btn-primary">DEPOSIT</button>
                      </form>
                    </div>
                  </Tab>
                  <Tab eventKey="withdraw" title="Withdraw">
                    <div>
                      <br />
                      Click for withdrawing your funds and interest
                      <br />
                      <button type="submit" className="btn btn-primary" onClick={(e) => this.withdraw(e)}>WITHDRAW</button>

                    </div>
                  </Tab>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;