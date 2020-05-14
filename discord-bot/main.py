import discord

class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as {0}!'.format(self.user))

    async def on_message(self, message):
        print('Message from {0.author}: {0.content}'.format(message))
        print(message.server)

client = MyClient()
client.run('NzA5NzcxODMwMjIyNjUxNDky.Xr0WTw.q8haD1T0LLM-eVmJv0VW0N01wTQ')