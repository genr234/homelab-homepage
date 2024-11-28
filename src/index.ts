import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { BunFile } from "bun";

interface FormBody {
	username: string;
	email: string;
	message: string;
}

const getBackground = (backgrounds: string[]): BunFile => {
	const random = Math.floor(Math.random() * backgrounds.length);
	return Bun.file(backgrounds[random]);
};

const handleForm = async (body: FormBody): Promise<void> => {
	const content = {
		content: "Hi, I just sent you a server application!",
		embeds: [
			{
				author: {
					name: `${body.username}`,
					url: `http://localhost:3000/mailto/${body.email}`,
					icon_url: `https://api.dicebear.com/9.x/adventurer/png?glassesProbability=33&width=80&height=80&seed=${body.name}`,
				},
				description: `${body.message}`,
			},
		],
	};
	fetch(
		"https://discord.com/api/webhooks/1311443699158351882/aD-eJiiJuZCmJjXvHefkKmiHOblaDNfRxv-6eqD37omzY2MwaMEleSkERpgO85VZUWrC",
		{
			method: "POST",
			body: JSON.stringify(content),
			headers: {
				"Content-Type": "application/json",
			},
		},
	)
		.then((res) => res.text())
		.then(console.log)
		.catch(console.error);
};

const backgrounds = [
	"static/backgrounds/01.jpg",
	"static/backgrounds/02.jpg",
	"static/backgrounds/03.jpg",
];

const app = new Elysia()
	.use(html())
	.get("/", () => Bun.file("src/html/index.html"))
	.get("/apply", () => Bun.file("src/html/signup.html"))
	.get("/static/:name", ({ params: { name } }) => Bun.file(`static/${name}`))
	.get("/favicon.ico", () => Bun.file("static/favicon.ico"))
	.get("/background", () => getBackground(backgrounds))
	.get("/mailto/:mail", ({ params: { mail }, redirect }) =>
		redirect(`mailto:${mail}`),
	)
	.route("POST", "/form", ({ body }) => {
		handleForm(body as FormBody);
		return Bun.file("src/html/success.html");
	})
	.onError(({ code }) => {
		if (code === "NOT_FOUND") {
			return Bun.file("src/html/404.html").text();
		}
	})
	.listen(process.env.PORT || 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
