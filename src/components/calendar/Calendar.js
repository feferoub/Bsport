import React from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import "./Calendar.css"

class Calendar extends React.Component {

	state = {
		dateContext: moment(),		// ce state gardera la date actuelle
		weekdays : [],				// liste des noms des jours de la semaine
		listOfDays : [],			// liste des jours du mois
		selectedDay: moment()		// ce state initialisé à la date actuelle aura ensuite 
									// en mémoire le jour sélectionné sur le calendrier
	}

	constructor(props){
		super(props);
		this.width = props.width || "350px";
		this.style = props.style || {};
		this.style.width = this.width;
	}

	weekdaysShort = moment.weekdaysShort();

 	// renvoie l'année actuelle
	year = () => {
		return this.state.dateContext.format("Y");
	}
	// renvoie le mois actuel
	month = () => {
		return this.state.dateContext.format("MMMM");
	}
	// renvoie le nombre de jour dans le mois actuel
	daysInMonth = () => {
		return this.state.dateContext.daysInMonth();
	}
	// renvoie le numéro du jour actuel
	currentDay = () => { 
		return this.state.dateContext.format("D");
	}
	// renvoie la position du premier jour du mois dans la semaine
	firstDayMonth = () => {
		let dateContext = this.state.dateContext;
		let firstDay = moment(dateContext).startOf("month").format("d");
		return firstDay;		
	}

	// La fonction est appelée lorsque l'utilisateur clique sur un jour du calendrier.
	// Elle appelle la fonction du même nom définie dans le composant parent App,
	// permettant donc de transmettre les infromations sur le jour sélectionné au composant App.
	onDayClick = (e, day) => {
		this.props.onDayClick && this.props.onDayClick(e, day);
	}

	// listBlankDays retourne une liste affichable en html affichant un espace vide, 
	// contenant autant d'éléments que de jours vides nécéssaires pour commencer le 
	// calendrier en adéquation avec le premier jour du mois courrant.
	listBlankDays = () => {
		let blanks = [];
		for(let i=0; i < this.firstDayMonth(); i++) {
			blanks.push(
				<td key={i*100} className="emptySlot">{""}</td>
			);
		}
		return blanks;
	}

	// listMonthDays renvoie une liste affichable en html contenant tous les jours du mois.
	listMonthDays= () => {
		let daysInMonth = [];
		for(let d = 1; d <= this.daysInMonth(); d++) {
			
			// Si le jour lu est le jour actuel ou le jour sélectionné, 
			// on les marque d'une classe spéciale.
			let className = "";
			if( d == this.state.selectedDay) { className = "selected-day" ;}
			else if( d == this.currentDay()) { className = "day current-day";}
			else { className = "day"}

			// L'état du composant est changé dans le bouton pour permettre de rebuild
			// le composant lorsque l'utilisateur sélectionne un nouveau jour.
			daysInMonth.push(
				<td key={d}>
					<span onClick={(e) => {this.onDayClick(e,d); 
											this.setState({selectedDay : d});}} 
						  className={className}>{d}
					</span>
				</td>
			);
		}
		return daysInMonth;
	}

	// A partir d'une liste contenant les jours vides et les jours du mois, cette fonction permet
	// de créer une liste contenant des sous listes de semaines.
	organizeCalendarInWeeks = (rawCalendar) => {
		let calendarRows =[];
		let weekCells = [];

		rawCalendar.forEach((day, i) => {
			if ((i%7)!== 0){
				weekCells.push(day)
			} else {
				let insertRow = weekCells.slice();
				calendarRows.push(insertRow);
				weekCells = [];
				weekCells.push(day);
			}
			if (i === rawCalendar.length - 1){
				let insertRow = weekCells.slice();
				calendarRows.push(insertRow);
			}
		});
		return(calendarRows);
	}

	// Permet d'ajuster la liste des semaines du mois pour obtenir l'affichage par lignes voulu
	modifyCalendarForDisplay = (calendarRows) => {
		this.state.listOfDays = calendarRows.map((d, i) => {
			return(
				<tr key = {i*100}>
					{d}
				</tr>
			);
		})

	}

	// createCalendar appelle successivement les fonctions précédentes pour build le calendrier.
	createCalendar() {

		// initialise la liste des jours de la semaine pour l'affichage
		this.state.weekdays = this.weekdaysShort.map((day) => {
			return (
				<td key={day} className="week-day">{day}</td>
				)
		});

		let blanks = this.listBlankDays();

		let daysInMonth = this.listMonthDays();

		let rawCalendar = [...blanks, ...daysInMonth];

		let calendarRows = this.organizeCalendarInWeeks(rawCalendar);

		this.modifyCalendarForDisplay(calendarRows);


	}


	render () {
		this.createCalendar();
		return (
			<div className="calendar-container" style = {this.style}>
				<h1 className="calendar-header">
					{this.month()} {this.year()}
				</h1>
				<table className = "calendar">
					<tbody>
						<tr className="week">
							{this.state.weekdays}
						</tr> 
						{this.state.listOfDays} 
					</tbody>
				</table>
			</div>
			);
	}
}

export default Calendar;