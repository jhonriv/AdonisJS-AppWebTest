'use strict'

const UserController = require('./UserController');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Task = use('App/Models/Task');
const User = use('App/Models/User');
const { validate } = use('Validator');
const VerificationsService = use('App/Services/VerificationsService');

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
    /**
     * Show a list of all tasks.
     * GET tasks
     *
     * @param {object} ctx 
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index ({ auth, request, response, view, session }) {
        try{
            const user = await auth.getUser();
            const tasks = await user.tasks().fetch();
            const data = await User.find(user.id);
            return view.render('tasks.index', { tasks: tasks.toJSON(), user:", " + data.username + " - " + data.email });
        } catch (error){
            console.log("Error: " + error.message);
            return response.redirect('/logout');
        }
    }

    /**
     * Create/save a new task.
     * POST tasks
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {Session} ctx.session
     * @param {Authentication} ctx.auth
     */
    async store ({ auth, request, response, session }) {
        try{
            await auth.check();
            const user = await auth.getUser();

            try{
                const { title } = request.all();
                const validation = await validate(title, {
                    title: 'required|min:3|max:255'
                });
    
                if (validation.fails()){
                    const send = validation.messages();
                    session.flash({ alert: send[0].message + ' (Maximum 255 characters)' });
                    return response.redirect('back');
                }
    
                const task = await user.tasks().create({ title });
                session.flash({ notification: '¡Task added success!' });
            } catch (error){
                session.flash({ alert: error.message });
            }

            return response.redirect('back');
        } catch (error){
            return response.redirect('/');
        }
    }

    /**
     * Display a single tasks.
     * GET tasks/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show ({ auth, params, response, view }) {
        try{
            const id = params.id;
            const task = await Task.find(id);
            return response.status(200).send(task);
        } catch (error){
            console.log(error.message);
            return response.status(400);
        }

    }

    /**
     * Update task details.
     * PUT or PATCH tasks/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update ({ auth, params, request, session, response }) {
        try{
            await auth.check();
            const user = await auth.getUser();
            try{
                const { id } = params;
                const task = await Task.find(id);
                VerificationsService.VerificationAuth(task, user);

                const { title } = request.only('title');
                const validation = await validate(title, {
                    title: 'required|min:3|max:255'
                });
    
                if (validation.fails()){
                    const send = validation.messages();
                    session.flash({ alert: send[0].message + ' (Maximum 255 characters)' });
                    return response.redirect('back');
                }
                
                await user.tasks().where('id', id).update({ title: title});
                session.flash({ notification: '¡Task edited success!' });
            } catch (error){
                console.log(error.message);
                session.flash({ alert: error.message });
            }
            return response.redirect('/tasks');
        } catch (error){
            console.log("ckeck");
            return response.redirect('/');
        }
    }

    /**
     * Delete a task with id.
     * DELETE tasks/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy ({ auth, params, session, response }) {
        try{
            await auth.check();
            const user = await auth.getUser();
            try{
                const { id } = params;
                const task = Task.find(id);
                Verification.VerificationAuth(task, user);
                await task.delete();
                session.flash({ notification: '¡Task deleted success!' });
            } catch (error){
                session.flash({ alert: error.message });
            }
            return response.redirect('tasks');
        } catch (error){
            return response.redirect('/');
        }
    }
}

module.exports = TaskController
