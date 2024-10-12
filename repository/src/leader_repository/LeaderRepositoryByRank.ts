import LeaderRepository from './LeaderRepository';

class LeaderRepositoryByName extends LeaderRepository<number> {
  getLeaderboardDatabase() {
    return 'rank';
  }

  formatKeyToString(rank: number): string {
    return rank.toString();
  }

  findLeaderByRank(rank: number) {
    return this.find(rank);
  }
}

export default LeaderRepositoryByName;