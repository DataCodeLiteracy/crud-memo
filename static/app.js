const formElement = document.getElementById('memo-form')
const InputElement = document.getElementById('memo-input')
const ButtonElement = document.getElementById('memo-submit')
const UlElement = document.getElementById('memo-lists')

const displayMemo = (memo) => {
  const LiElement = document.createElement('li')
  LiElement.innerText = memo.content

  const editBtn = document.createElement('button')
  editBtn.innerText = '수정'
  editBtn.addEventListener('click', editMemo)
  editBtn.dataset.id = memo.id

  const deleteBtn = document.createElement('button')
  deleteBtn.innerText = '삭제'
  deleteBtn.addEventListener('click', deleteMemo)
  deleteBtn.dataset.id = memo.id

  LiElement.appendChild(editBtn)
  LiElement.appendChild(deleteBtn)

  UlElement.appendChild(LiElement)
}

const getMemo = async () => {
  const res = await fetch('/memos')
  const jsonRes = await res.json()
  UlElement.innerHTML = ''
  jsonRes.forEach(displayMemo)
}

const createMemo = async (value) => {
  const res = await fetch('/memos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: new Date(),
      content: value
    })
  })
  getMemo()
}

const editMemo = async (e) => {
  const id = e.target.dataset.id
  console.log(id)
  const editInput = prompt('수정할 값을 입력하세요')
  const res = await fetch(`/memos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      content: editInput
    })
  })
  getMemo()
}

const deleteMemo = async (e) => {
  const id = e.target.dataset.id
  const res = await fetch(`/memos/${id}`, {
    method: 'DELETE'
  })
  getMemo()
}

formElement.addEventListener('submit', (e) => {
  e.preventDefault()
  createMemo(InputElement.value)
  InputElement.value = ''
  InputElement.focus()
})
