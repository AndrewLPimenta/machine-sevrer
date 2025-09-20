import { Request, Response } from "express"

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    return res.json({
      status: "success",
      message: "Logout realizado com sucesso",
    })
  } catch (error: any) {
    console.error("Erro no logout:", error)
    res.status(500).json({ status: "error", message: "Erro ao realizar logout" })
  }
}
