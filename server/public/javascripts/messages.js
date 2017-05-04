$(function() {
	$('.del_msg_btn').on('click', function(e) {
		e.preventDefault();
		var parent_div = $(this).closest('div');

		var from = $(parent_div).siblings('#from').text();
		var msg = $(parent_div).siblings('#msg_text').text();

		bootbox.confirm("Delete this message?", 
			function(result) { 
				if(result) {
					$.ajax({
						type: 'POST',
						url: '/deletemessage',
						data: {from: from, message: msg},
						success: function(res) {
							parent_div.parent().remove();
						},
						error: function(err) {
							console.log(err);
						}
					})
				}
		});
	});
});