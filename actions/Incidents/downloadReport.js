
const fs = require('fs');
const path = require('path');
module.exports = {
    async downloadReport(ctx) {
        const { companyId, startDate, endDate } = ctx.params;
        if (!companyId || !startDate || !endDate) {
            throw new Error("Company ID, start date, and end date are required");
        }

        const filePath = path.join(__dirname, `../../reports/Incidents_Report_${companyId}_${startDate}_${endDate}.xlsx`);
        if (!fs.existsSync(filePath)) {
            throw new Error("Report not found. Please generate the report first.");
        }

        return fs.createReadStream(filePath);
    }
};