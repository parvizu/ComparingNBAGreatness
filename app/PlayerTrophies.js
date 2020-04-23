import React from 'react';

export default class PlayerTrophies extends React.Component {
	constructor(props) {
		super(props);

		['getPlayerCalendarYears','getPlayerAgeYears','getPlayerCareerYears'].map(k => this[k] = this[k].bind(this))

		this.state = {
			'playerCalendarYears': [],
			"playerAgeYears": [],
			"playerCareerYears": []
		}
	}

	componentWillMount() {
		this.setState({
			'playerCalendarYears': this.getPlayerCalendarYears(Object.keys(this.props.playerData.awards)),
			"playerAgeYears": this.getPlayerAgeYears(this.props.rookieYear, this.props.debutAge, Object.keys(this.props.playerData.awards)),
			"playerCareerYears": this.getPlayerCareerYears(Object.keys(this.props.playerData.awards))
		});
	}

	getPlayerCalendarYears(years) {
		let result = [],
			lastYear = years[years.length-1];

		for (let year = years[0]; year<=lastYear; year++) {
			result.push(parseInt(year));
		}

		return result;
	}

	getPlayerAgeYears(rookieYear, debutAge, years) {
		let result = [],
			age = 0,
			year = 0,
			lastYear = years[years.length-1];

		for (var y = rookieYear; y<=lastYear; y++) {
			age = debutAge + (y - rookieYear);
			result.push(age);
		}
		return result;
	}

	getPlayerCareerYears(years) {
		var result = [];
		for (var i = 1; i<=years.length; i++) {
			result.push(i);
		}

		return result;
	}

	render() {
		var self = this,
			img = 'img/nbatrophy1.png';

		var x = d3.scale.ordinal()
				.domain(this.props.yearsPlayed)
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

}