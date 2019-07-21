import React from 'react';
import './App.css';
import Calendrier from "./components/calendar/Calendar.js"
import ActivityList from "./components/activityList/ActivityList.js"
import moment from 'moment';

class App extends React.Component {

  state = {
    selectedDay : moment().format("D"),
    currentDay : moment().format("D"),
    currentDayPosition: moment().isoWeekday()
  }


// La fonction onDayCLick est appelée lorsque l'utilisateur clique sur un jour du calendrier. Elle est
// initialement appelée au sein du composant fils calendar, et est passée dans les props pour changer
// l'état du composant App. Ce changement d'état sera transmis au composant activity qui pourra
// alors charger les activités du jour.

  onDayClick = (e,day) => {
    this.setState(
      {selectedDay : day,
      currentDay : moment().format("D"),
      currentDayPosition: moment().isoWeekday()
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Calendrier onDayClick={(e, day) => this.onDayClick(e,day)} />
        <ActivityList selectedDay = {this.state.selectedDay} 
                      currentDay = {this.state.currentDay} 
                      currentDayPosition = {this.state.currentDayPosition}/>
      </div>
    );
  }
}

export default App;
