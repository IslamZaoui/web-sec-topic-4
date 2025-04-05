$(document).ready(function () {
	$('form').on('submit', function (event) {
		event.preventDefault();

		const username = $('#username').val();
		const password = $('#password').val();

		$.ajax({
			url: '/api/login',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ username, password }),
			success: function (response) {
				window.location.href = '/';
			},
			error: function (jqXHR) {
				if (jqXHR.status === 400) {
					$('#error-message').text('Invalid request. Please try again.');
				} else if (jqXHR.status === 401) {
					$('#error-message').text('Invalid username or password.');
				} else if (jqXHR.status === 429) {
					$('#error-message').text('Rate limit exceeded. Please try again later.');
				} else {
					$('#error-message').text('An unexpected error occurred. Please try again.');
				}
			},
		});
	});
});
