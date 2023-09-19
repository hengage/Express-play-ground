import { Request, Response } from 'express';
import { customerService } from '../services/customer.services';

class CustomerController {

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const customerData = req.body; // Assuming you send customer data in the request body
      const savedCustomer = await customerService.signup(customerData);
      res.status(201).json(savedCustomer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const customerController = new  CustomerController;
