const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

module.exports = {
    async getIncidentsByDateRange(ctx) {
        const { companyId, startDate, endDate, email } = ctx.params;
        if (!companyId || !startDate || !endDate || !email) {
            throw new Error("Company ID, start date, end date, and email are required");
        }

        try {
            const now = new Date();
            now.setHours(now.getHours() - 25, 0, 0, 0);
            
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            
            const startDate = now;
            const endDate = endOfToday;
            
            const incidents = await this.adapter.find({
                query: {
                    company_id: companyId,
                    creation_date: { [Op.between]: [startDate, endDate] }
                }
            });

            if (!incidents.length) {
                return { message: 'No incidents found in the given date range' };
            }

            const ids = (key) => [...new Set(incidents.map(i => i[key]).filter(Boolean))];
            const queries = [
                { name: "statuses", ids: ids("status_id") },
                { name: "priorities", ids: ids("priority_id") },
                { name: "categories", ids: ids("category_id") },
                { name: "users", ids: ids("user_id") },
                { name: "machines", ids: ids("machine_id") },
                { name: "production_phases", ids: ids("production_phase_id") }
            ];

            const data = await Promise.all(queries.map(q =>
                q.ids.length ? ctx.call(`${q.name}.find`, { query: { id: q.ids } }) : []
            ));

            const maps = queries.reduce((acc, q, index) => {
                acc[q.name] = new Map(data[index].map(item => [item.id, item]));
                return acc;
            }, {});

            const assignedTasks = await ctx.call("assigned_tasks.findAssignedTasks", {
                query: { incident_id: ids("id") }
            });
            const taskMap = new Map(assignedTasks.map(task => [task.incident_id, task]));

            const company = await ctx.call("companies.get", { id: companyId });

            const incidentRows = incidents.map(incident => [
                incident.title,
                incident.description,
                maps.statuses.get(incident.status_id)?.name || 'N/A',
                maps.priorities.get(incident.priority_id)?.name || 'N/A',
                maps.categories.get(incident.category_id)?.name || 'N/A',
                maps.users.get(incident.user_id)?.name || 'N/A',
                maps.machines.get(incident.machine_id)?.name || 'N/A',
                maps.production_phases.get(incident.production_phase_id)?.name || 'N/A',
                taskMap.get(incident.id)?.id || 'N/A',
                company.name,
                incident.creation_date,
                incident.update_date
            ]);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Incidents Report');
            worksheet.addRows([
                ['Title', 'Description', 'Status', 'Priority', 'Category', 'User', 'Machine', 'Production Phase', 'Assigned Task', 'Company', 'Creation Date', 'Update Date'],
                ...incidentRows
            ]);

            const buffer = await workbook.xlsx.writeBuffer();
            const templatePath = path.join(__dirname, '../../templates/report-template.html');
            let htmlTemplate = fs.readFileSync(templatePath, 'utf8')
                .replace('COMPANY_ID', companyId)
                .replace('START_DATE', startDate)
                .replace('END_DATE', endDate);

            await ctx.call('emailService.sendIncidentNotification', {
                to: email,
                subject: 'Incidents Report',
                html: htmlTemplate,
                attachments: [{
                    filename: `Incidents_Report_${companyId}_${startDate}_${endDate}.xlsx`,
                    content: buffer,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }]
            });

            return { message: 'Report generated and sent successfully' };
        } catch (error) {
            console.error("Error fetching incidents by date range:", error);
            throw new Error(`Failed to fetch incidents: ${error.message}`);
        }
    }
};
