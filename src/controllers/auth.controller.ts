import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { RespostaUsuario } from "../entities/RespostaUsuario";
import { ResultadoUsuario } from "../entities/ResultadoUsuario";

const JWT_SECRET = process.env.JWT_SECRET || "chave-secreta";

const generateToken = (userId: number) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

// ==========================
// REGISTRO DE USUÁRIO
// ==========================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, confirmarSenha } = req.body;

    if (senha !== confirmarSenha)
      return res.status(400).json({ status: "error", message: "As senhas não coincidem" });

    const senhaRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!senhaRegex.test(senha))
      return res.status(400).json({
        status: "error",
        message: "A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos",
      });

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const userExists = await usuarioRepo.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ status: "error", message: "Email já cadastrado" });

    const senhaHash = await bcrypt.hash(senha, 10);
    const newUser = usuarioRepo.create({ nome, email, senhaHash });
    await usuarioRepo.save(newUser);

    const token = generateToken(newUser.id);

    return res.status(201).json({
      status: "success",
      message: "Usuário criado com sucesso",
      userId: newUser.id,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Erro ao criar usuário" });
  }
};

// ==========================
// LOGIN DE USUÁRIO
// ==========================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha)
      return res.status(400).json({ status: "error", message: "E-mail e senha são obrigatórios" });

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const respostaRepo = AppDataSource.getRepository(RespostaUsuario);
    const resultadoRepo = AppDataSource.getRepository(ResultadoUsuario);

    const user = await usuarioRepo.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ status: "error", message: "E-mail não encontrado" });

    if (!user.senhaHash)
      return res.status(500).json({ status: "error", message: "Usuário sem senha cadastrada" });

    const senhaValida = await bcrypt.compare(senha, user.senhaHash);
    if (!senhaValida)
      return res.status(401).json({ status: "error", message: "Senha incorreta" });

    // Buscar respostas do usuário (seguro: se não tiver, retorna [])
    const respostas = await respostaRepo.find({ where: { idUsuario: user.id } });
    const respondeu = respostas.length > 0;

    // Buscar resultado do usuário (seguro: se não tiver, retorna null)
    const resultado = await resultadoRepo.findOne({
      where: { idUsuario: user.id },
      relations: ["perfil"],
    });
    const perfil = resultado?.perfil?.nomePerfil || null;

    const token = generateToken(user.id);

    return res.status(200).json({
      status: "success",
      message: "Login realizado com sucesso",
      data: {
        user: { id: user.id, nome: user.nome, email: user.email },
        token,
        respondeu,
        perfil,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Erro ao realizar login" });
  }
};
