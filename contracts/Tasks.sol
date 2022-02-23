// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskContract {
    uint256 public counter = 0;

    constructor() {
        string memory _title = "Tarea de Test";
        string memory _description = "Esta es una tarea de ejemplo";
        createTask(_title, _description);
    }

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 dateAdd;
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 dateAdd
    );

    event TaskToggleDone(uint256 id, bool done);

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description)
        public
    {
        counter += 1;
        uint256 _dateAdd = block.timestamp;
        bool _done = false;
        tasks[counter] = Task(counter, _title, _description, _done, _dateAdd);
        emit TaskCreated(counter, _title, _description, _done, _dateAdd);
    }

    function toggleDone(uint256 _id) public {
        tasks[_id].done = !tasks[_id].done;
        emit TaskToggleDone(_id, tasks[_id].done);
    }
}
