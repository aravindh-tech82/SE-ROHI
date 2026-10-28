import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  User,
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import api from '../services/api';

export default function TimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [currentDay, setCurrentDay] = useState('Monday');
  const [activeDayTab, setActiveDayTab] = useState('Monday');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimetable() {
      try {
        const res = await api.get('/timetable');
        if (res.data.success) {
          setTimetable(res.data.timetable);
          if (res.data.currentDay && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(res.data.currentDay)) {
            setCurrentDay(res.data.currentDay);
            setActiveDayTab(res.data.currentDay);
          }
        }
      } catch (err) {
        console.error('Failed to load timetable:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTimetable();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const activeDaySchedule = timetable.find(t => t.day === activeDayTab) || { slots: [] };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Weekly Academic Timetable</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            CSE Cyber Security • 6th Semester • Hall 302 & Cyber Defense Lab
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-royal-600/20 border border-royal-500/30 text-royal-300 text-xs font-semibold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-royal-400" />
          <span>Active Day: {currentDay}</span>
        </div>
      </div>

      {/* ================= DAY TABS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {days.map((day) => {
          const isCurrent = currentDay === day;
          const isSelected = activeDayTab === day;

          return (
            <button
              key={day}
              onClick={() => setActiveDayTab(day)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                ${isSelected
                  ? 'bg-gradient-to-r from-royal-600 to-royal-800 text-white shadow-lg shadow-royal-950 font-semibold'
                  : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
                }
              `}
            >
              <span>{day}</span>
              {isCurrent && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Today" />
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TIMETABLE CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400">Loading timetable...</div>
        ) : activeDaySchedule.slots.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400">No scheduled sessions for this day.</div>
        ) : (
          activeDaySchedule.slots.map((slot, index) => {
            // First class of today gets highlighted with subtle violet glow
            const isHighlighted = activeDayTab === currentDay && index === 0;

            return (
              <GlassCard
                key={index}
                glow={isHighlighted}
                className={`p-6 flex flex-col justify-between ${isHighlighted ? 'border-royal-500/50 bg-[#070D19]/90' : ''}`}
                hoverEffect
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div className="flex items-center gap-2 text-royal-400 text-xs font-mono font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </div>

                    {isHighlighted ? (
                      <span className="px-2 py-0.5 rounded-full bg-royal-600/30 text-royal-200 border border-royal-500/40 text-[11px] font-bold tracking-wide uppercase shadow-sm">
                        Current Class
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">{slot.code}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{slot.subject}</h3>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-royal-400" />
                    <span>{slot.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-royal-400" />
                    <span className="truncate">{slot.faculty}</span>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}

