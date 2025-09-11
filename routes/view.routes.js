import { Router } from 'express';
export const viewRouter = Router();

viewRouter.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});
viewRouter.get('/login', (req, res) => {
    res.render('loginpage/customer-login', { title: 'Login' });
});
viewRouter.get('/staff/login', (req, res) => {
    res.render('loginpage/staff-login', { title: 'Login' });
});
viewRouter.get('/About', (req, res) => {
    res.render('about', { title: 'About' });
});