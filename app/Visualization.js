import React from 'react';
import PlayerVisualization from './PlayerVisualization';

export default class Visualization extends React.Component {

	constructor(props) {
		super(props);

		['getYearsRange','getPlayerData','getPlayerDataByCalendarYear','getPlayerDataByCareerYear','getPlayerDataByAge'].map(k => this[k] = this[k].bind(this));
		this.state = {};
	}

	
	getYearsRange() {
		var calendar = [],
			years = [],
			ages = [];

		for (var i = this.props.timespan.start; i<=this.props.timespan.end; i++) {
			calendar.push(i);
		}

		for (var y = 1; y<=this.props.timespan.years; y++) {
			years.push(y);
		}

		if (typeof this.props.timespan.age !== "undefined") {
			for (var a = this.props.timespan.age.first; a <= this.props.timespan.age.last; a++) {
				ages.push(a);
			}	
		}

		return {
			"calendar": calendar,
			"year": years,
			"age": ages
		}
	}
	
	getPlayerData(nickname) {
		for (var i = 0; i< this.props.data.length; i++) {
			if (this.props.data[i].nickname === nickname) {
				return this.props.data[i];
			}
		}
		return {};
	}

	getPlayerDataByCalendarYear(playerData) {
		let result = [];
		const yearsPlayed = Object.keys(playerData);
		yearsPlayed.forEach(year => {
			playerData[year].forEach(award => {
				result.push({
					'year':parseInt(year),
					'award': award
				});
			});
		})
		return result;
	}

	getPlayerDataByCareerYear(playerData) {
		var result = [];
		const yearsPlayed = Object.keys(playerData);
		yearsPlayed.forEach((year,i) => {
			playerData[year].forEach(award => {
				result.push({
					'year': i+1,
					'award': award
				});
			});
		})
		return result;
	}

	getPlayerDataByAge(playerData, rookieAge) {
		const yearsPlayed = Object.keys(playerData);
		let result = [],
			firstYear = parseInt(yearsPlayed[0]);
		
		yearsPlayed.forEach(year => {
			const age = rookieAge + parseInt(year) - firstYear;
			playerData[year].forEach(award => {
				result.push({
					'year': age,
					'award': award
				});
			})
		})

		return result;
	}

	render() {
		const timespan = this.getYearsRange();

		let playersCharts = this.props.players.map(player => {
			let playerData = this.getPlayerData(player);

			let playerStats;
			if (this.props.mode === 'career') {
				playerStats = this.getPlayerDataByCareerYear(playerData.awards)
			} else if (this.props.mode === 'calendar') {
				playerStats = this.getPlayerDataByCalendarYear(playerData.awards)
			} else if (this.props.mode === 'age') {
				playerStats = this.getPlayerDataByAge(playerData.awards, playerData.age.first)
			}

			const mode = this.props.mode === 'career' ? 'year' : this.props.mode;

			return (
				<PlayerVisualization playerAwards={playerData.awards} 
					mode={this.props.mode} 
					key={player} 
					timespan={timespan} 
					yearsPlayed={timespan[mode]}
					images={this.props.images} 
					playerStats={playerStats} 
					playerData={playerData} />
			);
		});

		return (
			<div id='visualization'>
				{playersCharts}
			</div>
		);
	}
}
