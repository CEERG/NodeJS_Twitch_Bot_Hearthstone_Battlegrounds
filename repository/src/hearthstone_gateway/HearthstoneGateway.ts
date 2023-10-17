import axios from 'axios';

require('dotenv').config();

export default class HearthstoneGateway {
  async getLeaderboardPage(page: number): Promise<ApiResponse> {
    const url = process.env.leaderboard_url!;

    const params = {
      region: process.env.leaderboard_region,
      leaderboardId: process.env.leaderboard_id,
      page
    };

    const response = await axios.get<ApiResponse>(url, { params });

    return response.data;
  }
}

type ApiResponse = {
  leaderboard: {
    rows: ApiLeader[],
    pagination: {
      totalPages: number
    }
  }
}

export type ApiLeader = {
  rank: number,
  accountid: string,
  rating: number
}