import { OTPTemplate } from "@/components/templates/otp.template";
import { env } from "@/lib/env/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json(); // Get the email address from the request body

    // Check if API key is available
    if (!env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not provided - email sending disabled");
      return NextResponse.json(
        { error: "Email service not configured" }, 
        { status: 503 }
      );
    }

    // Initialize Resend only when needed
    const resend = new Resend(env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: `Acme <${env.RESEND_FROM_EMAIL}>`, // Use your verified domain
        to: email,
        subject: 'Hello world',
        react: OTPTemplate({ firstName: 'John', otp: otp }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to send email" 
    return NextResponse.json(
      { error: `Failed to send email: ${msg}` },
      { status: 500 },
    );
  }
}