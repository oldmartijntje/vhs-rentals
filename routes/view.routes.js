import { Router } from 'express';
export const viewRouter = Router();

viewRouter.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});
viewRouter.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});