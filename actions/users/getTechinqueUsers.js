const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async getTechniqueUsersByRoleAndCompany (ctx) {
        try {
            console.log("Fetching users from adapter...");
            const users = await this.adapter.find();
            console.log("Users fetched:", users);

            const roleIds = [...new Set(users.map(user => user.role_id))];
            const companyIds = [...new Set(users.map(user => user.company_id))];

            console.log("Fetching roles with IDs:", roleIds);
            console.log("Fetching companies with IDs:", companyIds);

            const [roles, companies] = await Promise.all([
                ctx.call("roles.find", { id: roleIds }),
                ctx.call("companies.find", { id: companyIds })
            ]);

            console.log("Roles fetched:", roles);
            console.log("Companies fetched:", companies);

            const roleMap = roles.reduce((acc, role) => {
                acc[role.id] = role.name;
                return acc;
            }, {});

            const companyMap = companies.reduce((acc, company) => {
                acc[company.id] = company.name;
                return acc;
            }, {});

            const today = dayjs().tz('America/Tijuana').format('YYYY-MM-DD HH:mm:ss');
            console.log("Today's date:", today);

            console.log("Fetching assigned tasks...");
            const tasks = await ctx.call("assigned_tasks.find");
            console.log("Tasks fetched:", tasks);

            tasks.forEach(task => {
                console.log("Task assignment date:", dayjs(task.assignment_date).tz('America/Tijuana').format('YYYY-MM-DD'));
            });

            const todayTasks = tasks.filter(task => {
                const taskDate = dayjs(task.assignment_date).tz('America/Tijuana').format('YYYY-MM-DD');
                return taskDate === dayjs().tz('America/Tijuana').format('YYYY-MM-DD');
            });

            console.log("Today's tasks:", todayTasks);

            const taskCountMap = todayTasks.reduce((acc, task) => {
                acc[task.assigned_user_id] = (acc[task.assigned_user_id] || 0) + 1;
                return acc;
            }, {});

            console.log("Task count map:", taskCountMap);

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

            console.log("Users with details before filtering:", usersWithDetails);

            usersWithDetails = usersWithDetails.filter(user => user.role.id === 4 && user.company.id === 1);

            console.log("Users with details after filtering:", usersWithDetails);

            usersWithDetails.sort((a, b) => a.id - b.id);

            console.log("Sorted users with details:", usersWithDetails);

            return usersWithDetails;
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Failed to fetch users");
        }
    }
};