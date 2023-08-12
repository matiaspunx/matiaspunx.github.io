const form = document.querySelector('#form');
const taskList = document.querySelector('.collection');
const addTask = document.querySelector('#addTask');
const filtro = document.querySelector('#filtro');
const empty = document.querySelector('#empty');
const cerrarForm = document.querySelector('#cerrarForm');

let isEditing = false;

// obtengo las tareas del local storage o un array vacio
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// le agrego un evento click al boton de agregar tarea
addTask.addEventListener('click', () => {
  form.classList.toggle('d-none');
});

// le agrego un evento click al boton de cerrar el formulario
cerrarForm.addEventListener('click', () => {
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
  // evito que se envié el formulario
  e.preventDefault();

  // obtengo los valores de los inputs y los guardo en variables
  let titulo = e.target.tituloTarea
  let descripcion = e.target.descripcionTarea
  let tiempo = e.target.tiempo
  let emojiTarea = e.target.emojiTarea

  // valido que el titulo y el tiempo no estén vacíos
  if (titulo.value === '' && tiempo.value === '') {
    alert('Mínimo agregá un titulo y un tiempo');
  } else {
    if (isEditing === false) {
      // le sumo el tiempo que seteo el usuario a la fecha actual
      let getTiempo = addDays(parseInt(tiempo.value))

      // creo un objeto con los valores de los inputs
      let newTask = {
        titulo: titulo.value,
        descripcion: descripcion.value,
        tiempo: getTiempo,
        tiempoOriginal: tiempo.value,
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
      form.classList.add('d-none');
    } else {
      console.log('estás editando una tarea')
    }
  }
}

// creo una funcion para eliminar una tarea
function deleteTask (index) {
  // elimino la tarea del array
  tasks.splice(index, 1);

  // guardo el array de tareas en el local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // obtengo las tareas del local storage y las muestro en pantalla
  getTasks();
}

// create a function to edit a task
function editTask (index) {
  isEditing = true;

  // Get the tasks from the local storage or an empty array
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Get the task to edit
  const task = tasks[index];

  // Get the form inputs
  const titulo = document.querySelector('#tituloTarea');
  const descripcion = document.querySelector('#descripcionTarea');
  const tiempo = document.querySelector('#tiempo');
  const emojiTarea = document.querySelector('#emojiTarea');

  // Set the form inputs with the task values
  titulo.value = task.titulo;
  descripcion.value = task.descripcion;
  tiempo.value = task.tiempoOriginal;
  emojiTarea.value = task.emoji;

  console.log('tiempo orig ', task.tiempoOriginal)

  // Show the form
  form.classList.remove('d-none');

  // Save the edited task when the form is submitted
  form.addEventListener('submit', (e) => {
    event.preventDefault();

    let titulo = e.target.tituloTarea
    let descripcion = e.target.descripcionTarea
    let tiempo = e.target.tiempo
    let emojiTarea = e.target.emojiTarea

    if (titulo.value !== '' && tiempo.value !== '') {

      let getTiempo = addDays(parseInt(tiempo.value))

      // Update the task with the new values
      task.titulo = titulo.value;
      task.descripcion = descripcion.value;
      task.tiempo = getTiempo;
      task.tiempoOriginal = tiempo.value;
      task.emoji = emojiTarea.value;

      // Save the tasks array in the local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));

      // Hide the form
      form.classList.add('d-none');
      form.reset();

      // Get the tasks from the local storage and show them in the screen
      getTasks();
      isEditing = false;
    } else {
      console.log('Mínimo agregá un titulo y un tiempo');
    }
  });
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
    // calculamos los días, horas y minutos que quedan para la tarea
    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    //let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    //return [days, hours, minutes];
    return [days];
  }

  // recorro el array de tareas y creo un html con cada tarea
  tasks.forEach((task, index) => {

    let tiempo = timeLeft(task.tiempo);
    let background = '';
    let order = '';

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

    // cambio como se muestra el tiempo que queda para la tarea dependiendo de la cantidad de dias que quedan
    let timeLeftLang = 'Hacer en ' + tiempo[0] + ' días';
    if (tiempo[0] === 1) {
      timeLeftLang = 'Hacer en ' + tiempo[0] + ' día';
    } else if (tiempo[0] === 0) {
      timeLeftLang = '¡Hacer hoy!';
    }

    html += `<div class="col col-12 col-sm-6 col-md-6 col-xl-3 task ${order} task-${background}">
        <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg ${background}">
          <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
            <h3 class="mb-4 display-7 lh-1 fw-bold d-flex">
            <span class="emoji">${task.emoji}</span>
            <span class="taskTit">${task.titulo}</span>
            </h3>
            <ul class="d-flex list-unstyled mt-auto">
              <li class="me-auto">
                <span class="p-1 small">${timeLeftLang}</span>
              </li>
            </ul>
            <div class="d-flex justify-content-end">
              <button class="btn btn-outline-light btn-sm me-2" onclick="deleteTask(${index})">Eliminar</button> <button class="btn btn-outline-light btn-sm" onclick="editTask(${index})">Editar</button>
            </div>
          </div>
        </div>
      </div>`
  });

  // muestro las tareas en pantalla
  taskList.innerHTML = html;
}

// ejecuto la funcion getTasks
getTasks();


