
import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../models/user";
import response from "../helpers/response";

export const isAdminExist: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const Admin = await User.findOne({ role: "admin" });

        if (Admin){
            console.log("Admin already exists");
            response(res, 403, "Acess denied. Admin already exists", null, "FORBIDDEN");
            return;
        } else {
            console.log("Admin does not exist");
            return next();
        }
    } catch (err) {
        console.log("Failed to check if admin exists: ", (err as Error).message);
        response(res, 401, (err as Error).message || "Not Authorized. Admin already exists", null, "INTERNAL_SERVER_ERROR");
    }
}
