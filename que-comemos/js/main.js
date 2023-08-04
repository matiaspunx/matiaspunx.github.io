console.log('Holis mundo')

let subtotal = 0
let total = 0

let form = document.getElementById('form')
let add_prod = document.getElementById('add_prod')

let h4Total = document.getElementById('total')
let calculate = document.getElementById('calculate')

form.addEventListener('submit', function (event) {
  event.preventDefault()
  let prod = document.getElementById('prod').value
  let price = document.getElementById('price').value

  // lo que tenia subtotal + lo que vale price
  subtotal += parseInt(price)

  if (prod === '' || price === '') {
    alert('Tenés que completar todos los campos')
    return
  }

  let items = document.getElementById('items')
  let li = document.createElement('li')
  li.innerHTML = `${prod} - $${price}`
  items.appendChild(li)

  h4Total.innerHTML = `El total es: $${subtotal}`

  form.reset()
  document.getElementById('prod').focus()
})

calculate.addEventListener('click', function (event) {
  let invitados = document.getElementById('invitados').value
  let divide = document.getElementById('divide')

  total = subtotal / invitados
  total = Math.round(total)

  divide.innerHTML = `El total por persona es: $${total}`
})
