const Lead = require('../models/Lead');

// @desc    Get dashboard summary stats + chart data
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const countsMap = { New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 };
    statusCounts.forEach((s) => {
      if (countsMap[s._id] !== undefined) countsMap[s._id] = s.count;
    });

    const total = Object.values(countsMap).reduce((a, b) => a + b, 0);

    // Leads created per day for the last 14 days (for a trend chart)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const dailyTrend = await Lead.aggregate([
      { $match: { createdDate: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Upcoming follow-ups in the next 7 days
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    const upcomingFollowUps = await Lead.countDocuments({
      followUpDate: { $gte: now, $lte: weekFromNow },
      status: { $nin: ['Converted', 'Lost'] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalLeads: total,
        newLeads: countsMap.New,
        contactedLeads: countsMap.Contacted,
        qualifiedLeads: countsMap.Qualified,
        convertedLeads: countsMap.Converted,
        lostLeads: countsMap.Lost,
        upcomingFollowUps,
        statusBreakdown: countsMap,
        dailyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
