const form = document.querySelector('#form');
const taskList = document.querySelector('.collection');
const addTask = document.querySelector('#addTask');
const filtro = document.querySelector('#filtro');
const empty = document.querySelector('#empty');

// obtengo las tareas del local storage o un array vacio
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// le agrego un evento click al boton de agregar tarea
addTask.addEventListener('click', () => {
  form.classList.toggle('d-none');
});

// le agrego un evento submit al formulario y ejecuto la funcion saveTask
form.addEventListener('submit', saveTask);

// le agrego un evento change al select de filtros
filtro.addEventListener('change', filterTasks);

function filterTasks (e) {
  // obtengo una clase desde el select de filtros
  const text = e.target.value;
  console.log(text)

  // obtengo todas las tareas
  const tasks = document.querySelectorAll('.task');

  // ahora solo dejo visibles las que coinciden con el filtro
  tasks.forEach((task) => {
    if (task.classList.contains(text)) {
      task.classList.remove('d-none');
    } else {
      task.classList.add('d-none');
    }
  })
}


// creo una funcion que agrega dias a la fecha actual
function addDays (days) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  console.log(date)
  return date;
}

function saveTask (e) {
  // evito que se envie el formulario
  e.preventDefault();

  // obtengo los valores de los inputs y los guardo en variables
  let titulo = e.target.tituloTarea
  let descripcion = e.target.descripcionTarea
  let tiempo = e.target.tiempo
  let emojiTarea = e.target.emojiTarea

  // valido que el titulo y el tiempo no esten vacios
  if (titulo.value === '' && tiempo.value === '') {
    alert('Minimo agregá un titulo y un tiempo');
  } else {
    // le sumo el tiempo que seteo el usuario a la fecha actual
    let getTiempo = addDays(parseInt(tiempo.value))

    // creo un objeto con los valores de los inputs
    let newTask = {
      titulo: titulo.value,
      descripcion: descripcion.value,
      tiempo: getTiempo,
      emoji: emojiTarea.value,
      done: false
    }
    // agrego el objeto al array de tareas
    tasks.push(newTask);

    // guardo el array de tareas en el local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // obtengo las tareas del local storage y las muestro en pantalla
    getTasks();

    // reseteo el formulario
    form.reset();
  }
}

// funcion que obtiene las tareas del local storage y las muestra en pantalla
function getTasks () {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let html = '';

  if (tasks.length === 0) {
    empty.classList.remove('d-none');
  } else {
    empty.classList.add('d-none');
  }

  // esta función calcula el tiempo que queda para la tarea y devuelve un array con los dias, horas y minutos
  function timeLeft (tiempo) {
    let date = new Date();
    let tiempoDate = new Date(tiempo);
    let timeLeft = tiempoDate - date;
    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return [days, hours, minutes];
  }

  // recorro el array de tareas y creo un html con cada tarea
  tasks.forEach((task, index) => {

    let tiempo = timeLeft(task.tiempo);
    let background = '';

    // le agrego una clase al html dependiendo de la cantidad de dias que quedan para la tarea y un orden para que se muestren en orden (gracias flexbox)
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

  // muestro las tareas en pantalla
  taskList.innerHTML = html;
}

getTasks();


