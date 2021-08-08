'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');
const { validate } = use('Validator');

/**
 * Resourceful controller for interacting with users
 */
class UserController {
    /**
     * Show a list of all users.
     * GET users
     *
     * @param {object} ctx
     * @param {Request} ctx.auth
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index ({ auth, response, view }) {
        try {
            await auth.check();
            await auth.getUser();
            return response.route('tasks');
        } catch (error) {
            return view.render('users.index');
        }
    }

    /**
     * Render a form to be used for creating a new user.
     * GET users/create
     *
     * @param {object} ctx
     * @param {View} ctx.view
     */
    async create ({ view }) {
        return view.render('users.create');
    }

    /**
     * Create/save a new user.
     * POST users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Session} ctx.session
     * @param {Response} ctx.response
     */
    async store ({ request, session, response }) {
        const { username, email, password, rpassword } = request.all();

        if (password !== rpassword){
            response.status(401);
            session.flash({ alert: "Passwords are not equals." });
            return response.redirect('back');
        }

        try{
            const userVerify = await User.findBy('username', username);
            
            if (userVerify !== null){
                session.flash({ warning: "User already exists." });
                return response.redirect('back');
            }
            
            const user = await User.create({
                email,
                password,
                username
            });
            session.flash({ notification: '¡User registred success!' });
        } catch (error){
            session.flash({ alert: error.message });
        }

        return response.redirect('back');
    }

    /**
     * Login a user
     * POST users
     * 
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async login({request, auth, session, response, view}){
        const data = request.only(['username', 'password']);
        try {
            await auth.check();
            await auth.getUser();
            return response.route('tasks');
        } catch (error) {
            try {
                await auth.attempt(data.username, data.password)
                return response.route('tasks');
            } catch (error) {
                response.status(401);
                session.flash({ alert: 'Invalid username or password' });
                return response.redirect('back');
            }
        }
    }

    /**
     * Logout a user
     * GET users
     * 
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async logout({auth, session, response}){
        try {
            const user = await auth.getUser();
            await auth.authenticator('jwt').revokeTokensForUser(user);
            await auth.logout();
            session.clear();
            return response.route('/');
        } catch (error) {
            session.flash({ alert: 'An error occurred while logging out.' });
            return response.redirect('back');
        }
    }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show ({ params, request, response, view }) {

    }

    /**
     * Render a form to update an existing user.
     * GET users/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit ({ auth, params, request, response, view }) {

    }

    /**
     * Update user details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update ({ auth, params, request, response }) {
        
    }
}

module.exports = UserController
