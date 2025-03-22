"use strict";
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
            const incidents = await this.adapter.find({
                query: {
                    company_id: companyId,
                    creation_date: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                }
            });

            const statusIds = [...new Set(incidents.map(incident => incident.status_id))];
            const priorityIds = [...new Set(incidents.map(incident => incident.priority_id))];
            const categoryIds = [...new Set(incidents.map(incident => incident.category_id))];
            const userIds = [...new Set(incidents.map(incident => incident.user_id))];
            const machineIds = [...new Set(incidents.map(incident => incident.machine_id))];
            const productionPhaseIds = [...new Set(incidents.map(incident => incident.production_phase_id))];
            const incidentIds = incidents.map(incident => incident.id);

            const [statuses, priorities, categories, users, machines, productionPhases, assignedTasks, company] = await Promise.all([
                ctx.call("statuses.find", { id: statusIds }),
                ctx.call("priorities.find", { id: priorityIds }),
                ctx.call("categories.find", { id: categoryIds }),
                ctx.call("users.find", { id: userIds }),
                ctx.call("machines.find", { id: machineIds }),
                ctx.call("production_phases.find", { id: productionPhaseIds }),
                ctx.call("assigned_tasks.findAssignedTasks", { query: { incident_id: incidentIds } }),
                ctx.call("companies.get", { id: companyId })
            ]);

            const statusMap = statuses.reduce((acc, status) => {
                acc[status.id] = status.name;
                return acc;
            }, {});

            const priorityMap = priorities.reduce((acc, priority) => {
                acc[priority.id] = priority.name;
                return acc;
            }, {});

            const categoryMap = categories.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});

            const userMap = users.reduce((acc, user) => {
                acc[user.id] = { name: user.name, email: user.email };
                return acc;
            }, {});

            const machineMap = machines.reduce((acc, machine) => {
                acc[machine.id] = machine.name;
                return acc;
            }, {});

            const productionPhaseMap = productionPhases.reduce((acc, phase) => {
                acc[phase.id] = phase.name;
                return acc;
            }, {});

            const assignedTaskMap = assignedTasks.reduce((acc, task) => {
                acc[task.incident_id] = {
                    id: task.id,
                    assigned_user_id: task.assigned_user_id,
                    company_id: task.company_id,
                    assignment_date: task.assignment_date,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                };
                return acc;
            }, {});

            const incidentsWithDetails = incidents.map(incident => ({
                id: incident.id,
                title: incident.title,
                description: incident.description,
                status: {
                    id: incident.status_id,
                    name: statusMap[incident.status_id]
                },
                priority: {
                    id: incident.priority_id,
                    name: priorityMap[incident.priority_id]
                },
                category: {
                    id: incident.category_id,
                    name: categoryMap[incident.category_id]
                },
                user: {
                    id: incident.user_id,
                    name: userMap[incident.user_id].name,
                    email: userMap[incident.user_id].email
                },
                machine: {
                    id: incident.machine_id,
                    name: machineMap[incident.machine_id]
                },
                production_phase: {
                    id: incident.production_phase_id,
                    name: productionPhaseMap[incident.production_phase_id]
                },
                assigned_task: assignedTaskMap[incident.id] || null,
                company: {
                    id: company.id,
                    name: company.name
                },
                creation_date: incident.creation_date,
                update_date: incident.update_date
            }));

            incidentsWithDetails.sort((a, b) => a.id - b.id);

            // Generar el reporte en Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Incidents Report');

            worksheet.columns = [
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Description', key: 'description', width: 30 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Priority', key: 'priority', width: 15 },
                { header: 'Category', key: 'category', width: 15 },
                { header: 'User', key: 'user', width: 20 },
                { header: 'Machine', key: 'machine', width: 20 },
                { header: 'Production Phase', key: 'production_phase', width: 20 },
                { header: 'Assigned Task', key: 'assigned_task', width: 20 },
                { header: 'Company', key: 'company', width: 20 },
                { header: 'Creation Date', key: 'creation_date', width: 20 },
                { header: 'Update Date', key: 'update_date', width: 20 }
            ];

            incidentsWithDetails.forEach(incident => {
                worksheet.addRow({
                    title: incident.title,
                    description: incident.description,
                    status: incident.status.name,
                    priority: incident.priority.name,
                    category: incident.category.name,
                    user: `${incident.user.name} (${incident.user.email})`,
                    machine: incident.machine.name,
                    production_phase: incident.production_phase.name,
                    assigned_task: incident.assigned_task ? incident.assigned_task.id : 'N/A',
                    company: incident.company.name,
                    creation_date: incident.creation_date,
                    update_date: incident.update_date
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();

            const templatePath = path.join(__dirname, '../../templates/report-template.html');
            let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

            htmlTemplate = htmlTemplate.replace('COMPANY_ID', companyId);
            htmlTemplate = htmlTemplate.replace('START_DATE', startDate);
            htmlTemplate = htmlTemplate.replace('END_DATE', endDate);

            await ctx.call('emailService.sendIncidentNotification', {
                to: email,
                subject: 'Incidents Report',
                html: htmlTemplate,
                attachments: [
                    {
                        filename: `Incidents_Report_${companyId}_${startDate}_${endDate}.xlsx`,
                        content: buffer,
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                ]
            });

            return { message: 'Report generated and sent successfully' };
        } catch (error) {
            console.error("Error fetching incidents by date range:", error);
            throw new Error(`Failed to fetch incidents: ${error.message}`);
        }
    }
};