const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  it("Migrate deployed successfully", async () => {
    const address = this.tasksContract.address;

    assert.notEqual(address, null); // check if address is null
    assert.notEqual(address, 0x0); // check if address is 0x0
    assert.notEqual(address, ""); // check if address is empty
    assert.notEqual(address, undefined); // check if address is undefined
  });

  it("Get Tasks List", async () => {
    const taskCounter = await this.tasksContract.taskCounter();

    const task = await this.tasksContract.tasks(taskCounter);

    assert.equal(task.id.toNumber(), taskCounter);
    assert.equal(task.description, "Task 1 description");
    assert.equal(task.title, "Task 1");
    assert.equal(task.done, false);
  });

  it("Task created successfully", async () => {
    const result = await this.tasksContract.createTask(
      "Task 2",
      "Task 2 description"
    );
    const taskEvent = await result.logs[0].args;

    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.description, "Task 2 description");
    assert.equal(taskEvent.title, "Task 2");
    assert.equal(taskEvent.done, false);
  });

  it("Task toogle successfully", async () => {
    const result = await this.tasksContract.toogleDone(1);
    const taskEvent = await result.logs[0].args;
    const task = await this.tasksContract.tasks(1);

    assert.equal(task.done, true);
    assert.equal(taskEvent.done, true);
    assert.equal(taskEvent.id.toNumber(), 1);
  });


  


});
