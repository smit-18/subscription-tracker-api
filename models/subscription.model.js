import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Subscription name is required"],
			trim: true,
			maxlength: [100, "Subscription name cannot exceed 100 characters"],
			minlength: [2, "Subscription name must be at least 2 characters long"],
		},
		price: {
			type: Number,
			required: [true, "Subscription price is required"],
			min: [0, "Subscription price must be greater than or equal to 0"],
		},
		currency: {
			type: String,
			default: "USD",
			enum: {
				values: ["USD", "EUR", "GBP"],
				message: "Subscription currency must be either USD, EUR, or GBP",
			},
		},
		frequency: {
			type: String,
            required: [true, "Subscription frequency is required"],
			enum: {
				values: ["daily", "weekly", "monthly", "yearly"],
				message:
					"Subscription frequency must be either daily, weekly, monthly, or yearly",
			},
		},
		category: {
			type: String,
			required: [true, "Subscription category is required"],
			enum: {
				values: [
					"sports",
					"news",
					"entertainment",
					"lifestyle",
					"technology",
					"finance",
					"politics",
					"other",
				],
				message:
					"Subscription category must be either sports, news, entertainment, lifestyle, technology, finance, politics, or other",
			},
		},
		paymentMethod: {
			type: String,
			required: [true, "Payment method is required"],
			trim: true,
		},
		status: {
			type: String,
			default: "active",
			enum: {
				values: ["active", "cancelled", "expired"],
				message:
					"Subscription status must be either active, cancelled, or expired",
			},
		},
		startDate: {
			type: Date,
			required: [true, "Subscription start date is required"],
			validate: {
				validator: (value) => value <= new Date(),
				message: "Subscription start date must be in the past",
			},
		},
		renewalDate: {
			type: Date,
			validate: {
				validator: function (value) {
					return value > this.startDate;
				},
				message: "Subscription renewal date must be after the start date",
			},
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
);

// Auto calculate the renewal date based on the frequency
subscriptionSchema.pre("save", function (next) {
	if (!this.renewalDate) {
		const renewalPeriods = {
			daily: 1,
			weekly: 7,
			monthly: 30,
			yearly: 365,
		};

		this.renewalDate = new Date(this.startDate);
		this.renewalDate.setDate(
			this.renewalDate.getDate() + renewalPeriods[this.frequency]
		);
	}

	// Auto update the status if the renewal date is in the past
	if (this.renewalDate < new Date()) {
		this.status = "expired";
	}

	next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
