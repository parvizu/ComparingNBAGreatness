import React from 'react';

export default class PlayerProfile extends React.Component {

	render() {
		const position = Math.floor(Math.random()* this.props.pics.length);
		let image = this.props.images[this.props.nickname][position];
		console.log(this.props.images);
		console.log(image);
		return (
			<div className="profilePic">
				<img  src={image} />
			</div>
		);
	}
}
