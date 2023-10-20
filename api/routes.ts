import { Router } from 'express';
import { customersRoutes } from './components(apps)/customers';
import { driversRidesrRoutes } from './components(apps)/driversAndRiders/routes/routes';
import { vendorsRoutes } from './components(apps)/vendors';
import { shopsRoutes } from './components(apps)/shops';

class Routes {
    /*
        Imports and sets up all the necessary routes classes for use in the application.
        The main purpose of this class is to provide a centralized location to manage
        the routing configuration for the application, making it easier  to add, modify, or remove routes as needed.
    */
    public router: Router

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use('/customers', customersRoutes.router)
        this.router.use('/drivers-riders', driversRidesrRoutes.router)
        this.router.use('/vendors', vendorsRoutes.router)
        this.router.use('/shops', shopsRoutes.router)
    }
}


export const routes = new Routes();