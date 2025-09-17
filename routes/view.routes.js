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
viewRouter.get('/Film', (req, res) => {
    res.render('pages/film', { title: 'Film' });
});

viewRouter.get('/Staff/Edit/Film', (req, res) => {
    res.render('pages/staff/edit-film', { title: 'Edit Film' });
});
viewRouter.get('/Staff/Edit/Inventory', (req, res) => {
    res.render('pages/staff/edit-inventory', { title: 'Edit Inventory' });
});
viewRouter.get('/Catalogue', (req, res) => {
    res.render('pages/catalogue', { title: 'Catalogue' });
});


// 404 handler
viewRouter.use((req, res) => {
    res.status(404).render('pages/404', { title: '404' });
});