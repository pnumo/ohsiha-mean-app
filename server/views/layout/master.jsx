var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<html>
				<head>
					<title>
						{this.props.name}
					</title>
					<link rel="stylesheet" href="/stylesheets/style.css"/>
				</head>

				<body>
					<a href="/">Index</a>
					<br/>
					<a href="/register">Register</a>
					<br/>
					<a href="/login">Login</a>
					<br/>

					{this.props.children}
				</body>
			</html>
		)
	}
});