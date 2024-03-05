import nodemailer from 'nodemailer';

import prisma from '@/lib/prisma';
import { receiptEmailFormSchema } from '@/lib/validations/form';

export async function POST(request: Request) {
  const res = await request.json();

  const { image, studentId } = res;
  const { email } = receiptEmailFormSchema.parse(res);

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      }
    });

    const info = await transporter.sendMail({
      from: '"My Little House" noreply.mylittlehouse@gmail.com',
      to: 'lautarosoffici@gmail.com',
      subject: 'Comprobante de pago',
      text: 'Registro de Pago realizado',
      html: '<b>Registro de Pago realizado</b>',
      attachments: [
        {
          filename: 'image.png',
          path: image,
          encoding: 'base64'
        }
      ]
    });

    await prisma.student.update({
      where: {
        id: studentId
      },
      data: {
        email
      }
    });

    console.log('Message sent: %s', info.messageId);
    return new Response('Email enviado correctamente', { status: 200 });
  } catch (error) {
    console.error('Error sending email', error);
    return new Response('Error al enviar email', { status: 500 });
  }
}
