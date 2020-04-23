import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
var d3 = require('d3');

import PlayerProfile from './PlayerProfile';
import PlayerAwards from './PlayerAwards';
import PlayerTrophies from './PlayerTrophies';
import PlayerTimeline from './PlayerTimeline';

export default class PlayerVisualization extends React.Component {
	constructor(props) {
		super(props);

		['getAwardFill','getTeamsPlayed','createPlayerVisualization','getPlayerInitials'].map(k=> this[k] = this[k].bind(this));

		this.state = {
			"playerAwards": [],
			"yearsPlayed": [],
			"dataByCareerYear": [],
			"dataByCalendarYear": [],
			"dataByAge": [],
			"teamsPlayed": [],
			"rookieYear": 0,
			"debutAge": 0
		}
	}

	componentDidMount() {
		this.setState({
			"playerAwards": this.props.playerAwards,
			"yearsPlayed": this.props.yearsPlayed,
			// "dataByCareerYear": this.getPlayerDataByCareerYear(this.props.playerData.awards, Object.keys(this.props.playerData.awards)),
			// "dataByCalendarYear": this.getPlayerDataByCalendarYear(this.props.playerData.awards, Object.keys(this.props.playerData.awards)),
			// "dataByAge": this.getPlayerDataByAge(this.props.playerData.awards, Object.keys(this.props.playerData.awards), this.props.playerData.age.first),
			"playerData": this.props.playerData,
			"teamsPlayed": this.getTeamsPlayed(this.props.playerData.teams),
			"rookieYear": Object.keys(this.props.playerAwards)[0],
			"debutAge": this.props.playerData.age.first
		});
	}
	

	getAwardFill(award) {
		let awardName = award.substr(0,2),
			awardTeam = award.substr(2,1),
			fillClass = 'award ';

		if (awardName === 'AS') {
			fillClass += 'allstar';

		} else if (awardName === 'AD') {
			fillClass += 'alldefensive';

		} else if (awardName === 'AN') {
			fillClass += 'allnba';

		} else {
			fillClass += 'mvp';
		}

		if (awardTeam === '2') {
			fillClass += ' secondteam';

		} else if (awardTeam === '3') {
			fillClass += ' thirdteam';

		} else {
			fillClass += ' firstteam';
		}

		return fillClass;
	}

	getTeamsPlayed(teams) {
		return teams.map(function(team) {
			return team;
		});
	}

	createPlayerVisualization(player) {
		let self = this,
			vizMode = self.props.mode,
			margin = { top: 10, right: 10, bottom: 10, left: 10 },
			width = 500 - margin.right - margin.left,
			height = 160 - margin.top - margin.bottom,
			node = ReactFauxDOM.createElement('svg'),
			playerStats = this.props.playerStats,
			yearsPlayed = this.props.yearsPlayed,
			awardsLabels = ['All Star','All Defensive','All NBA','MVP'],
			awardAcronyms = ['AS','AD','AN','MVP'];

		//  This should probably be in another function/component
		// if (this.props.mode === 'career') {
		// 	playerData = this.state.dataByCareerYear;
		// } else if (this.props.mode === 'age') {
		// 	playerData = this.state.dataByAge;
		// }

		var x = d3.scale.ordinal()
				.domain(yearsPlayed)
				.rangeBands([10,width-25],.1);

		var y  = d3.scale.ordinal()
				.domain(awardAcronyms)
				.rangeBands([height-40,0],.05);

		var xAxis = d3.svg.axis()
						.scale(x)
						.tickSize(1)
						.orient('bottom');

		var yAxis = d3.svg.axis()
						.scale(y)
						.tickSize(0)
						.tickValues(awardAcronyms)
						.tickFormat(function(d,i) {
							return awardsLabels[i];
						})
						.orient('right');

		// x axis
		d3.select(node)
			.append('g')
			.attr('class', 'x axis')
			.attr('transform','translate(0,'+(height-39)+')')
			.call(xAxis);

		if (this.props.mode === 'calendar') {
			// rotating x axis ticks labels in case of calendar view
			d3.select(node)
				.selectAll('g.x.axis .tick text')
				.style('text-anchor','end')
				.attr('transform', 'translate(-6,5) rotate(-90)');
		} 

		// award group
		d3.select(node)
			.attr({
				'height': height,
				'width': width
			})
			.selectAll('.awardGroup')
			.data(playerStats)
			.enter()
			.append('g')
				.attr({
					'class': 'awardGroup',
					'transform': function(d) {
						var dx = x(d.year);
						var dy = d.award ==='MVP' ? y(d.award) : y(d.award.substr(0,2));
						return 'translate('+dx+','+dy+')';
					}
				})
			.on('mouseover', function() {
				d3.select(this).select('text').style('display',null);
			})
			.on('mouseout', function() {
				d3.select(this).select('text').style('display',"none");
			});

		d3.select(node)
			.selectAll('g.awardGroup')
			.append('rect')
				.attr({					
					'height': y.rangeBand(),
					'width': x.rangeBand(),
					'class': function(d) {
						return self.getAwardFill(d.award);
					}
				})

		d3.select(node)
			.selectAll('g.awardGroup')
			.append('text')
				.attr({
					'dx': x.rangeBand()/4,
					'dy': '17px',
				})
				.text(function(d) {
					if (d.award !== 'MVP' && d.award !== 'AS') {
						return d.award.substr(2,1);
					}
					return;
				})
				.style('display','none');
			 

		//Adding the player teams
		d3.select(node)
			.selectAll('.playerTeam')
			.data(this.state.teamsPlayed)
			.enter()
			.append('rect')
				.attr({
					"class": function(d) {
						return "playerTeam "+ d.team;
					},
					"x": function(d) {
						if (self.props.mode ==='calendar')
							return x(d.start);
						else if (self.props.mode === 'age') {
							var playerAge = self.state.debutAge + (d.start - self.state.rookieYear);
							return x(playerAge);
						} else
							return x(d.careerStart);
					},
					"y": height-15,
					"width": function(d) {
						if (self.props.mode === 'calendar')
							return x(d.end) - x(d.start) + x.rangeBand();
						else if (self.props.mode === 'age') {
							var ageStart = self.props.timespan.age[0] + (d.careerStart-1);
							var ageEnd = d.careerEnd - (d.careerStart) + ageStart;
							return x(ageEnd) - x(ageStart) + x.rangeBand();
						} else 
							return x((d.careerEnd+1) - d.careerStart) + ((x.rangeBand()/2)-2);
					},
					"height":4,
					"fill": "black"
				});
		return node.toReact();
	}

	getPlayerInitials(name) {
		let names = name.split(' ');
		return names[0].substr(0,1) + names[1].substr(0,1);
	}

	render() {
		return (
			<div className="individualPlayerViz">
				<PlayerProfile player={this.props.playerData.name} nickname={this.props.playerData.nickname} pics={this.props.playerData.pics} images={this.props.images} />
				<div className="individualPlayerVizInfo">
					{this.createPlayerVisualization(this.props.playerData)}

					<PlayerAwards 
						totals={this.props.playerData.totals} championships={this.props.playerData.championships.length} />
					
					<PlayerTimeline 
						teams={this.props.playerData.teams} 
						mode={this.props.mode} 
						timespan={this.props.timespan} 
						dataByCareerYear={this.state.dataByCareerYear} 
						rookieYear={this.state.rookieYear} 
						debutAge={this.state.debutAge} 
						yearsPlayed={this.props.yearsPlayed} />

					<PlayerTrophies 
						championships={this.props.playerData.championships} 
						dataByCalendarYear={this.state.dataByCalendarYear}
						dataByCareerYear={this.state.dataByCareerYear}
						dataByAge={this.state.dataByAge}
						mode={this.props.mode} 
						timespan={this.props.timespan} 
						rookieYear={this.state.rookieYear} 
						debutAge={this.state.debutAge}
						playerData={this.props.playerData} 
						yearsPlayed={this.props.yearsPlayed} />
				</div>
				<h3>{this.props.playerData.name}</h3>
			</div>
		);
	}
}