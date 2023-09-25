import { Router } from 'express';
import { customersRoutes } from './components(apps)/customers';
import { driversRidesrRoutes } from './components(apps)/driversAndRiders/routes/routes';

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
        this.router.use('/customer', customersRoutes.router)
        this.router.use('/drivers-riders', driversRidesrRoutes.router)
    }
}


export const routes = new Routes();