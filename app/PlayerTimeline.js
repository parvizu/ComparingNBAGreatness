import React from 'react';


export default class PlayerTimeline extends React.Component{

	render() {
		var self = this;
		let yearsPlayed = this.props.yearsPlayed, 
			playerData;

		//  This should probably be in another function/component
		if (this.props.mode === 'career') {
			// yearsPlayed = this.props.timespan.year;
			playerData = this.props.dataByCareerYear;
		} else if (this.props.mode === 'age') {
			// yearsPlayed = this.props.timespan.ages;
			playerData = this.props.dataByAge;
		}

		var x = d3.scale.ordinal()
				.domain(yearsPlayed)
				.rangeBands([10,455],.1);

		var logos = this.props.teams.map(function(team,i) {
			var img = 'img/'+team.team+'.png',
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
}
