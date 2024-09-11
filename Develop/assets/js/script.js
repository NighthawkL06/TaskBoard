// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function generateTaskId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `task-${timestamp}-${randomNum}`;
}

function createTaskCard(task) {
  const { id, title, description } = task;

  return `
      <div class="card task-card mb-2" id="${id}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
        </div>
      </div>
    `;
}

function renderTaskList(tasks) {
  $("#to-do-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();

  tasks.forEach((task) => {
    const taskCardHtml = createTaskCard(task);

    $(`#${task.status}-cards`).append(taskCardHtml);
  });

  $(".task-card").draggable({
    revert: "invalid",
    helper: "clone",
    start: function (event, ui) {
      $(this).addClass("dragging");
    },
    stop: function (event, ui) {
      $(this).removeClass("dragging");
    },
  });

  $(".lane").droppable({
    accept: ".task-card",
    drop: function (event, ui) {
      const $taskCard = $(ui.helper);
      const newStatus = $(this).attr("id");
      const taskId = $taskCard.attr("id");

      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }

      $(`#${newStatus}-cards`).append($taskCard);
      $taskCard.removeClass("dragging");
    },
  });
}

function handleAddTask(event) {
  event.preventDefault();

  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const status = $("#taskStatus").val();
  const dueDate = $("#dueDate").val();

  const taskId = generateTaskId();

  const newTask = {
    id: taskId,
    title: title,
    description: description,
    status: status,
    dueDate: dueDate,
  };

  tasks.push(newTask);

  renderTaskList(tasks);

  $("#formModal").modal("hide");
  $("#taskForm").trigger("reset");
}

function handleDeleteTask(event) {
  const taskId = $(event.target).data("id");
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTaskList(tasks);
}

function handleDrop(event, ui) {
  const $taskCard = $(ui.helper);
  const newStatus = $(this).attr("id");
  const taskId = $taskCard.attr("id");

  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
  }

  $(`#${newStatus}-cards`).append($taskCard);
}

$(document).ready(function () {
  tasks = [
    {
      id: generateTaskId(),
      title: "Task 1",
      description: "Description for task 1",
      status: "to-do",
      dueDate: "",
    },
    {
      id: generateTaskId(),
      title: "Task 2",
      description: "Description for task 2",
      status: "in-progress",
      dueDate: "",
    },
  ];

  renderTaskList(tasks);

  $("#taskForm").on("submit", handleAddTask);

  $("#dueDate").datepicker({
    dateFormat: "yy-mm-dd",
  });

  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });
});
