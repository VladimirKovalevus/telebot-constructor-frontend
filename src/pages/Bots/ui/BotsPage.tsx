import { BotItem } from "@/entities";

const BotsPage = () => {
  const Bots = [
    {
      id: 1,
      name: "Bot 1",
      description: "Bot 1 description",
    },
    {
      id: 2,
      name: "Bot 2",
      description: "Bot 2 description",
    },
    {
      id: 3,
      name: "Bot 3",
      description: "Bot 3 description",
    },
  ];

  return (
    <>
      <header>
        <div className="container flex justify-between py-4">
          <h3></h3>
          <div>
            <button className="btn text-xl">+</button>
          </div>
        </div>
      </header>
      <main>
        <section>
          <div className="container flex flex-col gap-2">
            {Bots.map((bot) => (
              <BotItem
                key={bot.id}
                id={bot.id}
                name={bot.name}
                description={bot.description}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default BotsPage;
