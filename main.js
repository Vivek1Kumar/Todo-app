'use babel'; 
require('./util/db-connect'); 

var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
var Todo = mongoose.model('Todo');

var util = require('./util/util');

app.use(bodyParser.json()); 
app.use('/res', express.static('static')); 


// ROUTING
app
.route('/')
.get((req, res) => {
    res.status(200).sendFile('index.html', { root: path.join('.', 'static') }); // root file
});


app
.route('/todos/')
.get((req, res) => {
    Todo.find({})
        .sort({taskDate:-1})
        .exec( ( err, todos ) => {
            res.status(200).send({tasks: todos});
        });
})
.post(function(req, res, next) {
    var _task = JSON.parse(JSON.stringify(req.body));
        _task.task_id = util.makeid();
    var todo = new Todo();

       todo.task_id = _task.task_id,
       todo.task = _task.task,
       todo.status = false
  
  Todo.findOne({ task: _task.task }, function(err, existingTask) {

    if (existingTask) {
      return res.status(304).send('dublicate data');
    } else {
      todo.save(function(err, user) {
        return  res.status(201).send({task_id: _task.task_id});
      });
    }
  });
});


app
.route(/^\/todos\/(\w+)/)
.get((req, res) => {
    var target_task_id = req.params[0];

    Todo.find({task_id: target_task_id})
        .sort( '-updated_at' )
        .exec( ( err, todos ) => {
            if (todos.length){
                return res.status(200).send(todos[0]);
            }
            res.status(404).send('NOT FOUND');
        });
})
.delete((req, res) => {
    var target_task_id = req.params[0];
    Todo.find({})
        .exec(( err, todos ) => {
            for (var task of todos) {
                if (task.task_id === target_task_id){  
                    var taskExist = true;
                    res.status(200).send({result: "ok"});
                    task.remove((err) => {
                        if( err ) console.log('error db update');
                    });
                }
            }
            if (!taskExist) {  res.status(404).send('NOT FOUND');  }
        });
});


app.use((req, res) => { 
    return res.status(404).send('NOT FOUND');
});


// main 
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app listening on port', port);
});
