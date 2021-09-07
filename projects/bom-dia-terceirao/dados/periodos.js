// [[horas, minutos], "tipo", "número"],
var periods = {
	// Dia em geral
	generalDay: [
		[[ 0, 0], "dayPeriod", 3], // Manhã
		[[ 6, 0], "dayPeriod", 1], // Manhã
		[[12, 0], "dayPeriod", 2], // Tarde
		[[18, 0], "dayPeriod", 3], // Noite
	],
	// Dia sem prova
	normalDay: [
		[[ 0,  0], "before", 1],
		[[ 7, 20], "class", 1], // 1ª Aula
		[[ 8,  5], "class", 2], // 2ª Aula
		[[ 8, 50], "break", 1], // 1º Intervalo
		[[ 9,  5], "class", 3], // 3ª Aula
		[[ 9, 50], "class", 4], // 4ª Aula
		[[10, 35], "break", 2], // 2º Intervalo
		[[10, 40], "class", 5], // 5ª Aula
		[[11, 25], "class", 6], // 6ª Aula
		[[12, 00], "after", 1], // Término
	],
	// Dia com prova
	testDay: [
		[[ 0,  0], "before", 1],
		[[ 7, 20], "test", 1], // Prova
		[[ 8, 10], "class", 1], // 1ª Aula
		[[ 8, 45], "class", 2], // 2ª Aula
		[[ 9, 20], "break", 1], // 1º Intervalo
		[[ 9, 35], "class", 3], // 3ª Aula
		[[10, 10], "class", 4], // 4ª Aula
		[[10, 45], "break", 2], // 2º Intervalo
		[[10, 50], "class", 5], // 5ª Aula
		[[11, 25], "class", 6], // 6ª Aula
		[[12, 00], "after", 1], // Término
	],
	// Tarde
	afternoonDay: [
		[[13, 30], "class", 7], // 7ª Aula
		[[14, 15], "class", 8], // 8ª Aula
		[[15, 00], "class", 9], // 9ª Aula
		[[15, 45], "break", 3], // 3º Intervalo
		[[16, 00], "class", 10], // 10ª Aula
		[[16, 45], "class", 11], // 11ª Aula
		[[17, 30], "after", 2], // Término
	],
	// Simulado
	bigTestDay: [
		[[ 0,  0], "before", 1],
		[[ 7, 20], "class", 1], // 1ª Aula
		[[ 8,  5], "class", 2], // 2ª Aula
		[[ 8, 50], "break", 1], // 1º Intervalo
		[[ 9,  0], "bigTest", 1], // Simulado
		[[11, 25], "exitAllowed", 6], // Saída permitida
		[[12, 00], "after", 1], // Término formal
	],
	customDay: [
		[[ 0,  0], "before", 1],
	],
};