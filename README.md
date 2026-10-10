# MarriageCare

A frontend-only prototype of a relationship consultancy and counselling platform. Built with React, Vite, Tailwind CSS, React Router, React Hook Form, Zod, and Lucide icons.

## Run locally

```sh
npm install
npm run dev
```

Create a production bundle with `npm run build`, or check source style with `npm run lint`.

## Features

- Browse services, fictional professional profiles, and educational sample articles.
- Use the seven-step booking flow to create a simulated pending appointment.
- Apply to join as a counsellor with qualification, registration, experience, specialty, practice-approach, and CV details. Review the application in the administrator portal.
- Sign in from the sample buttons as a client, professional, or administrator. Login accepts any non-empty password; registration and reset are simulated.
- Client, professional, and administrator portals share sample appointment state. Professional decisions and client cancellations/rescheduling appear across the same browser state.
- Use the administrator settings page to reset sample appointment data.

sample accounts: `ama@example.com` (client), `amara@example.test` (professional), and `admin@example.test` (administrator). Any password is accepted in the simulated login form. sample portal buttons open each role without entering credentials.

## Privacy and limitations

This project has no backend, database, API, payments, real authentication, or real appointment service. Appointment and application records are stored in this browser. CV contents remain in memory for the current session and are not uploaded; only the filename persists for review. Passwords are never stored. Do not enter real passwords, confidential counselling information, health details, or real client records. All people, profiles, qualifications, reviews, prices, appointments, and contact details are fictional or illustrative. Professional credentials are not verified. Supplied counselling and portrait photographs are stored locally in `public/images`. Educational content is not individualized care, and this prototype is not an emergency service. Anyone in immediate danger should contact local emergency services or a trusted local support organization.