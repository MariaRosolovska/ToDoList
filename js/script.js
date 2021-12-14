// Розпаковуємо список, що запам'ятали
function printStorageTaskList (){
	var taskList = localStorage.getItem('taskList');
	var newData = JSON.parse(taskList);

	$('.js-task-list').empty();

	$.each(newData,function(index, val){
		printTaskItem(val);
	});
}

printStorageTaskList();

// Запам'ятовуємо список задач
function rememberTaskItems(){

	var listTaskItems = $('.js-task-list .tli-text-value'),
	listTaskItemsValue = {};

	$.each(listTaskItems, 
		function(index, val){
		var title = $(val).html();
		listTaskItemsValue['task-' + index] = title;
	}
);
	var jsonData = JSON.stringify(listTaskItemsValue);

	localStorage.setItem('taskList', jsonData);
}

// Буде добавляти html li з текстом і кнопками
function printTaskItem(taskValue){
	$('.js-task-list').append(`<li class="task-list-item">

	<div class="task-list-default">
		<label class="tli-text">
			<input type="checkbox">
			<span class="tli-text-value js-tli-edit">${taskValue}</span>
		</label>

		<div class="btn tli-delete js-tli-delete">Видалити</div>
		<div class="btn tli-edit js-tli-edit">Редагувати</div>
	</div>
	</li>`);
}


// Редагуємо задачу

function editTaskItem(el) {
	
	// Відбираємо батківський елемент
	var parentEl = el.closest('.task-list-item');
	var value = parentEl.find('.js-tli-edit').html();

	parentEl.find('.task-list-default').addClass('hide');

	// До батьківського елемента добавляємо блок редагування
	parentEl.append(`<div class="task-list-edited">
				<input type="text" value="${value}" class="tli-input-edit js-edit-task" >
				<div class="btn tli-update js-tli-update">Зберегти</div>
 			 </div>`);
}


// Виводить задачу з JsonPlaceholder
function setTaskFromJsonSite(argument){
	printTaskItem(argument['title']);
	rememberTaskItems();
}



// Витягуємо назву задачі сервісу json
function getJsonPlaceholder () {

	var pageNum = $('.js-task-list .task-list-item').length;

	$.ajax({
		url: "https://jsonplaceholder.typicode.com/todos/" + pageNum,
		type:'GET',
		success: setTaskFromJsonSite
			
	});
}

// Оновлення задач
function updateTaskItem(argument) {
	var parentEl = argument.closest('.task-list-item');

	// Відібрати текст з input(який я відредагувала)
	var value = parentEl.find('.js-edit-task').val();

	// Помістити цей текст у span який виводить текст задачі
	parentEl.find('span.js-tli-edit').html(value);

	// Забрати html блок з полем редагувнням
	parentEl.find('.task-list-edited').remove();

	// Показати блок з текстом задачі
	parentEl.find('.task-list-default').removeClass('hide');

	// Оновити localStore 
	rememberTaskItems();
}










// Добавляємо задачу до списку
$('.btn-add-task').click(function(event) {
	event.preventDefault();

	var inputVal = $('.js-add-task').val();
	
	if (inputVal == '') {
		getJsonPlaceholder();
	} else {
		printTaskItem(inputVal);
		rememberTaskItems();
	}
});


// Слідкуємо за кнопкою видалення
$(document).on('click', '.js-tli-delete', function(event) {
	event.preventDefault();

	var el = $(this);

	el.closest('.task-list-item').remove();

	// Оновлюємо запам'ятовування задач
	rememberTaskItems();
});


// Оновлюємо задачу
$(document).on('click', '.js-tli-edit', function(event) {
	event.preventDefault();
	
	var el = $(this);
	editTaskItem($(this));
});

// Редагуємо задачу
$(document).on('click', '.js-tli-update', function(event) {
	event.preventDefault();


	updateTaskItem($(this));
});