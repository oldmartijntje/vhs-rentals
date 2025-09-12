import { Router } from 'express';
export const viewRouter = Router();

viewRouter.get('/', (req, res) => {
    res.render('pages/home', { title: 'Home' });
});
viewRouter.get('/login', (req, res) => {
    res.render('pages/loginpage/customer-login', { title: 'Login' });
});
viewRouter.get('/staff/login', (req, res) => {
    res.render('pages/loginpage/staff-login', { title: 'Login' });
});
viewRouter.get('/About', (req, res) => {
    res.render('pages/about', { title: 'About' });
});

// 404 handler
viewRouter.use((req, res) => {
    res.status(404).render('pages/404', { title: '404' });
});