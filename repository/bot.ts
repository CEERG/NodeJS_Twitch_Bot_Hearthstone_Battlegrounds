import Bot from './src/bot/Bot';

process.stdin.resume();

['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, () => {
    console.log(`AAAAAAAAAAAAAAAAAA ${signal}`);
    process.exit();
  }));

process.on( 'SIGTERM', function() {
  bot.stop();

  process.exit();
});

const bot = new Bot();

bot.start();