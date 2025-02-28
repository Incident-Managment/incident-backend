"use strict";

module.exports = {
    async featureTechnicians(ctx) {
        try {
            const assignedTasks = await this.adapter.find({});
            
            const incidentIds = assignedTasks.map(task => task.incident_id);
            
            const resolvedIncidents = await ctx.call("incidents.find", { query: { id: incidentIds, status_id: 3 } });
            
            const userPerformance = {};
            resolvedIncidents.forEach(incident => {
                const userId = assignedTasks.find(task => task.incident_id === incident.id)?.assigned_user_id;
                if (userId) {
                    userPerformance[userId] = (userPerformance[userId] || 0) + 1;
                }
            });
            
            const totalResolved = resolvedIncidents.length;
            const performanceData = Object.entries(userPerformance).map(([userId, resolvedCount]) => ({
                userId: parseInt(userId),
                efficiency: ((resolvedCount / totalResolved) * 100).toFixed(2) + "%"
            }));
            
            const users = await ctx.call("users.find", { query: { id: performanceData.map(p => p.userId) } });
            
            const result = performanceData.map(perf => {
                const user = users.find(u => u.id === perf.userId);
                return {
                    name: user ? user.name : "Unknown",
                    efficiency: perf.efficiency
                };
            });
            
            return result.sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency));
        } catch (error) {
            console.error("Error fetching top resolvers:", error);
            throw new Error("Failed to fetch top resolvers");
        }
    }
};