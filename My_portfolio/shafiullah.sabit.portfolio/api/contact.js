import {
  createContextClient,
  verifyAuth,
} from "@supabase/server/core";
import { getContactMessageError } from "../src/lib/contactMessageErrors.js";

const serverEnv = globalThis.process?.env ?? {};
const isValidEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const contentType = req.headers["content-type"];
  if (
    typeof contentType !== "string" ||
    !contentType.toLowerCase().includes("application/json")
  ) {
    return res.status(415).json({ message: "Expected a JSON request." });
  }

  if (!serverEnv.SUPABASE_URL || !serverEnv.SUPABASE_PUBLISHABLE_KEY) {
    return res
      .status(503)
      .json({ message: "The contact form is not configured yet." });
  }

  const headers = new Headers();
  const publishableKey = req.headers.apikey;
  if (typeof publishableKey === "string") {
    headers.set("apikey", publishableKey);
  }

  let auth;
  let authError;
  try {
    ({ data: auth, error: authError } = await verifyAuth(
      new Request("https://localhost/api/contact", {
        method: "POST",
        headers,
      }),
      { auth: "publishable" },
    ));
  } catch (error) {
    console.error("Unable to verify contact endpoint key:", error);
    return res
      .status(500)
      .json({ message: "The contact form could not be verified." });
  }

  if (authError) {
    return res.status(authError.status).json({ message: "Invalid API key." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ message: "Invalid message data." });
  }

  const firstName =
    typeof body.first_name === "string" ? body.first_name.trim() : "";
  const lastName =
    typeof body.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const projectType =
    typeof body.project_type === "string" ? body.project_type.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    firstName.length < 1 ||
    firstName.length > 80 ||
    lastName.length < 1 ||
    lastName.length > 80 ||
    email.length < 3 ||
    email.length > 254 ||
    !isValidEmail(email) ||
    projectType.length > 100 ||
    message.length < 1 ||
    message.length > 5000
  ) {
    return res
      .status(400)
      .json({ message: "Please check your message details." });
  }

  try {
    const supabase = createContextClient({ auth: { keyName: auth.keyName } });
    const { error } = await supabase.from("contact_messages").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      project_type: projectType || null,
      message,
    });

    if (error) {
      console.error("Unable to save contact message:", error);
      if (error.code === "PGRST205" || error.code === "42P01") {
        return res.status(503).json({
          code: "CONTACT_TABLE_MISSING",
          message: getContactMessageError(error),
        });
      }
      return res
        .status(502)
        .json({ message: "Your message could not be saved. Please try again." });
    }

    return res.status(201).json({ message: "Your message has been received." });
  } catch (error) {
    console.error("Unable to process contact message:", error);
    return res
      .status(500)
      .json({ message: "Your message could not be sent right now." });
  }
}
