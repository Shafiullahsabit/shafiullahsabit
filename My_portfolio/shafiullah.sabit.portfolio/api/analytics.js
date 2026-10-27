import {
  createContextClient,
  verifyAuth,
} from "@supabase/server/core";

const serverEnv = globalThis.process?.env ?? {};
const VERCEL_PROJECT_ID = "prj_AitTu8dyZOZk17FGB2vL2mVOlRpB";
const VERCEL_TEAM_ID = "team_kLUC36ssVlH39CuRUGIdrw0I";
const DAYS_TO_REPORT = 30;

const formatDate = (date) => date.toISOString().slice(0, 10);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const requestHeaders = new Headers();
  if (typeof req.headers.authorization === "string") {
    requestHeaders.set("Authorization", req.headers.authorization);
  }

  let auth;
  let authError;
  try {
    ({ data: auth, error: authError } = await verifyAuth(
      new Request("https://localhost/api/analytics", {
        headers: requestHeaders,
      }),
      { auth: "user" },
    ));
  } catch (error) {
    console.error("Unable to verify dashboard analytics session:", error);
    return res
      .status(500)
      .json({ message: "Could not verify dashboard access." });
  }

  if (authError) {
    return res
      .status(authError.status)
      .json({ message: "Sign in to view dashboard analytics." });
  }

  try {
    const supabase = createContextClient({
      auth: { token: auth.token, keyName: auth.keyName },
    });
    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_contact_admin");
    if (adminError) {
      console.error("Unable to verify dashboard analytics permissions:", adminError);
      return res
        .status(500)
        .json({ message: "Could not verify dashboard access." });
    }
    if (isAdmin !== true) {
      return res
        .status(403)
        .json({ message: "Administrator access is required." });
    }
  } catch (error) {
    console.error("Unable to verify dashboard analytics permissions:", error);
    return res
      .status(500)
      .json({ message: "Could not verify dashboard access." });
  }

  const apiToken = serverEnv.VERCEL_ANALYTICS_API_TOKEN;
  if (!apiToken) {
    return res.status(503).json({
      code: "ANALYTICS_NOT_CONFIGURED",
      message: "Add the Vercel analytics API token to the project settings.",
    });
  }

  const today = new Date();
  const endDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - DAYS_TO_REPORT + 1);

  const apiUrl = new URL(
    "https://api.vercel.com/v1/query/web-analytics/visits/aggregate",
  );
  apiUrl.searchParams.set("projectId", VERCEL_PROJECT_ID);
  apiUrl.searchParams.set("teamId", VERCEL_TEAM_ID);
  apiUrl.searchParams.set("by", "day");
  apiUrl.searchParams.set("since", formatDate(startDate));
  apiUrl.searchParams.set("until", formatDate(endDate));
  apiUrl.searchParams.set("limit", String(DAYS_TO_REPORT));

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error("Vercel Web Analytics API request failed:", {
        status: response.status,
      });
      return res.status(502).json({
        message:
          "Could not load Vercel Analytics data. Check the API token permissions.",
      });
    }

    const result = await response.json();
    if (
      !Array.isArray(result.data) ||
      result.data.some(
        (point) =>
          typeof point.timestamp !== "string" ||
          !Number.isFinite(point.pageviews),
      )
    ) {
      console.error("Vercel Web Analytics returned an unexpected response shape.");
      return res
        .status(502)
        .json({ message: "Vercel returned invalid analytics data." });
    }

    const pageViewsByDate = new Map(
      result.data.map((point) => [
        point.timestamp.slice(0, 10),
        point.pageviews,
      ]),
    );
    const points = Array.from({ length: DAYS_TO_REPORT }, (_, index) => {
      const date = new Date(startDate);
      date.setUTCDate(date.getUTCDate() + index);
      const dateLabel = formatDate(date);
      return {
        date: dateLabel,
        pageViews: pageViewsByDate.get(dateLabel) ?? 0,
      };
    });

    return res.status(200).json({
      pageViews: points.reduce((total, point) => total + point.pageViews, 0),
      points,
    });
  } catch (error) {
    console.error("Unable to retrieve Vercel Web Analytics:", error);
    return res.status(502).json({
      message: "Vercel Web Analytics is temporarily unavailable.",
    });
  }
}
