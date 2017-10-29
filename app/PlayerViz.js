var React = require('react'),
	ReactDOM = require('react-dom'),
	Visualization = require('./Visualization');


var Player = React.createClass({
	getInitialState: function() {
		return {
			'selected': this.props.isSelected
		}
	},

	selectPlayer: function(e) {
		e.preventDefault();
		if (this.state.selected === 'selected')
			status = '';
		else
			status = 'selected';

		this.setState({
			"selected":status
		});

		this.props.onPlayerSelect(this.props.player);

	},

	getPlayerInitials: function(name) {
		var names = name.split(' ');
		return names[0].substr(0,1) + names[1].substr(0,1);
	},

	render: function() {
		// if (this.props.player.nickname === 'kobe')
			var img = require('./img/'+this.props.player.nickname+'jerseysmallX.png');
		// else 
		// 	var img = require('./img/'+this.props.player.nickname+'jersey.png');
		// 	var img = require('./img/kobejersey.png');
		
		return (

			<div className="playerNames" id={this.props.player.nickname} onClick={this.selectPlayer} >
				<img src={img} className={this.state.selected} />
			</div>
		)
	}
});

var PlayerList = React.createClass({

	render: function() {
		var self = this;
		var players = self.props.data.map(function(player) {
			var isSelected = self.props.selectedPlayers.indexOf(player.nickname) !== -1 ? 'selected' : '';
			return (
				<Player key={player.nickname+"-key"} player={player} onPlayerSelect={self.props.onPlayerSelect} isSelected={isSelected} />
			)
		});

		return (
			<div id="jerseys">
				{players}
			</div>
		);
	}
});

var Menu = React.createClass({
	getInitialState: function() {
		return {
			'career': 'menuLeft selected',
			'calendar': '',
			'age': 'menuRight '
		};
	},

	onSelectMode: function(e) {
		e.preventDefault();

		var newState = {
			'career': 'menuLeft ',
			'calendar': ' ',
			'age': 'menuRight '
		};

		newState[e.target.value] += 'selected';

		this.setState(newState);
		this.props.changeViewMode(e.target.value);
		
	},


	render: function() {
		return (
			<div id="menu">
				<div className={this.state.career} onClick={this.onSelectMode} value="career">	By Seasons in NBA </div>  
				<div className={this.state.calendar} onClick={this.onSelectMode} value="calendar"> By Calendar Year </div> 
				<div className={this.state.age} onClick={this.onSelectMode} value="age"> By Player&#39;s Age </div>
			</div>
			);
	}
});

var VisualizationLegend = React.createClass({
	
	render: function() {
		var helpIcon = require('./img/helpIconWhite.png');
		return (
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
				<div id="helpArea">
					<img id="help" src={helpIcon} />
				</div>
			</div>
			)
	}
});


// Main component
var PlayerViz = React.createClass({
	getInitialState: function() {
		var defaultSelectedPlayers = ['jordan','lebron','kobe'];
		var defaultTimeSpan = this.getTimeSpan(defaultSelectedPlayers);


		return {
			"selected": defaultSelectedPlayers,
			"vizMode": 'career',
			"timespan": defaultTimeSpan,
			"popup": "hide",
			"img": ""
		}
	},

	changeViewMode: function(value) {
		this.setState({
			"vizMode": value
		});
	},

	getTimeSpan: function(selectedPlayers) {
		var start = 2017,
			end = 1,
			years = [],
			ages = [], 
			startAge = 60,
			endAge = 1,
			min, max, 
			careerYears = 0,
			players = [];

		for (var j = 0; j<this.props.data.length; j++) {
			if (selectedPlayers.indexOf(this.props.data[j].nickname) !== -1) {
				players.push(this.props.data[j]);
			}
		}


		for (var i = 0; i<players.length; i++) {
			years = Object.keys(players[i].awards);
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

			if (startAge > players[i].age.first) {
				startAge = players[i].age.first;
			}

			if (endAge < players[i].age.last) {
				endAge = players[i].age.last;
			}
		}

		return {
			"start": start,
			"end": end,
			"years": careerYears,
			"age": {
				"first": startAge,
				"last": endAge
			}
		};
	},

	handlePlayerSelect: function(e) {
		var position = this.state.selected.indexOf(e.nickname);
		if (position <0) {
			this.state.selected.unshift(e.nickname);
		} else {
			this.state.selected.splice(position,1);
		}

		var newTimeSpan = this.getTimeSpan(this.state.selected);

		this.setState({
			selected: this.state.selected,
			timespan: newTimeSpan
		});
		
	},

	
	// createImage: function(e) {
	// 	var self = this;
		
	// 	e.preventDefault();

	// 	html2canvas(document.getElementById('app'), {
	// 		allowTaint: true,
	// 		onrendered: function(canvas) {
	// 			console.log(canvas);
	// 			var png = canvas.toDataURL("image/png");
	// 			// document.getElementById('popup').append('<img src="'+img+'" ">');
				
	// 			self.setState({
	// 				"popup": "",
	// 				"img" : png
	// 			});
	// 		}
	// 	});
	// },

	closeImage: function() {
		this.setState({
			"popup": "hide"
		});
	},

	render: function() {
		var nbaLogo = require('./img/nbaLogo.png'),
			instructions = this.state.selected.length != 0 ? 'hide' : '',
			twitterLink = require('./img/twitter-256.png');

		return (
			<div id='app'>
				<div id="header">
					<div id="updated">v1.3 (10/29/17)</div>
					<img src={nbaLogo} /> 
					<h1> Comparing Greatness</h1> <a href="http://www.parvizu.com" target="_blank" id="madeby">by Pablo Arvizu</a> <a href="https://twitter.com/sirgalahad88" target="_blank" id="twitterLink"><img src={twitterLink} /></a>
					<div className="addthis_sharing_toolbox"></div>
				</div>
				<div id="blurb">
					<p>
						Not all Basketball players are the same. Only a few of them have the drive and talent to rise to heights never seen before. Those we call the 'Great Ones'. But the path to greatness was different for each one. Some peaked very early, some took time to find their groove, others redefined the words longevity and success, while some were otherworldly throughout. 

						Explore how some of the best players in NBA history stack up against each other. See how their careers unfolded by looking at when the awards and titles were won, and how maturity and experience played a part in their success. Get a chance to compare the greatest this game has ever seen, whether they be past or rising stars.
					</p>
				</div>
				<PlayerList data={this.props.data} onPlayerSelect={this.handlePlayerSelect} selectedPlayers={this.state.selected}/>
				
				<Menu changeViewMode={this.changeViewMode} />
				<VisualizationLegend />
				
				
				<Visualization players={this.state.selected} data={this.props.data} mode={this.state.vizMode} timespan={this.state.timespan} images={this.props.images}/>
				
				<div className={instructions} id="instructions" >
					<h1>To compare, select one or more players by clicking on their jerseys above</h1>
				</div>
				<div className="footer">
					<a href="https://twitter.com/sirgalahad88" className="twitter-follow-button" data-show-count="false">Follow @sirgalahad88</a>&nbsp;&nbsp;<span className="vertBar">|</span>&nbsp;&nbsp;
					<a className="footer-link" href="http://www.parvizu.com" target="_blank" >www.parvizu.com</a>&nbsp;&nbsp;<span className="vertBar">|</span>&nbsp;&nbsp;
					<a className="footer-link" href="http://www.morethanjustsports.com" target="_blank" >www.morethanjustsports.com</a> &nbsp;&nbsp;<span className="vertBar">|</span>&nbsp;&nbsp;
					<a>Image Credits: Logos and Jerseys are property of the ©NBA </a>
				</div>
			</div>
		);
	}
});

module.exports = PlayerViz;
