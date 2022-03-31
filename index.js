const input = document.querySelector('input')
const ul = document.querySelector('ul')
const clearButton = document.querySelector('.btn-clear')
const submitButton = document.querySelector('.btn-submit')
const containerItems = document.querySelector('.container__items')
const containerBtnClear = document.querySelector('.container__btn-clear')
const form = document.querySelector('form')
const li = document.querySelector('li')

const containerValidation = document.createElement('div')
const span = document.createElement('span')

let editElement
let editFlag = false
let editId = ""

form.addEventListener('submit', creatingLi)
clearButton.addEventListener('click', removeAllItems)
containerItems.addEventListener('click', checkItem)
window.addEventListener('DOMContentLoaded', setupItems)

function setDefault() {
  input.value = ""
  editId = ""
  editFlag = false
  submitButton.textContent = 'Add'
}

function firstLetterUppercase(text) {
  return text.charAt().toUpperCase() + text.slice(1)
}

function repeatedItem(value) {
  let items = getLocalStorage()
  
  const filteredItems = items.filter((item) => {
    const itemValue = item.value.toLowerCase()
    const inputValue = value.toLowerCase()
    if (itemValue == inputValue) {
      return itemValue
    }
  })
  
  return filteredItems
}

function displayValidation(text, action) {
  containerValidation.classList.add('container__validation')
  form.insertAdjacentElement('afterbegin', containerValidation)
  containerValidation.append(span)
  span.textContent = text
  span.classList.add(`alert-${action}`)
  removeValidation(action)
}

function removeValidation(action) {
  setTimeout(() => {
    span.classList.remove(`alert-${action}`)
    span.textContent = ""
    containerValidation.remove()
  }, 1000)
}

function createContainerItem(value, containerItem) {
  containerItem.classList.add('container__item')
  containerItem.innerHTML = `
  <li>${firstLetterUppercase(value)}</li> 
  <div class="container__btns"> 
    <button onclick="getItemToEdit(event)" type="button" class="btn-edit">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button onclick="removeItem(event)" type="button" class="btn-remove" >
      <i class="fa-solid fa-x"></i>
    </button>
  </div>`
}

function setAttrContainerItem(id, isChecked, containerItem) {
  let attr = document.createAttribute("data-id")
  let check = document.createAttribute("isChecked")
  check.value = isChecked
  attr.value = id
  containerItem.setAttributeNode(attr)
  containerItem.setAttributeNode(check)
}

function isPluralItem(value, textPlural, textSingular) {
  const endsWithS = input.value.endsWith('s')
  return endsWithS
  ? `"${firstLetterUppercase(value)}" ${textPlural}`
  : `"${firstLetterUppercase(value)}" ${textSingular}`
}

function createItem(value) {
  const id = new Date().getTime().toString()
  const containerItem = document.createElement('div')
  let isChecked = false

  createContainerItem(value, containerItem)
  setAttrContainerItem(id, isChecked, containerItem)
  
  if (repeatedItem(value).length > 0) {
    displayValidation(isPluralItem(value, 'Já foram adicionados', 'Já foi adicionado'), 'error')
  } else {
    addToLocalStorage(id, value, isChecked)
    ul.appendChild(containerItem)
    displayValidation(isPluralItem(value, 'foram adicionados', 'foi adicionado'), `successe`)
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

  if (repeatedItem(value).length > 0) {
    displayValidation(
      isPluralItem(value, 'Já foram adicionados', 'Já foi adicionado'), 'error'
    )
  } else {
    editElement.innerHTML = firstLetterUppercase(value);
    displayValidation('Item foi alterado', 'change')
    editLocalStorage(editId, value)
    setDefault()
  }
}

function creatingLi(e) {
  e.preventDefault()
  const value = input.value
  
  if (value !== '' && !editFlag) {
    containerItems.style.display = 'block'
    containerBtnClear.style.display = 'flex'
    createItem(value)
  } else if (value !== '' && editFlag) {
    editItem(value)
  } else if (value === '') {
    displayValidation('Campo está vazio', 'error')
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
  displayValidation('Lista foi limpa', 'successe')
  localStorage.removeItem("list")
  setDefault()
}

function checkItem(e) {
  const isContainerItem = e.target.className === 'container__item'
  const isLi = e.target.localName === 'li'

  if (isContainerItem || isLi) {
    e.target.setAttribute('ischecked', true)
    e.target.style.textDecoration = 'line-through'
  }

  checkFromLocalStorage(e)
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

function addToLocalStorage(id, value, isChecked) {
  const props = { id, value, isChecked}
  let items = getLocalStorage()
  items.push(props)
  localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : []
}

function checkFromLocalStorage(e) {
  const idContainer = e.srcElement.dataset.id
  const idFromLi = e.srcElement.parentElement.dataset.id
  const isLi = e.target.localName === 'li'
  const isElement = e.target.className === 'container__item'

  if (isElement || isLi) {
    let items = getLocalStorage()

    items = items.map((item) => {
      if (item.id === idContainer || item.id === idFromLi) {
        item.isChecked = true
      }
      return item
    })
    localStorage.setItem("list", JSON.stringify(items))
  }
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
      loadListItem(item.id, item.value, item.isChecked)
    })
  }
}

function loadListItem(id, value, isChecked) {
  const containerItem = document.createElement("div")
  containerItems.style.display = 'block'
  containerBtnClear.style.display = 'flex'
  createContainerItem(value, containerItem)
  setAttrContainerItem(id, isChecked, containerItem)
  if (isChecked) {
    containerItem.style.textDecoration = 'line-through'
  }

  ul.append(containerItem)
}
