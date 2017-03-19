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
					{this.props.children}
				</body>
			</html>
		)
	}
});