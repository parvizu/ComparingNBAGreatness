import React from 'react';
import classNames from 'classnames';

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		['onSelectMode'].map(k=> this[k] = this[k].bind(this));

		this.state = {
			'career': 'menuLeft selected',
			'calendar': '',
			'age': 'menuRight '
		}
	}

	onSelectMode(e) {
		e.preventDefault();

		let newState = {
			'career': 'menuLeft ',
			'calendar': ' ',
			'age': 'menuRight '
		};

		newState[e.target.value] += 'selected';

		// this.setState(newState, () => {
			this.props.changeViewMode(e.target.attributes.value.value);	
		// });
	}


	render() {
		const labels = {
			career: 'NBA Seasons',
			calendar: 'Calendar Year',
			age: "Player's Age"
		};
		const menuOptions = Object.entries(labels).map(([key,label]) => {
			const classes = classNames({
				menuLeft: key === 'career',
				menuRight: key === 'age',
				selected: key === this.props.selected
			});

			return (
				<div className={classes} onClick={this.onSelectMode} value={key}> {label} </div>
			);
		});

		return (
			<div id="menu">
				{ menuOptions }
			</div>
		);
	}
}