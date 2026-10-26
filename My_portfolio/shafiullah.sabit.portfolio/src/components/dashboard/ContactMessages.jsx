import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaEye,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { getContactMessageError } from "../../lib/contactMessageErrors";
import ConfirmDialog from "./ConfirmDialog";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("contact_messages")
        .select(
          "id, first_name, last_name, email, project_type, message, is_read, created_at",
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;
      setMessages(data);
    } catch (loadError) {
      console.error("Unable to load contact messages:", loadError);
      setError(
        getContactMessageError(
          loadError,
          "Could not load messages. Check your connection and try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.is_read).length,
    [messages],
  );
  const visibleMessages = useMemo(
    () =>
      filter === "unread"
        ? messages.filter((message) => !message.is_read)
        : filter === "read"
          ? messages.filter((message) => message.is_read)
          : messages,
    [filter, messages],
  );

  const toggleRead = async (message) => {
    setPendingId(message.id);
    try {
      const { data, error: updateError } = await supabase
        .from("contact_messages")
        .update({ is_read: !message.is_read })
        .eq("id", message.id)
        .select("id, is_read")
        .single();

      if (updateError) throw updateError;
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, is_read: data.is_read } : item,
        ),
      );
      toast.success(data.is_read ? "Message marked as read." : "Message marked as unread.");
    } catch (updateError) {
      console.error("Unable to update message read status:", updateError);
      toast.error("Could not update this message. Please try again.");
    } finally {
      setPendingId(null);
    }
  };

  const deleteMessage = async () => {
    if (!messageToDelete) return;
    const message = messageToDelete;
    setPendingId(message.id);
    try {
      const { error: deleteError } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", message.id);

      if (deleteError) throw deleteError;
      setMessages((current) =>
        current.filter((item) => item.id !== message.id),
      );
      if (expandedId === message.id) setExpandedId(null);
      setMessageToDelete(null);
      toast.success("Message deleted.");
    } catch (deleteError) {
      console.error("Unable to delete contact message:", deleteError);
      toast.error("Could not delete this message. Please try again.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Contact Messages</h2>
          <p className="mt-1 text-sm text-white/50">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-cyan-400/40 disabled:opacity-50"
        >
          <FaSyncAlt className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2" aria-label="Filter messages">
        {["all", "unread", "read"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-full px-4 py-2 text-sm capitalize transition ${
              filter === value
                ? "bg-cyan-400 text-black"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-cyan-400/30"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadMessages}
            className="underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {messageToDelete && (
        <ConfirmDialog
          title="Delete this message?"
          description={`This will permanently delete the message from ${messageToDelete.first_name} ${messageToDelete.last_name}. This action cannot be undone.`}
          confirmLabel="Delete message"
          isConfirming={pendingId === messageToDelete.id}
          onCancel={() => setMessageToDelete(null)}
          onConfirm={deleteMessage}
        />
      )}

      {isLoading && messages.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
          Loading messages...
        </p>
      ) : visibleMessages.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
          {messages.length === 0
            ? "No contact messages yet."
            : `No ${filter} messages.`}
        </p>
      ) : (
        <div className="space-y-3">
          {visibleMessages.map((message) => {
            const isExpanded = expandedId === message.id;
            const isPending = pendingId === message.id;

            return (
              <article
                key={message.id}
                className={`rounded-2xl border bg-white/5 p-4 backdrop-blur-xl transition sm:p-5 ${
                  message.is_read
                    ? "border-white/10"
                    : "border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.06)]"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : message.id)
                    }
                    aria-expanded={isExpanded}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-2 font-semibold text-white">
                      {!message.is_read && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-cyan-400"
                          aria-label="Unread"
                        />
                      )}
                      {message.first_name} {message.last_name}
                    </span>
                    <span className="mt-1 block break-all text-sm text-cyan-200/80">
                      {message.email}
                    </span>
                    <span className="mt-2 block line-clamp-2 text-sm leading-relaxed text-white/60">
                      {message.message}
                    </span>
                    <span className="mt-2 block text-xs text-white/40">
                      {new Date(message.created_at).toLocaleString()}
                      {message.project_type
                        ? ` · ${message.project_type}`
                        : ""}
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : message.id)}
                      aria-label={isExpanded ? "Hide message details" : "View message details"}
                      title={isExpanded ? "Hide details" : "View details"}
                      className="rounded-lg border border-white/10 p-2.5 text-white/70 transition hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRead(message)}
                      disabled={isPending}
                      aria-label={message.is_read ? "Mark as unread" : "Mark as read"}
                      title={message.is_read ? "Mark as unread" : "Mark as read"}
                      className="rounded-lg border border-white/10 p-2.5 text-white/70 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-50"
                    >
                      {message.is_read ? <FaEnvelope /> : <FaEnvelopeOpen />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageToDelete(message)}
                      disabled={isPending}
                      aria-label="Delete message"
                      title="Delete message"
                      className="rounded-lg border border-white/10 p-2.5 text-white/70 transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(
                        `Re: ${message.project_type || "Your message"}`,
                      )}`}
                      className="text-sm text-cyan-300 underline underline-offset-4"
                    >
                      Reply by email
                    </a>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80">
                      {message.message}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ContactMessages;
