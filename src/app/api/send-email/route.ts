import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const res = await request.blob();

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
      subject: 'Hello ✔',
      text: 'Hello worldxD',
      html: '<b>Hello world?</b>'
    });

    console.log('Message sent: %s', info.messageId);
    return new Response('Email sent succesfully', { status: 200 });
  } catch (error) {
    console.error('Error sending email', error);
    return new Response('Error sending email', { status: 500 });
  }
}
