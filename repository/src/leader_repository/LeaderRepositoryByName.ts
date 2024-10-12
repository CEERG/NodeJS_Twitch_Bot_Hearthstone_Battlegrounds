import LeaderRepository from './LeaderRepository';

class LeaderRepositoryByName extends LeaderRepository<string> {
  getLeaderboardDatabase() {
    return 'name';
  }

  formatKeyToString(name: string): string {
    return name.toLowerCase()
  }

  findLeaderByName(name: string) {
    return this.find(name);
  }
}

export default LeaderRepositoryByName;