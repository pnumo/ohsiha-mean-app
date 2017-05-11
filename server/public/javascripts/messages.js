$(function() {
	$('.edit_msg_btn').on('click', function(e) {
		e.preventDefault();

		var parent_div = $(this).closest('div');
		var receiver = $(parent_div).siblings('#receiver').text();
		var old_msg = $(parent_div).siblings('#msg_text').text();

		bootbox.prompt({
    		title: "Edit message:",
    		inputType: 'textarea',
    		value: old_msg,
    		callback: function (result) {
    			if(result != null) {
	    			$.ajax({
						type: 'POST',
						url: '/editmessage',
						data: {receiver: receiver, old_msg: old_msg, new_msg: result},
						success: function(res) {
							console.log("New msg: " + result);
							$(parent_div).siblings('#msg_text').text(result);
						},
						error: function(err) {
							console.log(err);
						}
					})
	    		}
    		}
		});
	});
	$('.del_msg_btn').on('click', function(e) {
		e.preventDefault();

		var parent_div = $(this).closest('div');
		var from = $(parent_div).siblings('#from').text();
		var msg = $(parent_div).siblings('#msg_text').text();

		bootbox.confirm("Delete this message?", function(result) { 
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

	$('.del_msg_btn2').on('click', function(e) {
		e.preventDefault();
		var parent_div = $(this).closest('div');

		var msg = $(parent_div).siblings('#msg_text').text();
		var receiver = $(parent_div).siblings('#receiver').text();

		bootbox.confirm("Delete this message?", 
			function(result) { 
				if(result) {
					$.ajax({
						type: 'POST',
						url: '/deletemessage',
						data: {receiver: receiver, message: msg},
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