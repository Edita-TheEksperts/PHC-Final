export default async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await fetch(
      `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      }
    );

    if (response.status >= 400) {
      const data = await response.json();
      // Mailchimp returns 400 with title 'Member Exists' if already subscribed
      if (data.title === 'Member Exists') {
        return res.status(400).json({ error: "Diese Email ist bereits registriert. Vielen Dank!" });
      }
      return res.status(400).json({ error: "There was an error subscribing." });
    }

    return res.status(201).json({ message: "Vielen Dank!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
