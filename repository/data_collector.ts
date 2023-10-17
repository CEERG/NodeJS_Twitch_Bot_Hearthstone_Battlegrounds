import DataCollector from "./src/data_collector/DataCollector";

process.on( 'SIGTERM', () => {
  process.exit();
});

const dataCollector = new DataCollector;

dataCollector.start();