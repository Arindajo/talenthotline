import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});

const sms = at.SMS;

export async function sendSMS(to: string[], message: string) {
  const result = await sms.send({ to, message });
  return result;
}
