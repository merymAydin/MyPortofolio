# Typewriter email delivery

The Correspondence typewriter sends the `name`, `email`, and `message` values to the configured EmailJS service and template using `@emailjs/browser`.

## Local configuration

Copy `.env.example` to `.env.local` and fill in the EmailJS service ID, template ID, and public key. `.env.local` is ignored by Git. The EmailJS recipient is configured in the template dashboard; no recipient address is stored in this repository.

The application sends these exact template parameter keys:

```js
{
  name,
  email,
  message,
}
```

The EmailJS template should reference `{{name}}`, `{{email}}`, and `{{message}}`. The project source cannot inspect the private template configuration, so verify the variable names and recipient in the EmailJS dashboard before testing.

## Test sending

1. Confirm the EmailJS service is connected and the template recipient is configured.
2. Confirm the template uses `{{name}}`, `{{email}}`, and `{{message}}`.
3. Add the three settings to `.env.local` and restart Vite.
4. Send a message through Correspondence and check the configured recipient inbox and EmailJS send history.

The UI reports success only after EmailJS resolves the send request. A successful EmailJS response confirms the request was accepted by EmailJS; verify actual inbox delivery separately. No test email has been sent as part of this code change.
