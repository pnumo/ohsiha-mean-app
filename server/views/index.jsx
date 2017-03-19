var React = require('react');
var DefaultLayout = require('./layout/master');

module.exports = React.createClass({
	render: function() {
		return (
			<DefaultLayout name={this.props.name}>
			<div>
				<h1>Index page placeholder</h1>
			</div>
			</DefaultLayout>
		)
	}
});