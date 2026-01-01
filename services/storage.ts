
export interface StorageShard {
  id: string;
  name: string;
  region: string;
  status: 'ONLINE' | 'OFFLINE';
  latency: number;
}

class ShardedStorageService {
  private static instance: ShardedStorageService;
  private shards: StorageShard[] = [
    { id: 'node_alpha', name: 'Sanctuary Alpha', region: 'US-EAST', status: 'ONLINE', latency: 45 },
    { id: 'node_beta', name: 'Sanctuary Beta', region: 'EU-CENTRAL', status: 'ONLINE', latency: 112 },
    { id: 'node_gamma', name: 'Sanctuary Gamma', region: 'SG-WEST', status: 'ONLINE', latency: 230 }
  ];

  public static getInstance(): ShardedStorageService {
    if (!ShardedStorageService.instance) {
      ShardedStorageService.instance = new ShardedStorageService();
    }
    return ShardedStorageService.instance;
  }

  public getShards(): StorageShard[] {
    return [...this.shards];
  }

  public async broadcastPin(content: string): Promise<string> {
    // Simulate concurrent pinning to 3 shards
    const cid = `Qm${Array.from(content).reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16)}...peace`;
    
    // We wait for at least 2/3 shards to confirm for "Mission Critical" safety
    await Promise.all(this.shards.map(shard => 
      new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))
    ));

    return cid;
  }

  public getGatewayUrl(cid: string, shardId?: string): string {
    const shard = shardId ? this.shards.find(s => s.id === shardId) : this.shards[0];
    return `https://${shard?.id}.peace-sanctuary.io/ipfs/${cid}`;
  }
}

export const storage = ShardedStorageService.getInstance();
