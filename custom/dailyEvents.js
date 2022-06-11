const Users = require("../models/Users")
const logger = require("../helper/_logger")
const mainHelper = require("../helper/mainHelper")

module.exports = {

	async dailyChecks(client) {

		mainHelper.logOnServer(client, "[DAILY] routine starts")
		logger.info("[DAILY] routine starts")
		await this.resetDailyClaim(client)
		await this.dailyAdjustOdaInName(client)

	},

	async resetDailyClaim(client) {
		try {
			mainHelper.logOnServer(client, "[DAILY] resetDailtClaim start")
			logger.info("[DAILY] resetDailtClaim start")
			let updated1 = await Users.updateMany(
				{ daily: false, consecutive_daily: { $gt: 0 } },
				{ $set: { consecutive_daily: 0 } })
			let updated2 = await Users.updateMany(
				{ daily: true },
				{ $set: { daily: false } })

			if (updated1.modifiedCount > 0) {
				logger.info("DAILY CLAIM RESET DONE [" + updated1.modifiedCount + "] --------")
			}
			if (updated2.modifiedCount > 0) {
				logger.info("DAILY CLAIM RESET DONE [" + updated2.modifiedCount + "] --------")
			}
			logger.info("[DAILY] resetDailtClaim end")
		} catch (err) {
			logger.error("DAILY CLAIM RESET ERROR--------")
			logger.error(err)
		}
	},

	async dailyAdjustOdaInName(client) {
		mainHelper.logOnServer(client, "[DAILY] dailyAdjustOdaInName start")
		logger.info("[DAILY] dailyAdjustOdaInName start")
		let toAddBonusRows = await Users.updateMany(
			{ oda_in_name: true, oda_in_name_bonus: false },
			{
				$set: { oda_in_name_bonus: true },
				$inc: { consecutive_oda: 1 }
			})
		logger.info("Daily adjust ODA IN NAME added ---> " + toAddBonusRows.modifiedCount)
		let toRemoveBonusRows = await Users.updateMany(
			{ oda_in_name: false, oda_in_name_bonus: true },
			{ $set: { oda_in_name_bonus: false, consecutive_oda: 0 } })
		logger.info("Daily adjust ODA IN NAME removed ---> " + toRemoveBonusRows.modifiedCount)
		logger.info("[DAILY] dailyAdjustOdaInName end")
	}

}