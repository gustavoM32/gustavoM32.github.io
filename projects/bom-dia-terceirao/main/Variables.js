/**
	* Destaque para o período atual na barra de períodos
	* Possibilidade de melhorar o sistema de animações:
		* Dados da peça de informação de acordo com o nome do período do dia
		* Caso os dados usados por uma peça de informação sejam trocados (ao trocar o período, por exemplo) a animação de transição
		será executada. Semelhante a como a animação de saída e entrada dos textos são feitos para a mensagem principal e as
		informações aleatórias.
	* Remoção de informações durante provas, tempo de provas
	* Refazer programa em Java?
*/

var currentTime;
var weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
var mainMessageText; // Default message
var changeMainMessage = ["", 0, false];
var schoolYear = [new Date(2018, 01, 19, 07, 20, 00, 000), new Date(2018, 10, 21, 10, 00, 00, 000)];
var yearPerc;
var remSeconds;
var remTotalDays;
var remSchoolDays;
var minutesToday;
var millisToday;
var todayInDays;
var dayUpdated = true;

var MINUTES_IN_A_DAY = 24*60;
var MILLIS_IN_A_DAY = 24*60*60*1000;
var MILLIS_IN_A_MINUTE = 60*1000;

var monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
var weekDaysMin = ["D", "S", "T", "Q", "Q", "S", "S"];
var monthdaysStatus = [[], [], [], [], [], [], [], [], [], [], [], []];
var daysThisMonth;
var firstMonthWeekday;
var daysThisYear;

// Custom time
var customTimeDate = new Date(2018, 05, 19, 08, 49, 55, 000);
var customTimeSpeed = 1;
var customTime = true;

var todayPeriods = [];
var currentGeneralPeriod;
var nextGeneralPeriod;
var previousPeriod;
var currentPeriod;
var nextPeriod;

var visualizerScale = 0.9; // Amount of time (in hours) displayed in the visualizer from middle to either side.
var visualizerValues = []; // Amount of time remaining to every period (is millisseconds);

var normalDayCompl;
var afternoonDayCompl;
var normalDayStart = [7, 20];
var normalDayEnd = [12, 00];
var afternoonDayStart = [13, 30];
var afternoonDayEnd = [17, 30];

var schoolDay = true;
var schoolNormalPrePeriod = convertToMillis(7, 0);
var schoolNormalPeriod = [convertToMillis(...normalDayStart), convertToMillis(...normalDayEnd)];
var schoolAfternoonPeriod = [convertToMillis(...afternoonDayStart), convertToMillis(...afternoonDayEnd)];
var testDay = false;
var todayTest;
var testEndTime = convertToMillis(8, 10);
var bigTestDay = false;
var afternoonDays = [2];
var afternoonDay = false;
var customDay = false;

var nextBirthdays = [];

var nextTests = [];

var presentInfos = [];
var currentInfo;
var currentInfoTxt = "";
var changeInfo = ["", 0, false];
var timeBetweenInfos = 60*1000; // In millisseconds

var totalSchoolDays;
var remainingAfternoonDays;
var currentSchoolDay = 0;
var remainingTests = 0;
var remainingClasses = 0;

var defaultThemeColor = [280, 20, 20];
var themeColor = [0, 0, 0];
var previousThemeColor = [0, 0, 0];
var textColor = [0, 0, 0, 90];
var textStrokeColor = [0, 0, 0, 90];

var calendarColors = {
	normalDay: 220,
	testDay: 25,
	holiday: 290,
};

var calendarPosition;
var calendarDaySize;
var calendarSpacing;
var calendarRows = 6;
var calendarCols = 7;
	
var todayCompletionColor;

var infoPiecesDefPos = [];
var infoPiecesCurPos = [];
var curPos;
var infoPiecesFunctions = [];
var infoPiecesFunctionNames = []; // A direct relation between function name and it's info piece index in arrays

var fullScreen = false;

var currentLeftInfo = "";
var changeLeftInfo = ["", 0, false];
var currentCourses = [];
var timeBetweenLeftInfos = 60*1000;