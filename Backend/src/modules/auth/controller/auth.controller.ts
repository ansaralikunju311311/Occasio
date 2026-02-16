import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await service.signup(req.body);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: user
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
