const elForm = document.getElementById('addTask')
const elTaskList = document.getElementById('taskList')
const elAccount = document.getElementById('account')

const initialApp = {
    webProvider: null,
    contracts: {
        taskContract: null,
    },
    taskContract: null,
    taskList: [],
}

const metaMaskLoader = {

}

const App = {
    ...initialApp,

    init: async function () {
        await this.loadMetaMask()
        await this.loadAccount()
        await this.loadContract()
        await this.showAccount()
        await this.loadTaskList()
    },

    loadMetaMask: async function () {
        if (window.ethereum) {
            this.webProvider = window.ethereum
            return await this.setRequestEthereum()
        } else {
            alert('No hay ningún provider de Ethereum. Instala MetaMask')
        }
    },

    setRequestEthereum: async function () {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    },

    loadAccount: async function () {
        const accounts = await this.webProvider.request({
            method: 'eth_requestAccounts'
        })
        this.account = accounts[0]
    },

    loadContract: async function () {
        await fetch('TaskContract.json')
            .then(r => r.json())
            .then(async r => {
                this.contracts.taskContract = TruffleContract(r)
                this.contracts.taskContract.setProvider(this.webProvider)
                this.taskContract = await this.contracts.taskContract.deployed()
            })
            .catch(console.error)
    },

    loadTaskList: async function () {
        this.taskList = []
        const counter = await this.taskContract.counter()
        const counterNumber = counter.toNumber()
        for (let i = 0; i <= counterNumber; i += 1) {
            await this.taskContract.tasks(i)
                .then(task => this.taskList.push(task))
                .catch(console.error)
        }
        this.renderTasks()
    },

    showAccount: function () {
        elAccount.innerHTML = this.account
    },

    renderTasks: function () {
        elTaskList.innerHTML = ''
        this.taskList.forEach(this.renderTask)
    },

    renderTask: function (task) {
        const { title, description, dateAdd, done, id } = task
        if (title.length && description.length && dateAdd > 0) {
            const html = `<div class="task">
                <label class="switch">
                    <input type="checkbox" ${done ? 'checked' : ''} onchange="App.toggleDone(${id})">
                    <span class="slider round"></span>
                </label>
                <h3>${title}</h3>
                <p>${description}</p>
                <small>${new Date(dateAdd * 1000).toLocaleString()}</small>
            </div>`
            const initialHtml = elTaskList.innerHTML
            elTaskList.innerHTML = html + initialHtml
        }
    },

    toggleDone: async function (id) {
        this.taskContract.toggleDone(id, {
            from: this.account
        }).then(() => this.loadTaskList())
    },

    createTask: async function (title, description) {
        await this.taskContract.createTask(title, description, {
            from: this.account
        })
        this.loadTaskList()
    }
}