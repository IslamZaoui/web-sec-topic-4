$(document).ready(function () {
	$('.delete-user-btn').on('click', function () {
		const userId = $(this).data('user-id');
		const $row = $(this).closest('tr');

		$.ajax({
			url: `/api/users/${userId}`,
			type: 'DELETE',
			success: () => {
				$row.fadeOut(300, function () {
					$(this).remove();
				});
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
