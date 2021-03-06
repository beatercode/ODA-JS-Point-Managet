const interactionHandler = require("../helper/interactionButtonHandler")
const mainHalper = require("../helper/mainHelper")
const logger = require("../helper/_logger")

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {

		try {
			if (interaction.isButton()) {
				// Point manager interaction
				if (interaction.message.embeds[0].title.includes("ODA Clan")) {
					interactionHandler.handlePointSystemButton(interaction)
				}
			}

			if (!interaction.isCommand()) return
			const command = interaction.client.commands.get(interaction.commandName)
			if (!command) return

			try {
				await command.execute(interaction)
			} catch (err) {
				if (err) console.error(err)

				await interaction.reply({
					content: "An error occurred while executing that command.",
					ephemeral: true,
				})
			}
		} catch (err) {
			console.log("err --->")
			console.log(err)
			mainHalper.commonCatch(err, "interactionCreate", logger)
			return
		}
	}
}