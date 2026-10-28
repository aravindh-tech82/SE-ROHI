/**
 * Calculates a comprehensive Risk Score for a student based on:
 * - Attendance Percentage (Weight: ~40%)
 * - Academic Performance / Internal Marks (Weight: ~35%)
 * - Assignment Completion (Weight: ~15%)
 * - Performance Trend (Weight: ~10%)
 * 
 * Returns { score, status, statusColor, factors }
 * Status levels:
 *  - 0–30: Stable (Green)
 *  - 31–60: Needs Attention (Amber)
 *  - 61–100: At Risk (Red)
 */
export function calculateStudentRisk({
  attendancePercentage = 85,
  academicScore = 75,
  pendingAssignmentsCount = 0,
  totalAssignmentsCount = 5,
  performanceTrend = 0 // e.g. -5 means declining by 5%
}) {
  let riskPoints = 0;
  const factors = [];

  // 1. Attendance Evaluation
  if (attendancePercentage < 70) {
    riskPoints += 45;
    factors.push({
      metric: 'Attendance',
      issue: `Critical attendance deficit (${attendancePercentage}% - Below mandatory 75% threshold)`,
      severity: 'high'
    });
  } else if (attendancePercentage < 75) {
    riskPoints += 35;
    factors.push({
      metric: 'Attendance',
      issue: `Attendance below 75% (${attendancePercentage}%)`,
      severity: 'high'
    });
  } else if (attendancePercentage < 80) {
    riskPoints += 18;
    factors.push({
      metric: 'Attendance',
      issue: `Borderline attendance (${attendancePercentage}%)`,
      severity: 'medium'
    });
  } else if (attendancePercentage < 85) {
    riskPoints += 8;
  }

  // 2. Academic Score Evaluation (Scale 0-100)
  if (academicScore < 50) {
    riskPoints += 40;
    factors.push({
      metric: 'Academics',
      issue: `Failing academic grade (${academicScore}%)`,
      severity: 'high'
    });
  } else if (academicScore < 60) {
    riskPoints += 28;
    factors.push({
      metric: 'Academics',
      issue: `Low test averages (${academicScore}%)`,
      severity: 'high'
    });
  } else if (academicScore < 70) {
    riskPoints += 15;
    factors.push({
      metric: 'Academics',
      issue: `Average academic performance (${academicScore}%)`,
      severity: 'medium'
    });
  } else if (academicScore < 80) {
    riskPoints += 5;
  }

  // 3. Assignment Completion
  if (totalAssignmentsCount > 0) {
    const unsubmittedRatio = pendingAssignmentsCount / totalAssignmentsCount;
    if (unsubmittedRatio >= 0.5) {
      riskPoints += 20;
      factors.push({
        metric: 'Assignments',
        issue: `${pendingAssignmentsCount} assignments overdue or pending`,
        severity: 'high'
      });
    } else if (pendingAssignmentsCount >= 2) {
      riskPoints += 12;
      factors.push({
        metric: 'Assignments',
        issue: `${pendingAssignmentsCount} assignments currently pending`,
        severity: 'medium'
      });
    } else if (pendingAssignmentsCount === 1) {
      riskPoints += 5;
    }
  }

  // 4. Performance Trend
  if (performanceTrend <= -8) {
    riskPoints += 15;
    factors.push({
      metric: 'Trend',
      issue: `Sharp decline in recent test results (${performanceTrend}%)`,
      severity: 'high'
    });
  } else if (performanceTrend < 0) {
    riskPoints += 7;
    factors.push({
      metric: 'Trend',
      issue: `Slight negative performance trajectory (${performanceTrend}%)`,
      severity: 'low'
    });
  }

  // Normalize to 0 - 100
  const finalScore = Math.min(100, Math.max(0, Math.round(riskPoints)));

  let status = 'Stable';
  let statusColor = 'emerald';
  let badgeText = 'STABLE';

  if (finalScore >= 61) {
    status = 'At Risk';
    statusColor = 'rose';
    badgeText = 'AT RISK';
  } else if (finalScore >= 31) {
    status = 'Needs Attention';
    statusColor = 'amber';
    badgeText = 'NEEDS ATTENTION';
  }

  return {
    score: finalScore,
    status,
    badgeText,
    statusColor,
    factors: factors.length > 0 ? factors : [{
      metric: 'Overall',
      issue: 'Consistent performance across academic and attendance benchmarks',
      severity: 'none'
    }]
  };
}

