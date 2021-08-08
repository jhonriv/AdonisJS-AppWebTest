'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => { 
    // Routes to users
    Route.get('/', 'UserController.index')
    Route.get('logout', 'UserController.logout')
    Route.get('users', 'UserController.create')
    Route.post('login', 'UserController.login')
    Route.post('users', 'UserController.store')
    Route.put('users/:id', 'UserController.edit').middleware('auth')

    // Routes to Tasks
    Route.get('tasks', 'TaskController.index').middleware('auth')
    Route.post('tasks', 'TaskController.store').middleware('auth')
    Route.get('tasks/:id', 'TaskController.show').middleware('auth')
    Route.put('tasks/:id', 'TaskController.update').middleware('auth')
    Route.delete('tasks/:id', 'TaskController.destroy').middleware('auth')
})
