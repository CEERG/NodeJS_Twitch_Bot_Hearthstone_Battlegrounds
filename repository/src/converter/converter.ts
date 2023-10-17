import { ApiLeader } from "../hearthstone_gateway/HearthstoneGateway";
import Leader from "../leader_repository/Leader";

export function convertLeaderFromApi(apiLeader: ApiLeader): Leader {
  return {
    rank: apiLeader.rank,
    accountid: apiLeader.accountid,
    rating: apiLeader.rating,
    lastUpdateTimestamp: Date.now()
  };
}

export function converLeaderFromRaw(redisLeader: any): Leader {
  return {
    rank: Number(redisLeader.rank),
    accountid: redisLeader.accountid,
    rating: Number(redisLeader.rating),
    lastUpdateTimestamp: Number(redisLeader.lastUpdateTimestamp)
  }
}