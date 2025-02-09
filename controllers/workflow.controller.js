import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [5, 2, 1];

export const sendReminders = serve(async (context) => {
	const { subscriptionId } = context.requestPayload;
	const subscription = await fetchSubscription(context, subscriptionId);

	if (!subscription || subscription.status !== "active") return;

	const renewalDate = dayjs(subscription.renewalDate);
	if (renewalDate.isBefore(dayjs())) {
		console.log(
			`Renewal date has passed for subscription ${subscription.id}. Stopping Workflow.`
		);
		return;
	}

	for (const daysBefore of REMINDERS) {
		const reminderDate = renewalDate.subtract(daysBefore, "day");

		if (reminderDate.isAfter(dayjs())) {
			await sleepUntilReminder(
				context,
				`${daysBefore} days before reminder`,
				reminderDate
			);
		}

		if (dayjs().isSame(reminderDate, "day")) {
			await triggerReminder(
				context,
				`${daysBefore} days before reminder`,
				subscription
			);
		}
	}
});

const fetchSubscription = async (context, subscriptionId) => {
	return await context.run("get subscription", async () => {
		return Subscription.findById(subscriptionId).populate("user", "name email");
	});
};

const sleepUntilReminder = async (context, label, date) => {
	console.log(`Sleeping until ${label} reminder at ${date}`);
	await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
	await context.run(label, async () => {
		console.log(`Triggering ${label} reminder`);

		// Send reminder email, sms, push notification, etc.
		await sendReminderEmail({
			to: subscription.user.email,
			type: label,
			subscription,
		});
	});
};
