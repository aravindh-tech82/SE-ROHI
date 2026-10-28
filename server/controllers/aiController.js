import { processAiQuery } from '../services/mockAiService.js';

export async function askStudentAi(req, res, next) {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a prompt or question.' });
    }

    const response = await processAiQuery(query, {
      userId: req.user?.id,
      userRole: req.user?.role
    });

    res.json({
      success: true,
      query,
      timestamp: new Date().toISOString(),
      ...response
    });
  } catch (error) {
    next(error);
  }
}

