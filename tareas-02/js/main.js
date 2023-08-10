const form = document.querySelector('#form');
const taskList = document.querySelector('.collection');
const addTask = document.querySelector('#addTask');
const filtro = document.querySelector('#filtro');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addTask.addEventListener('click', () => {
  form.classList.toggle('d-none');
});

filtro.addEventListener('change', filterTasks);


function filterTasks (e) {
  // obtengo una clase del select
  const text = e.target.value;
  console.log(text)

  // obtengo todas las tareas
  const tasks = document.querySelectorAll('.task');
  console.log(tasks)
  // ahora solo dejo visibles las que coinciden con el filtro
  tasks.forEach((task) => {
    if (task.classList.contains(text)) {
      task.classList.remove('d-none');
    } else {
      task.classList.add('d-none');
    }
  })
}


// create a function to sum days to actual date
function addDays (days) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  console.log(date)
  return date;
}


function saveTask (e) {
  e.preventDefault();
  let titulo = e.target.tituloTarea
  let descripcion = e.target.descripcionTarea
  let tiempo = e.target.tiempo
  let emojiTarea = e.target.emojiTarea

  if (titulo.value === '' && tiempo.value === '') {
    alert('Minimo agregá un titulo y un tiempo');
  } else {
    // create a new task object
    console.log(tiempo.value)
    let getTiempo = addDays(parseInt(tiempo.value))

    let newTask = {
      titulo: titulo.value,
      descripcion: descripcion.value,
      tiempo: getTiempo,
      emoji: emojiTarea.value,
      done: false
    }
    // add the new task to the array
    tasks.push(newTask);
    // save the new task to the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // get the tasks from the local storage

    getTasks();

    form.reset();
  }
}

function getTasks () {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let html = '';


  // esta función calcula el tiempo que queda para la tarea
  function timeLeft (tiempo) {
    let date = new Date();
    let tiempoDate = new Date(tiempo);
    let timeLeft = tiempoDate - date;
    console.log(date)
    console.log(tiempoDate)
    console.log(timeLeft)
    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return [days, hours, minutes];
  }

  tasks.forEach((task, index) => {
    let tiempo = timeLeft(task.tiempo);
    let background = '';

    if (tiempo[0] < 2) {
      background = 'bg-danger';
      order = 'order-1';
    } else if (tiempo[0] < 5) {
      background = 'bg-warning';
      order = 'order-2';
    } else {
      background = 'bg-secondary';
      order = 'order-3';
    }

    html += `<div class="col task ${order} task-${background}">
        <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg ${background}">
          <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
            <h3 class="mb-4 display-7 lh-1 fw-bold d-flex">
            <span class="emoji">${task.emoji}</span>
            <span class="taskTit">${task.titulo}</span>
            </h3>
            <ul class="d-flex list-unstyled mt-auto">
              <li class="me-auto">
                <span class="p-1 small">En ${tiempo[0]}d y ${tiempo[1]}h tenés que hacer esta tarea</span>
              </li>
            </ul>
          </div>
        </div>
      </div>`
  });
  taskList.innerHTML = html;
}

getTasks();

form.addEventListener('submit', saveTask);
