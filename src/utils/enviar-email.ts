import nodemailer from 'nodemailer';

interface MandarEmailProp {
  destino: string;
  assunto: string;
  conteudo: string;
}

interface ResultadoEnvio {
  sucesso: boolean;
  mensagemId?: string;
  aceitos?: string[];
  rejeitados?: string[];
  retornoServidor?: string;
  erro?: unknown;
}

export async function mandarEmail({ destino, assunto, conteudo }: MandarEmailProp): Promise<ResultadoEnvio> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destino,
      replyTo: process.env.EMAIL_USER,
      subject: assunto,
      text: conteudo,
    });
    console.log('E-mail enviado com sucesso!', info);

    return {
      sucesso: true,
      mensagemId: info.messageId,
      aceitos: info.accepted as string[],
      rejeitados: info.rejected as string[],
      retornoServidor: info.response,
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      sucesso: false,
      erro: error,
    };
  }
}
