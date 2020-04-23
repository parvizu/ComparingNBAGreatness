import React from 'react';

export default class PlayerAwards extends React.Component {
	render() {
		var trophy = 'img/nbatrophy1.png';
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
}