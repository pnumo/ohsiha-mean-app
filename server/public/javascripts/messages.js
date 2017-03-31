$(function() {
	$('.del_msg_btn').on('click', function(e) {
		e.preventDefault();
		var parent_div = $(this).closest('div');

		var from = $(this).siblings('#from').text();
		var msg = $(this).siblings('#msg_text').text();

		bootbox.confirm("Delete this message?", 
			function(result) { 
				if(result) {
					$.ajax({
						type: 'POST',
						url: '/deletemessage',
						data: {from: from, message: msg},
						success: function(result) {
							parent_div.remove();
						},
						error: function(err) {
							console.log(err);
						}
					})
				}
		});
	});
});