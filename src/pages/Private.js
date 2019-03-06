import React, { Component } from 'react'
import { withAuth } from '../components/AuthProvider';
import task from '../lib/task-service';
import FollowUpCard from '../components/followupCard';
import Chart from '../components/Chart';

class Private extends Component {
  state = {
    callsCounter: '',
    emailsCounter: '',
    meetingsCounter: '',
    contacts: '',
    tasks: '',
    won: '',
    lost: '',
    conversionratio: 0,
    tasksdone: [],
  }

  handleColorBox = (number) => {
    if (number !== 0) {
      return "smallbox pink"
    } else {
      return "smallbox green"
    }
  }

  componentDidMount = () => {
    const userId = this.props.user._id;
    task.showTasksList(userId)
      .then((data) => {
        let donefilter = data.filter(task => task.status === "done");
        let wonfilter = data.filter(task => task.status === "won");
        let lostfilter = data.filter(task => task.status === "lost");
        let ratio = wonfilter.length / data.length;
        let counterObject = {
          calls: 0,
          emails: 0,
          meetings: 0,
          won: wonfilter.length,
          lost: lostfilter.length,
          ratio: ratio,
          done: donefilter
        }
        data.forEach((task) => {
          if (task.action === "call" && task.status === "pending") {
            return counterObject.calls++
          } else if (task.action === "email" && task.status === "pending") {
            return counterObject.emails++
          } else if (task.action === "meeting" && task.status === "pending") {
            return counterObject.meetings++
          }
        });
        return counterObject;
      })
      .then((counterObject) => {
        return this.setState({
          callsCounter: counterObject.calls,
          emailsCounter: counterObject.emails,
          meetingsCounter: counterObject.meetings,
          contacts: this.props.user.contacts.length,
          tasks: counterObject.calls + counterObject.emails + counterObject.meetings,
          won: counterObject.won,
          lost: counterObject.lost,
          conversionratio: counterObject.ratio,
          tasksdone: counterObject.done,
        })
      })
      // .then(() => {
      //   console.log(this.state);
      // })
      .catch(error => console.log(error))
  }

  render() {
    const { tasksdone } = this.state;
    return (
      <div>
        {/* <h1>Welcome {user.name}</h1> */}
        <h2>My schedule</h2>
        <div className="flex-small-boxes">
          <div className={this.handleColorBox(this.state.callsCounter)}>
            <h1>{this.state.callsCounter}</h1>
            <p>CALLS</p>
          </div>
          <div className={this.handleColorBox(this.state.emailsCounter)}>
            <h1>{this.state.emailsCounter}</h1>
            <p>EMAILS</p>
          </div>
          <div className={this.handleColorBox(this.state.meetingsCounter)}>
            <h1>{this.state.meetingsCounter}</h1>
            <p>MEETINGS</p>
          </div>
        </div>
        <h2>My stats</h2>
        <div className="flex-small-boxes">
          <div className="middlebox">
            <h1 className="middleboxheader">{this.state.contacts}</h1>
            <p className="middleboxtext">CONTACTS</p>
          </div>
          <div className="middlebox">
            <h1 className="middleboxheader pink-text">{this.state.tasks}</h1>
            <p className="middleboxtext">TASKS</p>
          </div>
        </div>

        <div className="chart-text-container">
          <Chart rate={Math.round(this.state.conversionratio * 100)} />
          <div className="chartdetails">
            <h1 className="chartheader">{Math.round(this.state.conversionratio * 100)}%</h1>
            <p className="charttext">CONVERSION RATE</p>
          </div>
        </div>

        <div className="flex-small-boxes">
          <div className="middlebox">
            <h1 className="middleboxheader">{this.state.won}</h1>
            <p className="middleboxtext">WON</p>
          </div>
          <div className="middlebox">
            <h1 className="middleboxheader pink-text">{this.state.lost}</h1>
            <p className="middleboxtext">LOST</p>
          </div>
        </div>

        <h1>Follow up</h1>
        {
          tasksdone.map((task) => {
            return <FollowUpCard id={task._id} action={task.action} to={task.toName} status={task.status} donedate={task.updated_at} reload={() => this.componentDidMount()} />
          })
        }
      </div >

    )
  }
}

export default withAuth()(Private);