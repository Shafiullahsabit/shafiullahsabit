const MISSING_CONTACT_TABLE_CODES = new Set(["PGRST205", "42P01"]);

export const getContactMessageError = (error, fallbackMessage) => {
  if (MISSING_CONTACT_TABLE_CODES.has(error?.code)) {
    return "Contact message storage is not set up yet. In Supabase SQL Editor, run supabase/contact_messages.sql, then try again.";
  }

  return error?.message || fallbackMessage;
};
