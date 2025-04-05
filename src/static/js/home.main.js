$(window).on('load', () => {
	$('#logout-button').on('click', () => {
		fetch('/api/logout', {
			method: 'POST',
			credentials: 'include',
		}).then(() => {
			location.reload();
		});
	});
});
