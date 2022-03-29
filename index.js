/* eslint-disable no-unused-vars */
const containerSubmit = document.querySelector('.container__submit')
const input = document.querySelector('input')
const ul = document.querySelector('ul')
const clearButton = document.querySelector('.btn-clear')
const submitButton = document.querySelector('.btn-submit')
const containerItems = document.querySelector('.container__items')
const containerBtnClear = document.querySelector('.container__btn-clear')
const form = document.querySelector('form')

const containerValidation = document.createElement('div')
const span = document.createElement('span')

let editElement
let editFlag = false
let editId = ""

form.addEventListener('submit', creatingLi)
clearButton.addEventListener('click', removeAllItems)
window.addEventListener('DOMContentLoaded', () => setupItems())

function setDefault() {
  input.value = ''
  editId = ""
  editFlag = false
  submitButton.textContent = '  Add'
}

function firstLetterUppercase(text) {
  return text.charAt().toUpperCase() + text.slice(1)
}

function displayValidation(text, action) {
  containerValidation.classList.add('container__validation')
  containerSubmit.insertAdjacentElement('afterend', containerValidation)
  containerValidation.append(span)
  span.textContent = text
  span.classList.add(`alert-${action}`)
  removeValidation(action)
}

function removeValidation(action) {
  setTimeout(() => {
    span.textContent = ""
    span.classList.remove(`alert-${action}`)
    containerValidation.remove()
  }, 2000)
}

function createContainerItem(value, containerItem) {
  containerItem.classList.add('container__item')
  containerItem.innerHTML = `
  <li>${firstLetterUppercase(value)}</li> 
  <div class="container__btns"> 
    <button onclick="getItemToEdit(event)" type="button" class="btn-edit">
      <i class="fa-solid fa-pen"></i>
    </button>
    <button onclick="removeItem(event)" type="button" class="btn-remove" >
      <i class="fa-solid fa-x"></i>
    </button>
  </div>`
}

function setAttrContainerItem(id, containerItem) {
  let attr = document.createAttribute("data-id")
  attr.value = id
  containerItem.setAttributeNode(attr)
}

function createItem(value) {
  const id = new Date().getTime().toString()
  const containerItem = document.createElement('div')

  let filteredItems = []
  let items = getLocalStorage()

  createContainerItem(value, containerItem)
  setAttrContainerItem(id, containerItem)

  filteredItems = items.filter((item) => {
    if (item.value == value) {
      return item.value
    }
  })

  if(filteredItems.length > 0) {
    displayValidation('Já existe nesta lista', 'error')
  } else {
    addToLocalStorage(id, firstLetterUppercase(value) )
    ul.appendChild(containerItem)
  }

  setDefault()
}

function getItemToEdit(e) {
  editFlag = true
  const liGet = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling

  submitButton.textContent = 'Edit'
  input.value = editElement.innerHTML
  editId = liGet.dataset.id;
  input.focus()
}

function editItem(value) {
  editElement.innerHTML = value;
  displayValidation('Valor editado', 'change')
  editLocalStorage(editId, value)
  setDefault()
}

function creatingLi(e) { // mudar da function
  e.preventDefault()
  const value = input.value

  if (value !== '' && !editFlag) {
    containerItems.style.display = 'block'
    containerBtnClear.style.display = 'flex'
    createItem(value)
  } else if(value !== '' && editFlag) {
    editItem(value)
  } else if (value === '') {
    displayValidation('Campo vazio', 'error')
  }
}


function removeAllItems() {
  if (ul.childElementCount > 0) {
    while(ul.firstChild) {
      ul.removeChild(ul.firstChild)
    }
  }
  containerBtnClear.style.display = 'none'
  containerItems.style.display = 'none'
  displayValidation('Lista limpa', 'successe')
  localStorage.removeItem("list")
  setDefault()
}

function removeItem(e) {
  const liGet = e.currentTarget.parentElement.parentElement
  const id = liGet.dataset.id

  ul.removeChild(liGet)
  removeFromLocalStorage(id)
  setDefault()

  if (ul.childElementCount == 0) {
    containerItems.style.display = 'none'
    containerBtnClear.style.display = 'none'
  }
}

function addToLocalStorage(id, value) {
  const grocery = { id, value }
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : []
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage()

  items = items.filter((item) => {
    if (item.id !== id) {
      return item
    }
  })

  localStorage.setItem("list", JSON.stringify(items))
}

function editLocalStorage(id, value) {
  let items = getLocalStorage()

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem("list", JSON.stringify(items))
}

function setupItems() {
  let items = getLocalStorage()
  if (items.length > 0) {
    items.forEach((item) => {
      loadListItem(item.id, item.value)
      console.log(item.value)
    })
  }
}

function loadListItem(id, value) {
  const containerItem = document.createElement("div")
  containerItems.style.display = 'block'
  containerBtnClear.style.display = 'flex'
  createContainerItem(value, containerItem)
  setAttrContainerItem(id, containerItem)

  ul.append(containerItem)
}
