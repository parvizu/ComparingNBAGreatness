var React = require('react');
var d3 = require('d3');
var FauxDOM = require('react-faux-dom');

var PlayerVisualization = React.createClass({
	getInitialState: function() {
		return {
			"playerData": [],
			"yearsPlayed": [],
			"dataByCareerYear": [],
			"dataByCalendarYear": [],
			"dataByAge": [],
			"teamsPlayed": [],
			"rookieYear": 0,
			"debutAge": 0
		}
	},

	componentWillMount: function() {
		this.setState({
			"playerData": this.props.playerData.awards,
			"yearsPlayed": this.props.timespan.years,
			"dataByCareerYear": this.getPlayerDataByCareerYear(this.props.playerData.awards, Object.keys(this.props.playerData.awards)),
			"dataByCalendarYear": this.getPlayerDataByCalendarYear(this.props.playerData.awards, Object.keys(this.props.playerData.awards)),
			"dataByAge": this.getPlayerDataByAge(this.props.playerData.awards, Object.keys(this.props.playerData.awards), this.props.playerData.age.first),
			"teamsPlayed": this.getTeamsPlayed(this.props.playerData.teams),
			"rookieYear": Object.keys(this.props.playerData.awards)[0],
			"debutAge": this.props.playerData.age.first

		});
	},

	getCalendarYears: function(years) {
		var calendarYears = [],
			start = years[0],
			end = years[years.length-1];

		for (var i = start; i<=end; i++) {
			calendarYears.push(i);
		}

		return calendarYears;

	},

	getPlayerDataByCalendarYear: function(playerData, yearsPlayed) {
		var result = [],
			year = '',
			yearAwards = [];

		for (var i = 0; i<yearsPlayed.length; i++) {
			year = yearsPlayed[i];
			yearAwards = playerData[year];
			for (var j = 0; j<yearAwards.length; j++) {
				result.push({
					'year': year,
					'award': yearAwards[j]
				});
			}
		}

		return result;
	},

	getPlayerDataByCareerYear: function(playerData, yearsPlayed) {
		var result = [],
			year = '',
			yearAwards = [];

		for (var i = 0; i<yearsPlayed.length; i++) {
			year = yearsPlayed[i];
			yearAwards = playerData[year];
			for (var j = 0; j<yearAwards.length; j++) {
				result.push({
					'year': i+1,
					'award': yearAwards[j]
				});
			}
		}

		return result;
	},

	getPlayerDataByAge: function(playerData, yearsPlayed,rookieAge) {
		var result = [],
			age = 0,
			year = 0,
			firstYear = parseInt(yearsPlayed[0]),
			yearAwards = [];

		for (var i = 0; i<yearsPlayed.length; i++) {
			year = parseInt(yearsPlayed[i])
			age = rookieAge + year - firstYear;
			yearAwards = playerData[year];
			for (var j = 0; j<yearAwards.length; j++) {
				result.push({
					'year': age,
					'award': yearAwards[j]
				});
			}
		}

		return result;
	},

	getAwardFill: function(award) {
		var awardName = award.substr(0,2),
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
	},

	getTeamsPlayed: function(teams) {
		var teams = teams.map(function(team) {
			return team;
		})

		return teams;
	},

	createPlayerVisualization: function(player) {
		var self = this,
			vizMode = self.props.mode,
			margin = { top: 10, right: 10, bottom: 10, left: 10 },
			width = 500 - margin.right - margin.left,
			height = 160 - margin.top - margin.bottom,
			node = FauxDOM.createElement('svg'),
			playerData = this.state.dataByCalendarYear,
			yearsPlayed = [],
			awardsLabels = ['All Star','All Defensive','All NBA','MVP'],
			awardAcronyms = ['AS','AD','AN','MVP'];

		//  This should probably be in another function/component
		if (this.props.mode === 'career') {
			yearsPlayed = this.props.timespan.years;
			playerData = this.state.dataByCareerYear;
		} else if (this.props.mode === 'calendar') {
			yearsPlayed = this.props.timespan.calendar;
		} else if (this.props.mode === 'age') {
			yearsPlayed = this.props.timespan.ages;
			playerData = this.state.dataByAge;
		}

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

		// x axis 'years' label
		// d3.select(node)
		// 	.append('text')
		// 	.attr({
		// 		'class': 'axisLabel',
		// 		'text-anchor': 'right',
		// 		'transform': 'translate('+(width-47)+','+(height-30)+')'
		// 	})
		// 	.text(function() {
		// 		if (vizMode === 'calendar')
		// 			return 'Year';
		// 		else if (vizMode === 'career')
		// 			return 'Season';
		// 		else 
		// 			return 'Age';
		// 	});

		if (this.props.mode === 'calendar') {
			// rotating x axis ticks labels in case of calendar view
			d3.select(node)
				.selectAll('g.x.axis .tick text')
				.style('text-anchor','end')
				.attr('transform', 'translate(-6,5) rotate(-90)');
		} 

		// y axis
		// d3.select(node)
		// 	.append('g')
		// 	.attr('class','y axis')
		// 	.attr('transform','translate('+(width-50)+',0)')
		// 	.call(yAxis);

		// award group
		d3.select(node)
			.attr({
				'height': height,
				'width': width
			})
			.selectAll('.awardGroup')
			.data(playerData)
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
							var ageStart = self.props.timespan.ages[0] + (d.careerStart-1);
							var ageEnd = d.careerEnd - (d.careerStart) + ageStart;
							return x(ageEnd) - x(ageStart) + x.rangeBand();
						} else 
							return x((d.careerEnd+1) - d.careerStart) + ((x.rangeBand()/2)-2);
					},
					"height":4,
					"fill": "black"
				});
		return node.toReact();
	},

	getPlayerInitials: function(name) {
		var names = name.split(' ');
		return names[0].substr(0,1) + names[1].substr(0,1);
	},

	render: function() {
		return (
			<div className="individualPlayerViz">
				<PlayerProfile player={this.props.playerData.name} nickname={this.props.playerData.nickname} pics={this.props.playerData.pics} />
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
						debutAge={this.state.debutAge} />

					<PlayerTrophies 
						championships={this.props.playerData.championships} 
						dataByCalendarYear={this.state.dataByCalendarYear}
						dataByCareerYear={this.state.dataByCareerYear}
						dataByAge={this.state.dataByAge}
						mode={this.props.mode} 
						timespan={this.props.timespan} 
						rookieYear={this.state.rookieYear} 
						debutAge={this.state.debutAge}
						playerData={this.props.playerData} />
				</div>
				<h3>{this.props.playerData.name}</h3>
			</div>
		);
	}
});

var PlayerTrophies = React.createClass({
	getInitialState: function() {
		return {
			'playerCalendarYears': [],
			"playerAgeYears": [],
			"playerCareerYears": []
		}
	},

	componentWillMount: function() {
		this.setState({
			'playerCalendarYears': this.getPlayerCalendarYears(Object.keys(this.props.playerData.awards)),
			"playerAgeYears": this.getPlayerAgeYears(this.props.rookieYear, this.props.debutAge, Object.keys(this.props.playerData.awards)),
			"playerCareerYears": this.getPlayerCareerYears(Object.keys(this.props.playerData.awards))
		});
	},

	getPlayerCalendarYears: function(years) {
		var result = [],
			lastYear = years[years.length-1];

		for (var year = years[0]; year<=lastYear; year++) {
			result.push(parseInt(year));
		}

		return result;
	},

	getPlayerAgeYears: function(rookieYear, debutAge, years) {
		var result = [],
			age = 0,
			year = 0,
			lastYear = years[years.length-1];

		for (var year = rookieYear; year<=lastYear; year++) {
			age = debutAge + (year - rookieYear);
			result.push(age);
		}
		return result;
	},

	getPlayerCareerYears: function(years) {
		var result = [];
		for (var i = 1; i<=years.length; i++) {
			result.push(i);
		}

		return result;
	},

	render: function() {
		var self = this,
			img = require('./img/nbatrophy1.png');

		var x = d3.scale.ordinal()
				.domain(yearsPlayed)
				.rangeBands([10,455],.1);

		var trophies = this.props.championships.map(function(championship,i) {
				var width = x.rangeBand(),
					xPos, style;

			if (self.props.mode === 'career') {
				var years = Object.keys(self.props.playerData.awards);
				xPos = x(years.indexOf(championship.toString())+1);
			}
			else if (self.props.mode === 'age') {
				var playerAge = self.props.debutAge + (self.state.playerCalendarYears.indexOf(championship));
				xPos = x(playerAge);
			} else {
				xPos = x(championship);
			}

			var imgWidth = width> 17 ? 15 : width;

			if (i>0) {
				xPos -= (i*imgWidth);
			} 

			return (
				<div className="nbaTrophy" style={{left: xPos+'px'}} width={width}>
					<img src={img} width={imgWidth} />
				</div>  
			);
		});

		return (
			<div className="playerTrophies">
				{trophies}
			</div>
		)
	}

});

var PlayerTimeline = React.createClass({

	render: function() {
		var self = this;

		//  This should probably be in another function/component
		if (this.props.mode === 'career') {
			yearsPlayed = this.props.timespan.years;
			playerData = this.props.dataByCareerYear;
		} else if (this.props.mode === 'calendar') {
			yearsPlayed = this.props.timespan.calendar;
		} else if (this.props.mode === 'age') {
			yearsPlayed = this.props.timespan.ages;
			playerData = this.props.dataByAge;
		}

		var x = d3.scale.ordinal()
				.domain(yearsPlayed)
				.rangeBands([10,455],.1);

		var logos = this.props.teams.map(function(team,i) {
			var img = require('./img/'+team.team+'.png'),
			// var img = require('./img/lakers.png'),
				width = x.rangeBand(),
				xPos, style;

			if (self.props.mode === 'career')
				xPos = x(team.careerStart);
			else if (self.props.mode === 'age') {
				var playerAge = self.props.debutAge + (team.start - self.props.rookieYear);
				xPos = x(playerAge);
			} else
				xPos = x(team.start);

			var imgWidth = width>17 ? 15 : width;
			if (i>0) {
				xPos -= (i*imgWidth);
			} 
			

			return (
				<div className="teamLogo" style={{left: xPos+'px'}} width={width}>
					<img src={img} width={imgWidth} />
				</div>  
			);
		});

		return (
			<div className="playerTimeline">
				{logos}
			</div>
		)
	}
});


var PlayerAwards = React.createClass({
	render: function() {
		var trophy = require('./img/nbatrophy1.png');
		return (

			<div className="playerAwards">
				<div className="titles">
					<img src={trophy} />
					<h2>{this.props.championships}</h2><span>NBA Titles</span>
				</div>
				<div className="selections">
					<div className="mvp"><h2>{this.props.totals.MVP}</h2><span>MVP</span></div>
					<div className="alldefensive"><h2>{this.props.totals.AD}</h2><span>All Defensive</span></div>
					<div className="allnba"><h2>{this.props.totals.AN}</h2><span>All NBA</span></div>
					<div className="allstar"><h2>{this.props.totals.AS}</h2><span>All Star</span></div>
				</div>
			</div>
		)
	}
});


var PlayerProfile = React.createClass({
	getRandomPic: function() {
		var position = Math.floor(Math.random()* this.props.pics.length) +1;
		var imgName = './img/'+this.props.nickname+'trans'+(position)+'.png';
		var src = require(imgName);
		return src;
	},

	render: function() {
		var image = this.getRandomPic();
		return (
			<div className="profilePic">
				<img  src={image} />
			</div>
		);
	}
});



var Visualization = React.createClass({
	
	getYearsRange: function() {
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
			"years": years,
			"ages": ages
		}
	},
	
	getPlayerData: function(nickname) {
		for (var i = 0; i< this.props.data.length; i++) {
			if (this.props.data[i].nickname === nickname) {
				return this.props.data[i];
			}
		}
		return {};
	},

	render: function() {
		var self = this,
			timespan = self.getYearsRange();

		var playersCharts = this.props.players.map(function(player) {
			var playerData = self.getPlayerData(player)
			return (
				<PlayerVisualization playerData={playerData} mode={self.props.mode} key={player} timespan={timespan} />
			);
		});

		return (
				<div id='visualization'>
					{playersCharts}
				</div>
			);
	}
});

module.exports = Visualization;
