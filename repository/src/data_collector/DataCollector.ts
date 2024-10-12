import { convertLeaderFromApi } from "../converter/converter";
import HearthstoneGateway from "../hearthstone_gateway/HearthstoneGateway";
import LeaderRepositoryByName from '../leader_repository/LeaderRepositoryByName';
import LeaderRepositoryByRank from '../leader_repository/LeaderRepositoryByRank';

require('dotenv').config();

class DataCollector {
  private hearthstoneGateway: HearthstoneGateway;
  private leaderRepositoryByName: LeaderRepositoryByName;
  private leaderRepositoryByRank: LeaderRepositoryByRank;

  constructor() {
    this.hearthstoneGateway = new HearthstoneGateway();
		this.leaderRepositoryByName = new LeaderRepositoryByName();
    this.leaderRepositoryByRank = new LeaderRepositoryByRank();
  }

  async start() {
    let page = 1;

    const pageProcessor = () => {
      setTimeout(async () => {
        try {
          var leaderboardPage = await this.hearthstoneGateway.getLeaderboardPage(page);
        } catch (error) {
          return console.log(`error getting totalPages`);
        }

        const totalPages = leaderboardPage.leaderboard.pagination.totalPages;

        await this.processPages(totalPages);

        console.log(`saved ${totalPages} pages`);

        pageProcessor();
      }, Number(process.env.data_collector_delay_ms))
    }

    pageProcessor();
  }

  async processPages(totalPages: number) {
    const pages = [...Array(totalPages).keys()];

    const processPages = pages.map(page => {
      const delay = Number(process.env.data_collector_page_delay_ms) * page;

      return this.processPageWithDelay(++page, delay);
    })

    return Promise.all(processPages);
  }

  async processPageWithDelay(page: number, delay: number) {
    return new Promise(resolve =>
      setTimeout(() =>
        this.processPage(page).then(resolve)
      , delay)
    )
  }

  async processPage(page: number) {
    try {
      var leaderboardPage = await this.hearthstoneGateway.getLeaderboardPage(page);
    } catch (error) {
      console.log(`error getting page: ${page}`);

      return;
    }

    const leaders = leaderboardPage.leaderboard.rows;

    const leadersSavedByName = Promise.all(leaders.map(leader => this.leaderRepositoryByName.save(convertLeaderFromApi(leader), leader.accountid)));
		const leadersSavedByRank = Promise.all(leaders.map(leader => this.leaderRepositoryByRank.save(convertLeaderFromApi(leader), leader.rank)));

    return Promise.all([leadersSavedByName, leadersSavedByRank]);
  }
}

export default DataCollector;