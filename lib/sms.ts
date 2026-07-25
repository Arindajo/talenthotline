import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});

const sms = at.SMS;

export async function sendSMS(to: string[], message: string) {
  const result = await sms.send({ to, message });
  console.log("AT SMS result:", JSON.stringify(result));

  if (!result?.SMSMessageData) {
    throw new Error(`AT API returned unexpected response: ${JSON.stringify(result)}`);
  }

  const recipients = result.SMSMessageData.Recipients || [];
  if (recipients.length === 0) {
    throw new Error(`AT API returned no recipients. Response: ${JSON.stringify(result)}`);
  }

  for (const r of recipients) {
    if (r.statusCode !== 100 && r.statusCode !== 101 && r.statusCode !== 102) {
      throw new Error(`SMS failed for ${r.number}: ${r.status} (code: ${r.statusCode})`);
    }
  }

  return result;
}
