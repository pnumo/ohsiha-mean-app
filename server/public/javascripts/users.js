$(function() {
	$('#sendMsgBtn').click(function() {
		$('#newMessage').modal('hide');
	});

	$('.userInList').click(function() {
		$('.receiver').val($(this).text());
	});
});