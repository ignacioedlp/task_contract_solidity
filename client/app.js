App = {
  contracts: {},
  init: async () => {
    console.log("App initialized...");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTasks();
    console.log("App initialized");
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
    console.log("Actual account => ", App.account);
  },

  loadContract: async () => {
    try {
      const res = await fetch("TasksContract.json");
      const tasksContractJSON = await res.json();
      App.contracts.TasksContract = TruffleContract(tasksContractJSON);
      App.contracts.TasksContract.setProvider(App.web3Provider);

      App.tasksContract = await App.contracts.TasksContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },

  render: () => {
    document.querySelector("#account").innerHTML = App.account;
  },

  renderTasks: async () => {
    const taskCounter = await App.tasksContract.taskCounter();
    const taskCounterNumber = taskCounter.toNumber();
    console.log("taskCounter => ", taskCounterNumber);

    let htmlPending = "";
    let htmlCompleted = "";

    for (let i = 1; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0];
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreate = task[4];

      let taskElement = `
        <div class="card card-body bg-dark mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>${taskTitle}</span>
            <div class="form-check form-switch">
              <input class="form-check-input" data-id="${taskId}" type="checkbox"  
              ${taskDone && "checked"} 
        
                onChange="App.toggleDone(this)">
              
            </div>
          </div>
            <div class="card-body">
              <p class="card-text">${taskDescription}</p>
              <p class="text-muted">${new Date(
                taskCreate * 1000
              ).toLocaleString()}</p>
            </div>         
        </div>`;
      if (!taskDone) {
        htmlPending += taskElement;
      } else {
        htmlCompleted += taskElement;
      }
    }
    if (htmlPending.length === 0) {
      document.querySelector(
        "#tasksListpending"
      ).innerHTML = `<h5 class="text-center">No pending tasks</h5>`;
    } else {
      document.querySelector("#tasksListpending").innerHTML = htmlPending;
    }

    if (htmlCompleted.length === 0) {
      document.querySelector(
        "#tasksListcompleted"
      ).innerHTML = `<h5 class="text-center">No completed tasks</h5>`;
    } else {
      document.querySelector("#tasksListcompleted").innerHTML = htmlCompleted;
    }
  },

  createTask: async (title, description) => {
    try {
      const result = await App.tasksContract.createTask(title, description, {
        from: App.account,
      });
      console.log(result.logs[0].args);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },

  toggleDone: async (elemento) => {
    const taskId = elemento.dataset.id;
    await App.tasksContract.toogleDone(taskId, { from: App.account });

    window.location.reload();
  },
};
