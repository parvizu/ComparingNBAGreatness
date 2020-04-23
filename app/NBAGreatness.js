import React from 'react';
import ReactDOM from 'react-dom';

import Menu from './Menu';
import Player from './Player';
import Visualization from './Visualization';


export default class NBAGreatness extends React.Component {
	constructor(props) {
		super(props);

		['changeViewMode', 'getTimeSpan','handlePlayerSelect','closeImage','getPlayerList'].map(k=> this[k] = this[k].bind(this));

		const defaultPlayers = ['jordan','lebron','kobe'];
		this.state = {
			"selected": defaultPlayers,
			"vizMode": 'career',
			"timespan": this.getTimeSpan(defaultPlayers),
			"popup": "hide",
			"img": ""
		}
	}

	changeViewMode(value) {
		this.setState({
			"vizMode": value
		});
	}

	getTimeSpan(selectedPlayers) {
		let start = 2017,
			end = 1,
			years = [],
			ages = [], 
			startAge = 60,
			endAge = 1,
			min, max, 
			careerYears = 0,
			players = [];

		players = this.props.data.filter(p => {
			return selectedPlayers.indexOf(p.nickname) !== -1;
		});

		players.forEach((p,i) => {
			years = Object.keys(p.awards);
			min = Math.min.apply(Math, years);
			max = Math.max.apply(Math, years);
			if (min < start) {
				start = min;
			}

			if (max > end) {
				end = max;
			}

			if (years.length > careerYears) {
				careerYears = years.length;
			}

			if (startAge > p.age.first) {
				startAge = p.age.first;
			}

			if (endAge < p.age.last) {
				endAge = p.age.last;
			}
		});

		return {
			"start": start,
			"end": end,
			"years": careerYears,
			"age": {
				"first": startAge,
				"last": endAge
			}
		};
	}

	handlePlayerSelect(e) {
		const position = this.state.selected.indexOf(e.nickname);
		if (position <0) {
			this.state.selected.unshift(e.nickname);
		} else {
			this.state.selected.splice(position,1);
		}

		const newTimeSpan = this.getTimeSpan(this.state.selected);

		this.setState({
			selected: this.state.selected,
			timespan: newTimeSpan
		});
		
	}

	closeImage() {
		this.setState({
			"popup": "hide"
		});
	}

	getPlayerList() {
		const players = this.props.data.map((player) => {
			const isSelected = this.state.selected.indexOf(player.nickname) !== -1 ? 'selected' : '';
			return (
				<Player key={player.nickname+"-key"} player={player} onPlayerSelect={this.handlePlayerSelect} isSelected={isSelected} />
			)
		});

		return (
			<div id="jerseys">
				{players}
			</div>
		);
	}

	render() {
		const nbaLogo = 'img/nbaLogo.png',
			instructions = this.state.selected.length !== 0 ? 'hide' : '',
			twitterLink = 'img/twitter-256.png',
			helpIcon = 'img/helpIconWhite.png';

		return (
			<div id='app'>
				<div id="header">
					<div id="updated">v2.0 (04/18/2020)</div>
					<img src={nbaLogo} /> 
					<h1> Comparing Greatness</h1> <a href="http://www.parvizu.com" target="_blank" id="madeby">by Pablo Arvizu</a> <a href="https://twitter.com/arvizualization" target="_blank" id="twitterLink"><img src={twitterLink} /></a>
					<div className="addthis_sharing_toolbox"></div>
				</div>
				<div id="blurb">
					<p>
						Not all Basketball players are the same. Only a few of them have the drive and talent to rise to heights never seen before. Those we call the 'Great Ones'. But the path to greatness was different for each one. Some peaked very early, some took time to find their groove, others redefined the words longevity and success, while some were otherworldly throughout. 

						Explore how some of the best players in NBA history stack up against each other. See how their careers unfolded by looking at when the awards and titles were won, and how maturity and experience played a part in their success. Get a chance to compare the greatest this game has ever seen, whether they be past or rising stars.
					</p>
				</div>
				{ this.getPlayerList()}
				
				<Menu changeViewMode={this.changeViewMode} selected={this.state.vizMode} />
				<div id="vizLegend">
					<div id="legendSection">
						<div className="legendScale">
							<h5 className="selectionType">Most Valuable Player</h5>
						</div>
						<div className="legendScale">
							<h5>&nbsp;</h5>
							<div className="mvp firstteam"></div>
						</div>

						<div className="legendScale">
							<h5 className="selectionType">All NBA Team</h5>
						</div>
						<div className="legendScale">
							<h5>1st</h5>
							<div className="allnba firstteam"></div>
						</div>
						<div className="legendScale">
							<h5>2nd</h5>
							<div className="allnba secondteam"></div>
						</div>
						<div className="legendScale">
							<h5>3rd</h5>
							<div className="allnba thirdteam"></div>
						</div>

						<div className="legendScale">
							<h5 className="selectionType">All Defensive Team</h5>
						</div>
						<div className="legendScale">
							<h5>1st</h5>
							<div className="alldefensive firstteam"></div>
						</div>
						<div className="legendScale">
							<h5>2nd</h5>
							<div className="alldefensive secondteam"></div>
						</div>

						<div className="legendScale">
							<h5 className="selectionType">All Star</h5>
						</div>
						<div className="legendScale">
							<h5>&nbsp;</h5>
							<div className="allstar firstteam"></div>
						</div>
					</div>
				</div>
				
				
				<Visualization players={this.state.selected} data={this.props.data} mode={this.state.vizMode} timespan={this.state.timespan} images={this.props.images}/>
				
				<div className={instructions} id="instructions" >
					<h1>To compare, select one or more players by clicking on their jerseys above</h1>
				</div>
				<div className="footer">
					<a href="https://twitter.com/arvizualization" className="twitter-follow-button" data-show-count="false">Follow @sirgalahad88</a>&nbsp;&nbsp;<span className="vertBar">|</span>&nbsp;&nbsp;
					<a className="footer-link" href="http://www.parvizu.com" target="_blank" >www.parvizu.com</a>&nbsp;&nbsp;<span className="vertBar">|</span>&nbsp;&nbsp;
					<a className="footer-link" href="http://www.morethanjustsports.com" target="_blank" >www.morethanjustsports.com</a> &nbsp;&nbsp;<span className="vertBar">|</span>&nbsp;&nbsp;
					<a>Image Credits: Logos and Jerseys are property of the ©NBA </a>
				</div>
			</div>
		);
	}
}

