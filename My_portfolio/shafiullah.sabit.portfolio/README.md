# Shafiullah Sabit Portfolio

React + Vite portfolio with a Supabase-backed contact form and admin message
inbox.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `SUPABASE_URL`,
   `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and
   `VITE_SUPABASE_ANON_KEY`. Use the project's publishable key for both key
   variables. The Vite-prefixed variables are public and used by the browser;
   the unprefixed variables are used by the server endpoint.
3. Run the entire SQL in `supabase/contact_messages.sql` in the Supabase SQL
   Editor. This creates the contact table, secures it with RLS, and reloads the
   API schema cache. If the form or dashboard reports that
   `public.contact_messages` is missing, run this SQL against the same Supabase
   project configured in the environment variables, then retry.
4. Run `supabase/admin_profile_settings.sql` in the same SQL Editor after
   `contact_messages.sql`. It creates the private administrator profile table
   and private avatar bucket with administrator-only access policies. This is
   required for profile settings and image uploads in the dashboard.
5. In Supabase **Authentication → Users**, create an administrator using the
   email and password you want to use at `/admin`. If you do not know the
   existing administrator credentials, create a new user and use the new
   credentials; the app does not store or display passwords. Disable public
   sign-ups.
6. Find the new user's UUID in **Authentication → Users**, then allowlist it
   in the SQL Editor:

   ```sql
   insert into public.contact_admins (user_id)
   values ('YOUR_AUTH_USER_UUID')
   on conflict (user_id) do nothing;
   ```

   The account must be allowlisted for dashboard access and access to stored
   messages. Never place a service-role key in this project.
7. Start the frontend with `npm run dev`. During local development the form
   submits directly using the publishable key and is protected by database
   RLS. The deployed Vercel form uses the `/api/contact` server endpoint.
8. Vercel Web Analytics is used to track public portfolio page views. Enable
   it for the Vercel project and include the `<Analytics />` component from
   `@vercel/analytics/react` in the public app. View reports in the project's
   Analytics tab in Vercel. The admin dashboard's 30-day chart also reads
   Vercel Web Analytics and requires a Vercel API token scoped to this project.
   Add it as the sensitive `VERCEL_ANALYTICS_API_TOKEN` environment variable
   in Vercel; never expose it through a `VITE_` variable.

The previous hard-coded frontend admin password is no longer used. Create or
reset the administrator password in Supabase Auth.

## Contact message security

The public form can insert messages but cannot read, update, or delete them.
Row Level Security is enabled on both database tables. Dashboard access uses
Supabase Auth and checks `is_contact_admin()`; message read/update/delete
policies also require the authenticated user to be in `contact_admins`.
Only the `is_read` field is grantable for updates. Submitted names, email,
optional project type, message, read status, and database-generated timestamp
are stored in `contact_messages`.

## Vercel deployment

This project is currently configured for Vercel: the handlers in `api/` use
Vercel's Node.js function interface. Deploy it on Vercel without adapting the
backend. Netlify is not ready as-is; its functions need to be adapted and the
SPA fallback configured before deploying there.

1. Import this project into Vercel and set the **Root Directory** to
   `My_portfolio/shafiullah.sabit.portfolio` if deploying from the parent
   workspace.
2. Add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and
   `VITE_SUPABASE_ANON_KEY` under Vercel project Environment Variables for the
   environments you deploy. Use the project's publishable key for both key
   variables. Do not add a secret key: public contact submissions use the
   anonymous RLS policy, not admin access.
3. Enable Web Analytics for the Vercel project to track public page views.
   To show the admin dashboard chart, create a project-scoped Vercel API token
   with access to read project analytics and add it as the sensitive
   `VERCEL_ANALYTICS_API_TOKEN` environment variable for Production. Never
   expose this token through a `VITE_` variable. The chart queries the Vercel
   Web Analytics API only after verifying the signed-in Supabase administrator.
4. Deploy or redeploy so Vite can include the `VITE_*` variables in the client
   build and Vercel can configure the server endpoints.
5. In Supabase **Authentication → URL Configuration**, set the production
   website URL as the Site URL and add the production URL to Redirect URLs.
6. Keep public sign-ups disabled and add only administrator account UUIDs to
   `contact_admins`.

The Vite client only uses the public anon/publishable key; database RLS is the
security boundary. Never expose a Supabase secret/service-role key through
`VITE_*` variables or frontend code. The contact endpoint validates the
publishable key and inserts with anonymous permissions, so it does not need a
secret key or JWKS configuration.

## Verification

- `npm run lint`
- `npm run build`

After configuring Supabase, submit a contact form and confirm the message
appears under the dashboard's **Contacts** section. Verify that a signed-out
visitor and a signed-in account not listed in `contact_admins` cannot select,
update, or delete messages; verify the allowlisted administrator can view,
mark read/unread, and delete them.
