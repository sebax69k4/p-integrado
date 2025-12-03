export default ({ env }) => {
  const plugins: Record<string, any> = {};
  
  // Solo configurar email si las credenciales SMTP están definidas
  if (env('SMTP_USER') && env('SMTP_PASS')) {
    plugins.email = {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST', 'smtp.gmail.com'),
          port: env.int('SMTP_PORT', 587),
          secure: false,
          auth: {
            user: env('SMTP_USER'),
            pass: env('SMTP_PASS'),
          },
        },
        settings: {
          defaultFrom: env('SMTP_FROM', 'noreply@ecoformarket.cl'),
          defaultReplyTo: env('SMTP_REPLY_TO', 'soporte@ecoformarket.cl'),
        },
      },
    };
  }
  
  return plugins;
};
