import { db } from '../services/dbService.js';

export async function getTimetable(req, res, next) {
  try {
    const timetable = await db.getCollection('timetable');

    // Helper to determine current day & active slot
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDayName = days[now.getDay()];
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    res.json({
      success: true,
      currentDay: currentDayName,
      currentTime: `${String(currentHour).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`,
      timetable
    });
  } catch (error) {
    next(error);
  }
}

