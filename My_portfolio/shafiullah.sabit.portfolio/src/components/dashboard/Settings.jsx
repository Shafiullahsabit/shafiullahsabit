import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaImage, FaMoon, FaSun, FaTrash, FaUpload } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

const DEFAULT_NAME = "Shafiullah Sabit";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const allowedAvatarTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const accentColors = [
  { name: "Cyan", value: "#22d3ee" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Violet", value: "#a78bfa" },
  { name: "Rose", value: "#fb7185" },
  { name: "Amber", value: "#fbbf24" },
  { name: "Emerald", value: "#34d399" },
];

const Settings = ({
  profile,
  profileStatus,
  profileError,
  userId,
  userEmail,
  onRetry,
  onProfileSaved,
  theme,
  onThemeToggle,
}) => {
  const fileInputRef = useRef(null);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [accentColor, setAccentColor] = useState(profile.accent_color);
  const [avatarPath, setAvatarPath] = useState(profile.avatar_path);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  useEffect(() => {
    setDisplayName(profile.display_name);
    setAccentColor(profile.accent_color);
    setAvatarPath(profile.avatar_path);
    setAvatarUrl(profile.avatar_url);
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    setRemoveAvatar(false);
  }, [profile]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!allowedAvatarTypes.has(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("The profile image must be 2 MB or smaller.");
      return;
    }
    setAvatarPreviewUrl(URL.createObjectURL(file));
    setAvatarFile(file);
    setRemoveAvatar(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const normalizedName = displayName.trim();
    if (!normalizedName || normalizedName.length > 60) {
      toast.error("Enter a name between 1 and 60 characters.");
      return;
    }
    if (!userId || !supabase) {
      toast.error("Your administrator session is unavailable. Sign in again.");
      return;
    }

    setIsSaving(true);
    let uploadedPath = null;
    let oldImageCleanupFailed = false;
    const previousAvatarPath = profile.avatar_path;

    try {
      let nextAvatarPath = avatarPath;
      if (avatarFile) {
        const extension = allowedAvatarTypes.get(avatarFile.type);
        uploadedPath = `${userId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("admin-avatars")
          .upload(uploadedPath, avatarFile, {
            contentType: avatarFile.type,
            upsert: false,
          });
        if (uploadError) throw uploadError;
        nextAvatarPath = uploadedPath;
      } else if (removeAvatar) {
        nextAvatarPath = null;
      }

      let nextAvatarUrl = null;
      if (nextAvatarPath) {
        const { data, error: signedUrlError } = await supabase.storage
          .from("admin-avatars")
          .createSignedUrl(nextAvatarPath, 60 * 60);
        if (signedUrlError) throw signedUrlError;
        nextAvatarUrl = data.signedUrl;
      }

      const { error: saveError } = await supabase
        .from("admin_profiles")
        .upsert(
          {
            user_id: userId,
            display_name: normalizedName,
            accent_color: accentColor,
            avatar_path: nextAvatarPath,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      if (saveError) throw saveError;

      if (
        previousAvatarPath &&
        previousAvatarPath !== nextAvatarPath
      ) {
        const { error: removeError } = await supabase.storage
          .from("admin-avatars")
          .remove([previousAvatarPath]);
        if (removeError) {
          console.error("Unable to remove the previous profile image:", removeError);
          oldImageCleanupFailed = true;
        }
      }

      const savedProfile = {
        display_name: normalizedName,
        accent_color: accentColor,
        avatar_path: nextAvatarPath,
        avatar_url: nextAvatarUrl,
      };
      onProfileSaved(savedProfile);
      setAvatarPath(nextAvatarPath);
      setAvatarUrl(nextAvatarUrl);
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
      setRemoveAvatar(false);
      if (oldImageCleanupFailed) {
        toast.error("Profile saved, but the old image could not be removed.");
      } else {
        toast.success("Admin settings saved.");
      }
    } catch (error) {
      console.error("Unable to save admin profile settings:", error);
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from("admin-avatars")
          .remove([uploadedPath]);
        if (cleanupError) {
          console.error("Unable to clean up the failed profile image upload:", cleanupError);
        }
      }
      toast.error(
        "Could not save your settings. Check the Supabase profile setup and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDisplayName(DEFAULT_NAME);
    setAccentColor(accentColors[0].value);
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    setAvatarUrl(null);
    setRemoveAvatar(true);
  };

  const displayedAvatar =
    avatarPreviewUrl || (removeAvatar ? null : avatarUrl);
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Settings
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Personalize your administrator profile and dashboard appearance.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-300">
              {theme === "light" ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
            </span>
            <div>
              <h3 className="font-semibold text-white">Appearance</h3>
              <p className="mt-1 text-sm text-white/50">
                Choose how the full dashboard looks.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onThemeToggle}
            aria-pressed={theme === "light"}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-cyan-400/40"
          >
            Use {theme === "light" ? "dark" : "light"} mode
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-white">Administrator profile</h3>
          <p className="mt-1 text-sm text-white/50">
            Your profile is private to your authorized administrator account.
          </p>
        </div>

        {profileStatus === "loading" ? (
          <div
            className="h-48 animate-pulse rounded-xl bg-white/5"
            aria-label="Loading profile settings"
          />
        ) : profileStatus === "error" ? (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200"
          >
            <p>{profileError}</p>
            <p className="mt-2 text-white/65">
              Apply <code>supabase/admin_profile_settings.sql</code> in the
              Supabase SQL Editor, then reload the profile.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-white/10 px-3 py-2 underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-wrap items-center gap-5">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white/5 text-xl font-bold text-white"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt={`${displayName || "Administrator"} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || <FaImage aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="sr-only"
                  aria-label="Upload a profile image"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition hover:border-cyan-400/40"
                >
                  <FaUpload aria-hidden="true" />
                  Upload image
                </button>
                {(displayedAvatar || avatarPath) && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreviewUrl(null);
                      setAvatarUrl(null);
                      setRemoveAvatar(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-300/15 bg-red-300/5 px-4 py-2.5 text-sm text-red-200 transition hover:bg-red-300/10"
                  >
                    <FaTrash aria-hidden="true" />
                    Remove image
                  </button>
                )}
                <p className="basis-full text-xs text-white/40">
                  JPG, PNG, or WebP · maximum 2 MB
                </p>
              </div>
            </div>

            <label className="block max-w-xl text-sm font-medium text-white/75">
              Display name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={60}
                required
                autoComplete="name"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
              <span className="mt-1 block text-xs font-normal text-white/40">
                This name appears in the dashboard sidebar.
              </span>
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-white/75">
                Profile accent
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setAccentColor(color.value)}
                    aria-label={`${color.name} profile color`}
                    aria-pressed={accentColor === color.value}
                    title={color.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{
                      backgroundColor: color.value,
                      borderColor:
                        accentColor === color.value ? "#ffffff" : "transparent",
                    }}
                  >
                    {accentColor === color.value && (
                      <FaCheck className="text-slate-950" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            {userEmail && (
              <label className="block max-w-xl text-sm font-medium text-white/75">
                Admin email
                <input
                  value={userEmail}
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white/55"
                />
                <span className="mt-1 block text-xs font-normal text-white/40">
                  To change your sign-in email, update it in Supabase Auth.
                </span>
              </label>
            )}

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save profile"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:bg-white/5 disabled:opacity-50"
              >
                Reset profile
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
};

export default Settings;
