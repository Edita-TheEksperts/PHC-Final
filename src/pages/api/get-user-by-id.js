import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing user id' });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        services: true,
        subServices: true,
        schedules: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
