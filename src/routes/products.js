const express = require('express');
const router = express.Router();

const { productDetail, productCart, productAdd, productEdit, productsList, productAddStore, update, destroy} = require('../controllers/productsController');

const productAddValidator = require('../validations/productAddValidator');
const uploadImges = require('../middlewares/uploadImg')
const adminUserCheck = require('../middlewares/adminUserCheck');

router
        /* Listado de productos */
        .get('/', productsList)

        /*Formulario de creación de productos  */
        .get('/productAdd',adminUserCheck, productAdd)
       
        /* Acción de creación (a donde se envía el formulario)*/

        .post('/productAdd',uploadImges.single('image'), productAddValidator, productAddStore)

        /*Detalle de un producto particular*/
        .get('/productDetail/:id', productDetail)

        /* Formulario de edición de productos */
        .get('/edit/:id',adminUserCheck, productEdit)
        /* Acción de edición (a donde se envía el formulario): */
        .put('/productEdit/:id', uploadImges.single('image'), update)

        /* Acción de borrado */
        .delete('/delete/:id', destroy)

        /* Carrito de compras */
        .get('/productCart', productCart)


module.exports = router;

