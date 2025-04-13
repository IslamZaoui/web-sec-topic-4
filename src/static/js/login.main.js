$(document).ready(function () {
	$('form').on('submit', (event) => {
		event.preventDefault();

		const username = $('#username').val();
		const password = $('#password').val();

		$.ajax({
			url: '/api/login',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ username, password }),
			success: () => {
				window.location.href = '/';
			},
			error: (jqXHR) => {
				if (jqXHR.status >= 400 && jqXHR.status < 500) {
					$('#error-message').text(jqXHR.responseJSON.message);
				} else {
					$('#error-message').text('An unexpected error occurred. Please try again.');
				}
			},
		});
	});
});
