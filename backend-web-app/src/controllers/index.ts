import { Request, Response } from 'express';

class BaseController {
    getAll(req: Request, res: Response) {
        // Logic to retrieve all resources
    }

    getById(req: Request, res: Response) {
        // Logic to retrieve a resource by ID
    }

    create(req: Request, res: Response) {
        // Logic to create a new resource
    }

    update(req: Request, res: Response) {
        // Logic to update an existing resource
    }

    delete(req: Request, res: Response) {
        // Logic to delete a resource
    }
}

export default BaseController;