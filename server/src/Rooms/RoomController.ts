import { Application, Request, Response } from 'express';
import { Promise } from 'bluebird';


export class RoomController {
    public static ValidID(id: number): boolean {
        if (id) {
            return true;
        }
        return false
    }

    public static VerifyID(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const id = req.params['id'];

            if (RoomController.ValidID(id)) {
                return id;
             }
            else {
                throw 'Room not found';
            }
        })
        .catch((error) => {
            res.status(404).send(error);
        });
    }

    public static New(req: Request, res: Response): void {

    }

    public static View(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {

        });
    }

    public static Edit(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {

        });
    }

    public static Save(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {

        });
    }

    public static Control(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {

        });
    }
}
