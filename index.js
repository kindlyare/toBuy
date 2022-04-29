/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const input = document.querySelector('input')
const ul = document.querySelector('ul')
const clearButton = document.querySelector('.clear-btn')
const submitButton = document.querySelector('.submit-btn')
const containerItems = document.querySelector('.container__items')
const containerClearBtn = document.querySelector('.container__clear-btn')
const form = document.querySelector('form')
const containerValidations = document.querySelector('.container__validations')

let editElement
let editFlag = false
let editId = ''

form.addEventListener('submit', createLi)
clearButton.addEventListener('click', removeAllItems)
containerItems.addEventListener('click', checkItem)
window.addEventListener('DOMContentLoaded', setupItems)

function setReset () {
  input.value = ''
  editId = ''
  editFlag = false
  submitButton.textContent = 'Add'
}

const firstLetterUppercase = text =>
  text.charAt().toUpperCase() + text.slice(1)

function repeatedItem (value) {
  const items = getLocalStorage()

  const filteredItems = items.filter((item) => {
    const itemValue = item.value.toLowerCase()
    const inputValue = value.toLowerCase()
    if (itemValue === inputValue) {
      return itemValue
    }
  })

  return filteredItems
}

function createAlert (text, action) {
  const containerAlert = document.createElement('div')
  const errorAction = action === 'error'
  if (containerValidations.children.length < 5 && errorAction) {
    containerAlert.classList.add('container__validation')
    containerAlert.innerHTML = `<span class='alert-${action}'>${text}</span>`
  } else if (!errorAction) {
    containerAlert.classList.add('container__validation')
    containerAlert.innerHTML = `<span class='alert-${action}'>${text}</span>`
  }
  containerValidations.append(containerAlert)
  const messages = []
  messages.push(containerAlert)
  removeValidation(messages)
}

function removeValidation (message) {
  setTimeout(() => {
    const firstMessage = message.shift()
    firstMessage.remove()
  }, 2500)
}

function createContainerItem (value, containerItem) {
  containerItem.classList.add('container__item')
  containerItem.innerHTML = `
  <li class="item">${firstLetterUppercase(value)}</li> 
  <div class="container__btns"> 
    <button onclick="getItemToEdit(event)" type="button" class="edit-btn">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button onclick="removeItem(event)" type="button" class="remove-btn" >
      <i class="fa-solid fa-x"></i>
    </button>
  </div>`
}

function setAttrContainerItem (id, isChecked, containerItem) {
  const attr = document.createAttribute('data-id')
  const check = document.createAttribute('isChecked')
  check.value = isChecked
  attr.value = id
  containerItem.setAttributeNode(attr)
  containerItem.setAttributeNode(check)
}

function isPluralItem (value, textPlural, textSingular) {
  const endsWithS = input.value.endsWith('s')
  return endsWithS
    ? `"${firstLetterUppercase(value)}" ${textPlural}`
    : `"${firstLetterUppercase(value)}" ${textSingular}`
}

function createItem (value) {
  const id = new Date().getTime().toString()
  const containerItem = document.createElement('div')
  const isChecked = false

  createContainerItem(value, containerItem)
  setAttrContainerItem(id, isChecked, containerItem)

  if (repeatedItem(value).length > 0) {
    createAlert(
      isPluralItem(
        value, 'Já foram adicionados', 'Já foi adicionado'),
      'error'
    )
  } else {
    addToLocalStorage(id, value, isChecked)
    ul.appendChild(containerItem)
    createAlert(
      isPluralItem(value, 'foram adicionados', 'foi adicionado'),
      'successe'
    )
  }
  setReset()
}

function getItemToEdit (e) {
  editFlag = true
  const liGet = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling

  submitButton.textContent = 'Edit'
  input.value = editElement.innerHTML
  editId = liGet.dataset.id
  input.focus()
}

function editItem (value) {
  if (repeatedItem(value).length > 0) {
    createAlert(
      isPluralItem(value, 'Já foram adicionados', 'Já foi adicionado'),
      'error'
    )
  } else {
    editElement.innerHTML = firstLetterUppercase(value)
    createAlert('Alterado com sucesso', 'successe')
    editLocalStorage(editId, value)
    setReset()
  }
}

function createLi (e) {
  e.preventDefault()
  const value = input.value.trim()

  if (value !== '' && !editFlag) {
    containerItems.style.display = 'block'
    containerClearBtn.style.display = 'flex'
    createItem(value)
  } else if (value !== '' && editFlag) {
    editItem(value)
  } else if (value === '') {
    createAlert('Campo está vazio', 'error')
  }
}

function removeAllItems () {
  if (ul.childElementCount > 0) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild)
    }
  }
  containerClearBtn.style.display = 'none'
  containerItems.style.display = 'none'
  createAlert('Lista foi limpa', 'successe')
  localStorage.removeItem('list')
  setReset()
}

function checkItem (e) {
  const isContainerItem = e.target.className === 'container__item'
  const isLi = e.target.localName === 'li'

  if (isContainerItem || isLi) {
    e.target.setAttribute('ischecked', true)
    e.target.style.textDecoration = 'line-through'
  }

  checkFromLocalStorage(e)
}

function removeItem (e) {
  const liGet = e.currentTarget.parentElement.parentElement
  const id = liGet.dataset.id

  ul.removeChild(liGet)
  removeFromLocalStorage(id)
  setReset()

  if (ul.childElementCount === 0) {
    containerItems.style.display = 'none'
    containerClearBtn.style.display = 'none'
  }
}

function getLocalStorage () {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : []
}

function addToLocalStorage (id, value, isChecked) {
  const props = { id, value, isChecked }
  const items = getLocalStorage()
  items.push(props)
  localStorage.setItem('list', JSON.stringify(items))
}

function checkFromLocalStorage (e) {
  const containerId = e.srcElement.dataset.id
  const liFromId = e.srcElement.parentElement.dataset.id
  const isLi = e.target.localName === 'li'
  const isContainerItem = e.target.className === 'container__item'

  if (isContainerItem || isLi) {
    let items = getLocalStorage()

    items = items.map((item) => {
      if (item.id === containerId || item.id === liFromId) {
        item.isChecked = true
      }
      return item
    })
    localStorage.setItem('list', JSON.stringify(items))
  }
}

function removeFromLocalStorage (id) {
  let items = getLocalStorage()

  items = items.filter((item) => {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage (id, value) {
  let items = getLocalStorage()

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}

function setupItems () {
  const items = getLocalStorage()
  if (items.length > 0) {
    items.forEach(item => {
      loadListItem(item.id, item.value, item.isChecked)
    })
  }
}

function loadListItem (id, value, isChecked) {
  const containerItem = document.createElement('div')
  containerItems.style.display = 'block'
  containerClearBtn.style.display = 'flex'
  createContainerItem(value, containerItem)
  setAttrContainerItem(id, isChecked, containerItem)
  if (isChecked) {
    containerItem.style.textDecoration = 'line-through'
  }

  ul.append(containerItem)
}
