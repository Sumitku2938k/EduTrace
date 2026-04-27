const behaviorAnalyticsService = require('../services/behaviorAnalyticsService');

const getClassification = async (_req, res) => {
    try {
        const data = await behaviorAnalyticsService.getClassification();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching behavior classification:', error);
        return res.status(500).json({ message: 'Failed to fetch behavior classification' });
    }
};

const getAlerts = async (_req, res) => {
    try {
        const data = await behaviorAnalyticsService.getAlerts();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching behavior alerts:', error);
        return res.status(500).json({ message: 'Failed to fetch behavior alerts' });
    }
};

const getScores = async (_req, res) => {
    try {
        const data = await behaviorAnalyticsService.getScores();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching behavior scores:', error);
        return res.status(500).json({ message: 'Failed to fetch behavior scores' });
    }
};

module.exports = {
    getClassification,
    getAlerts,
    getScores,
};
