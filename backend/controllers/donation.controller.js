const donationService = require("../services/donation.service");

exports.createDonation = async (req, res) => {
    const donation = await donationService.createDonation(req.user.id, req.body);
    if (donation.error === "CREATOR_NOT_FOUND") {
        return res.status(404).json({ message: "Creator not found" });
    }

    res.status(201).json(donation);
};

exports.getMyDonationHistory = async (req, res) => {
    const history = await donationService.getMyDonationHistory(req.user.id, {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        creatorName: req.query.creatorName
    });

    res.status(200).json(history);
};
