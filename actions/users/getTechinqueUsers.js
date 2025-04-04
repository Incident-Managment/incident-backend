const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async getTechniqueUsersByRoleAndCompany (ctx) {
        try {
            const users = await this.adapter.find();
            console.log("Users:", users);

            const roleIds = [...new Set(users.map(user => user.role_id))];
            const companyIds = [...new Set(users.map(user => user.company_id))];

            const [roles, companies] = await Promise.all([
                ctx.call("roles.getRolesGlobal", { id: roleIds }),
                ctx.call("companies.getCompaniesGlobal", { id: companyIds })
            ]);

            const roleMap = roles.reduce((acc, role) => {
                acc[role.id] = role.name;
                return acc;
            }, {});

            const companyMap = companies.reduce((acc, company) => {
                acc[company.id] = company.name;
                return acc;
            }, {});

            const today = dayjs().tz('America/Tijuana').format('YYYY-MM-DD HH:mm:ss');

            const tasks = await ctx.call("assigned_tasks.find");
            console.log("Tasks:", tasks);

            const todayTasks = tasks.filter(task => {
                const taskDate = dayjs(task.assignment_date).tz('America/Tijuana').format('YYYY-MM-DD');
                return taskDate === dayjs().tz('America/Tijuana').format('YYYY-MM-DD');
            });

            const taskCountMap = todayTasks.reduce((acc, task) => {
                acc[task.assigned_user_id] = (acc[task.assigned_user_id] || 0) + 1;
                return acc;
            }, {});

            let usersWithDetails = users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: {
                    id: user.role_id,
                    name: roleMap[user.role_id]
                },
                company: {
                    id: user.company_id,
                    name: companyMap[user.company_id]
                },
                creation_date: dayjs(user.creation_date).tz('America/Tijuana').format('YYYY-MM-DD HH:mm:ss'),
                phone_number: user.phone_number,
                task_count: taskCountMap[user.id] || 0
            }));

            usersWithDetails = usersWithDetails.filter(user => user.role.id === 4 && user.company.id === 1);

            usersWithDetails.sort((a, b) => a.id - b.id);

            return usersWithDetails;
        } catch (error) {
            throw new Error("Failed to fetch users");
        }
    }
};