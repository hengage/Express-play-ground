import express, {
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
import { Server } from "http";

import fileUpload from "express-fileupload";

import { dbConfig } from "../config/db.config";
import { routes } from "../routes";
import { centralErrorHandler } from "../middleware/centralErrorHandler";

class App {
  public app: Express;
  public router: Router;

  constructor() {
    this.app = express();
    this.router = Router();

    this.connectDB();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeCentralErrorMiddleware();
  }

  private connectDB = async () => {
    try {
      await dbConfig.connect();
      console.log("conected to db");
    } catch (error) {
      console.error(error);
    }
  };

  private initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload({ useTempFiles: true }));
  }

  private initializeCentralErrorMiddleware() {
    this.app.use(
      centralErrorHandler.handle404Error,
      centralErrorHandler.handle404OrServerError
    );
  }

  public initializeRoutes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Express typeScript app is set");
    });

    this.app.use("/api", routes.router);

    //   this.app.use("/api/v1", routes.router);
  }

  public listenToPort(port: string | number, node_env: string): Server {
    return this.app.listen(`${port}`, () => {
      console.log(`Server started at port ${port}. Current ENV is ${node_env}`);
    });
  }
}

export const app = new App();
