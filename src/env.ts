import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().min(1000),
	DISCORD_WEBHOOK_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export default env;
