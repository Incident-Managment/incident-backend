"use strict";

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async CreateAssignedTask(ctx) {
        const { incident_id, assigned_user_id, company_id } = ctx.params;

        const users = await ctx.call("users.getUsersGlobal", { id: assigned_user_id });

        const user = users.find(u => u.id === assigned_user_id);

        if (!user) {
            console.error("User not found for ID:", assigned_user_id);
            throw new Error("User not found");
        }

        try {
            const now = dayjs().tz('America/Tijuana').toDate();

            const newAssignedTask = await this.adapter.insert({
                incident_id,
                assigned_user_id,
                company_id,
                assignment_date: now,
                createdAt: now,
                updatedAt: now
            });

            const phoneNumber = user.phone_number;
            if (!phoneNumber) {
                console.error("User phone number is missing for user ID:", assigned_user_id);
                throw new Error("User phone number is missing");
            }

            const message = `You have been assigned a new incident with ID: ${incident_id}`;
            console.log("Sending SMS to:", phoneNumber, "with message:", message);
            // Commenting out the SMS sending to avoid making requests
            // const smsResponse = await ctx.call("sendSMS.sendSMS", { to: phoneNumber, from: "6646141705", text: message });
            // console.log("SMS response:", smsResponse);

            return newAssignedTask;
        } catch (error) {
            console.error("Error creating assigned task:", error);
            throw new Error("Failed to create assigned task");
        }
    }
};