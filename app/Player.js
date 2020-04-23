import React from 'react';

export default class Player extends React.Component {

	constructor(props) {

		super(props);

		['selectPlayer', 'getPlayerInitials'].map(k=> this[k] = this[k].bind(this));

		this.state ={};
	}

	componentDidMount() {
		this.setState({
			selected: this.props.isSelected
		});
	}

	selectPlayer(e) {
		this.props.onPlayerSelect(this.props.player);	
	}

	getPlayerInitials(name) {
		const names = name.split(' ');
		return names[0].substr(0,1) + names[1].substr(0,1);
	}

	render() {
		// if (this.props.player.nickname === 'kobe')
		const img = 'img/'+this.props.player.nickname+'jerseysmallX.png';
		// else 
		// 	var img = require('./img/'+this.props.player.nickname+'jersey.png');
		// 	var img = require('./img/kobejersey.png');
		
		return (

			<div className="playerNames" id={this.props.player.nickname} onClick={this.selectPlayer} >
				<img src={img} className={this.props.isSelected} />
			</div>
		)
	}
}