import { createClient } from "@supabase/supabase-js";
import { getContactMessageError } from "../src/lib/contactMessageErrors.js";

const serverEnv = globalThis.process?.env ?? {};
const isValidEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

const getSupabaseConfig = () => ({
  url: serverEnv.SUPABASE_URL || serverEnv.VITE_SUPABASE_URL,
  key:
    serverEnv.SUPABASE_PUBLISHABLE_KEY ||
    serverEnv.SUPABASE_ANON_KEY ||
    serverEnv.VITE_SUPABASE_ANON_KEY ||
    serverEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
});

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

  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    return res
      .status(503)
      .json({ message: "The contact form is not configured yet." });
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
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
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
