import React from "react"
import "./ActivityList.css"
import moment from 'moment';


// Le composant ActivityList contient la liste des activités. Celles de la semaine courante lors du chargement,
// et celles du jour sélectionné si il y a lieu.
class ActivityList extends React.Component {

	// activities stocke la numéro des activités de la liste à afficher
	// activitiesDict est un dictionnaire de correspondance entre les numéros des activités et leur
	// nom. Il est chargé une seule fois avant la construction du monposant.
	state = {
				activitiesDict : {},
				activities : [],
				currentDay : moment().format("D"),
      			currentDayPosition: moment().isoWeekday(),
      			currentYearMonth : moment().format("YYYY") + "-" + moment().format("MM")
			}

	constructor(props){
		super(props);
		this.width = props.width || "350px";
		this.style = props.style || {};
		this.style.width = this.width;
	}


	// displayActivities insère dans le state activities le code html qui sera affiché.
	// La fonction prend 3 arguments: - requestResult, les résultats de la requête à l'API
	//								  - displayInfo, le type de liste à afficher (soit les activités
	// 									de la semaine soit celles du jour courant)
	//								  - daySelected, le jour sélectionné, utilisé dans le cas où l'on affiche
	// 									les activités du jour
	displayActivities = (requestResult, displayInfo, daySelected) => {
		let newActivities=[];
		if (displayInfo === "weekSelection") {
			newActivities = [	
								<h1 key="0 "className="activity-header">Activités de la semaine 
								du {(parseInt(this.state.currentDay) - parseInt(this.state.currentDayPosition)+1).toString()}
								</h1>
							];
		}
		if (displayInfo === "daySelection") {
			newActivities = [<h1 key="0 " className="activity-header">Activités du {daySelected}</h1>];
		}

		for(let i=0; i<requestResult.length; i++){
			newActivities.push(
				<div key = {i*100} className="activity-wrapper">
					<div key= {i*100} className="activity">{this.state.activitiesDict[requestResult[i]["activity"]]}</div>
				</div>
			);
		}

		// Mise à jour du state activities avec les nouvelles activités à afficher.
		this.setState(
			{activities : newActivities}
		)		
	}


	// fillDictionnary prend en argument le résultat de la requête à l'API pour les correspondances entre
	// numéro d'activité et description et remplit activitiesDict. Cette méthode est appelée plusieurs fois
	// car l'API segmente les résultats par page.
	fillDictionnary = (requestResult) => {
		let dictionnary = this.state.activitiesDict;
		for(let i=0; i<requestResult.length; i++){
			if(requestResult[i]["activities"].length>0){
				for(let activityCompt=0; activityCompt<requestResult[i]["activities"].length; activityCompt++){
					dictionnary[(requestResult[i]["activities"][activityCompt]).toString()]=requestResult[i]["name"];						}
				}
			}
		this.setState(
			{activitiesDict : dictionnary }
		)
	}

	// getDictionnary itère les requêtes sur toutes la pages disponibles sur l'API
	getDictionnary = () => {
		var successfullRequest = true;
		let pageNumber = 0;
		// le but de cette boucle while est normalement de définir une condition d'arrêt lorsque
		// la requête ne renvoie rien et qu'on a donc récupéré toutes les informations. Cependant
		// la variable succesfullRequest ne peut pas être modifiée dans la requête, je crois 
		// comprendre que c'est à cause de l'asynchronisation des requêtes. J'approfondirai si j'ai le
		// temps.
		while (successfullRequest && pageNumber <33){
			pageNumber += 1;
			successfullRequest = fetch('https://bsport.io/api/v1/meta-activity/?page=' + pageNumber)
				.then(res => { if(res.ok) return res.json();
							   else {
							   	throw new Error(res.statusText); 
							   }  // lève une erreur si la réponse est incorrecte
    			})
    			.then(json => {
						this.fillDictionnary(json["results"]);
						return true
								} 
					  )
				.catch(ex => {return false; })
		}
	}

	// Appelle la fonction displayActivities pour générer la liste des activités de la semaine. 
	// On utilise la prop currentDayPosition, qui renvoie la position du jour actuel dans la semaine,
	// pour obtenir la semaine courante.
	componentWillMount() {
		this.getDictionnary();
		fetch('https://bsport.io/api/v1/offer/?min_date=' + this.state.currentYearMonth +'-'+(parseInt(this.state.currentDay) - parseInt(this.state.currentDayPosition)+1).toString()+
			'&max_date=' + this.state.currentYearMonth +'-'+ (parseInt(this.state.currentDay) + parseInt(this.state.currentDayPosition) - 6).toString())
			.then(res => res.json())
			.then(json => {
				this.displayActivities(json["results"],"weekSelection",parseInt(this.state.currentDay));
		})
	}

	// Lors d'un click, appelle displayActivities pour changer la liste des activités précédentes et les
	// remplacer par celles du jour selectionné
	componentWillReceiveProps(newProps) {
		fetch('https://bsport.io/api/v1/offer/?min_date=' + this.state.currentYearMonth +'-'+(newProps.selectedDay).toString()
			+'&max_date=' + this.state.currentYearMonth +'-'+ (newProps.selectedDay).toString())
			.then(res => res.json())
			.then(json => {
				this.displayActivities(json["results"],"daySelection",newProps.selectedDay);
		})	
  	}


	render() {
		return(
			<div className="gridContainer" style={this.style}>
				{this.state.activities}
			</div>
			)
	}
}

export default ActivityList;