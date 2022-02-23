document.addEventListener('DOMContentLoaded', () => App.init())

elForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = elForm.title.value
    const description = elForm.description.value
    return App.createTask(title, description)
})